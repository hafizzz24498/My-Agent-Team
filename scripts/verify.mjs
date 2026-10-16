import * as fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";
import { fileURLToPath, pathToFileURL } from "node:url";
import { install, makePlan } from "./install.mjs";
import { renderAdapter } from "./adapters.mjs";

const kitRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export async function runChecks({ temporaryRoot = os.tmpdir() } = {}) {
  const base = path.resolve(temporaryRoot);
  const scratch = await fs.mkdtemp(path.join(base, "software-team-check-"));
  const results = [];
  const check = async (name, fn) => {
    await fn();
    results.push({ name, result: "passed" });
  };
  const newTarget = async (name) => {
    const target = path.join(scratch, name);
    await fs.mkdir(target);
    return target;
  };
  try {
    const roster = JSON.parse(
      await fs.readFile(path.join(kitRoot, "team/roster.json"), "utf8"),
    );
    await check(
      "Seven unique native specialists and eight canonical roles",
      async () => {
        assert.equal(roster.length, 7);
        assert.equal(new Set(roster.map((r) => r.id)).size, 7);
        assert.equal(
          (await fs.readdir(path.join(kitRoot, "team/roles"))).length,
          8,
        );
        for (const r of roster) {
          assert.match(r.id, /^[a-z][a-z-]+$/);
          assert.ok(
            (
              await fs.readFile(
                path.join(kitRoot, "team/roles", r.id + ".md"),
                "utf8",
              )
            ).length > 100,
          );
        }
      },
    );
    await check(
      "Native adapter snapshots match canonical metadata and renderer",
      async () => {
        for (const tool of ["codex", "claude"])
          for (const role of roster) {
            const ext = tool === "codex" ? ".toml" : ".md";
            const content = await fs.readFile(
              path.join(
                kitRoot,
                "adapters",
                tool,
                "agents",
                "software-" + role.id + ext,
              ),
              "utf8",
            );
            assert.equal(content, renderAdapter(role, tool));
            assert.ok(
              content.includes(".software-team/roles/" + role.id + ".md"),
            );
            if (role.readOnly)
              assert.ok(
                content.includes(
                  tool === "codex"
                    ? 'sandbox_mode = "read-only"'
                    : "tools: Read, Glob, Grep",
                ),
              );
          }
      },
    );
    const target = await newTarget("both");
    const originalInstructions =
      "# Existing project instructions\nKeep this file.\n";
    await fs.writeFile(path.join(target, "AGENTS.md"), originalInstructions);
    await fs.writeFile(path.join(target, "CLAUDE.md"), originalInstructions);
    await fs.mkdir(path.join(target, ".codex"));
    await fs.writeFile(
      path.join(target, ".codex/config.toml"),
      "# Existing settings\n",
    );
    await check("Dry run performs no writes", async () => {
      const before = (await fs.readdir(target)).sort();
      const plan = await install({ target });
      assert.equal(plan.tool, "both");
      assert.ok(plan.files.every((f) => f.action === "create"));
      assert.equal(
        JSON.stringify((await fs.readdir(target)).sort()),
        JSON.stringify(before),
      );
      await assert.rejects(fs.stat(path.join(target, ".software-team")), {
        code: "ENOENT",
      });
    });
    await check(
      "Both-runtime install preserves instructions and runtime settings",
      async () => {
        const plan = await install({ target, apply: true });
        for (const file of plan.files)
          assert.equal(await fs.readFile(file.full, "utf8"), file.content);
        assert.equal(
          await fs.readFile(path.join(target, "AGENTS.md"), "utf8"),
          originalInstructions,
        );
        assert.equal(
          await fs.readFile(path.join(target, "CLAUDE.md"), "utf8"),
          originalInstructions,
        );
        assert.equal(
          await fs.readFile(path.join(target, ".codex/config.toml"), "utf8"),
          "# Existing settings\n",
        );
      },
    );
    await check(
      "Repeat install is idempotent and preserves edited project context",
      async () => {
        await fs.writeFile(
          path.join(target, ".software-team/PROJECT.md"),
          "# My project\n",
        );
        const plan = await install({ target, apply: true });
        assert.ok(
          plan.files.every((f) => ["unchanged", "preserve"].includes(f.action)),
        );
        assert.equal(
          await fs.readFile(
            path.join(target, ".software-team/PROJECT.md"),
            "utf8",
          ),
          "# My project\n",
        );
      },
    );
    await check(
      "Conflicts stop before any planned files are written",
      async () => {
        const conflict = await newTarget("conflict");
        await fs.mkdir(path.join(conflict, ".claude/agents"), {
          recursive: true,
        });
        const existing = path.join(
          conflict,
          ".claude/agents/software-security.md",
        );
        await fs.writeFile(existing, "# User customization\n");
        await assert.rejects(
          install({ target: conflict, apply: true }),
          /No files written. Conflicts/,
        );
        assert.equal(
          await fs.readFile(existing, "utf8"),
          "# User customization\n",
        );
        await assert.rejects(fs.stat(path.join(conflict, ".software-team")), {
          code: "ENOENT",
        });
      },
    );
    await check("Each runtime can be installed independently", async () => {
      for (const tool of ["codex", "claude"]) {
        const selected = await newTarget(tool);
        await install({ target: selected, tool, apply: true });
        assert.equal(
          (await fs.readdir(path.join(selected, "." + tool, "agents"))).length,
          7,
        );
        await assert.rejects(
          fs.stat(path.join(selected, tool === "codex" ? ".claude" : ".codex")),
          { code: "ENOENT" },
        );
      }
    });
    await check(
      "Invalid input and parent-file collisions fail before writing",
      async () => {
        await assert.rejects(
          makePlan({ target, tool: "unknown" }),
          /Invalid tool/,
        );
        await assert.rejects(makePlan({}), /explicit target/);
        await assert.rejects(
          makePlan({ target: path.join(scratch, "absent") }),
          /existing directory/,
        );
        const collision = await newTarget("parent-file");
        await fs.writeFile(path.join(collision, ".codex"), "not a directory");
        await assert.rejects(install({ target: collision, apply: true }));
        await assert.rejects(fs.stat(path.join(collision, ".software-team")), {
          code: "ENOENT",
        });
      },
    );
    const linked = await newTarget("linked");
    const outside = await newTarget("outside");
    let symlinkCreated = false;
    try {
      await fs.symlink(
        outside,
        path.join(linked, ".software-team"),
        "junction",
      );
      symlinkCreated = true;
    } catch (error) {
      if (!["EPERM", "EACCES", "ENOTSUP"].includes(error.code)) throw error;
      results.push({
        name: "Symlink/junction rejection",
        result: "not run",
        reason: error.code,
      });
    }
    if (symlinkCreated)
      await check("Symlink/junction rejection", async () => {
        await assert.rejects(
          install({ target: linked, apply: true }),
          /Symlink\/junction/,
        );
        assert.equal((await fs.readdir(outside)).length, 0);
      });
    await check(
      "Markdown local links point to existing source files",
      async () => {
        async function walk(dir) {
          for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
            if (entry.name.startsWith(".")) continue;
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) await walk(full);
            else if (entry.name.endsWith(".md")) {
              const content = await fs.readFile(full, "utf8");
              for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
                const link = match[1].split("#")[0];
                if (!link || /^[a-z]+:/i.test(link)) continue;
                assert.ok(
                  (
                    await fs.stat(path.resolve(path.dirname(full), link))
                  ).isFile(),
                  full + ": " + link,
                );
              }
            }
          }
        }
        await walk(kitRoot);
      },
    );
    return results;
  } finally {
    // Delete only this test's verified temporary directory, never the supplied base.
    assert.equal(path.dirname(scratch), base);
    assert.ok(path.basename(scratch).startsWith("software-team-check-"));
    await fs.rm(scratch, { recursive: true, force: true });
  }
}

if (
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  runChecks()
    .then((results) => {
      for (const result of results)
        console.log(
          result.result +
            ": " +
            result.name +
            (result.reason ? " (" + result.reason + ")" : ""),
        );
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

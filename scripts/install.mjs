import * as fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderAdapter } from "./adapters.mjs";

const sourceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const usage =
  "node scripts/install.mjs --target <existing-project-directory> [--tool both|codex|claude] [--dry-run|--apply]";

async function exists(p) {
  try {
    return await fs.lstat(p);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function guardAncestors(p) {
  let cursor = path.resolve(p);
  while (true) {
    const stat = await exists(cursor);
    if (stat?.isSymbolicLink())
      throw new Error("Symlink/junction destination refused: " + cursor);
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
}

async function collectTree(directory, relative = "") {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const rel = path.posix.join(relative, entry.name);
    const full = path.join(directory, entry.name);
    if (entry.isSymbolicLink())
      throw new Error("Source symlink refused: " + full);
    if (entry.isDirectory()) result.push(...(await collectTree(full, rel)));
    else if (entry.isFile())
      result.push([rel, await fs.readFile(full, "utf8")]);
  }
  return result;
}

export async function makePlan({ target, tool = "both" }) {
  if (!target) throw new Error("An explicit target is required.");
  if (!["both", "codex", "claude"].includes(tool))
    throw new Error("Invalid tool: " + tool);
  const destination = path.resolve(target);
  await guardAncestors(destination);
  if (!(await exists(destination))?.isDirectory())
    throw new Error("Target must be an existing directory: " + destination);
  const tree = await collectTree(path.join(sourceRoot, "team"));
  const files = tree.map(([rel, content]) => ({
    relative: ".software-team/" + rel,
    content,
  }));
  const version = await fs.readFile(path.join(sourceRoot, "VERSION"), "utf8");
  files.push({ relative: ".software-team/VERSION", content: version });
  const projectTemplate = tree.find(
    ([rel]) => rel === "templates/project.md",
  )[1];
  files.push({
    relative: ".software-team/PROJECT.md",
    content: projectTemplate,
    preserve: true,
  });
  const roster = JSON.parse(tree.find(([rel]) => rel === "roster.json")[1]);
  for (const selected of tool === "both" ? ["codex", "claude"] : [tool]) {
    for (const role of roster) {
      files.push({
        relative:
          "." +
          selected +
          "/agents/software-" +
          role.id +
          (selected === "codex" ? ".toml" : ".md"),
        content: renderAdapter(role, selected),
      });
    }
  }
  const plan = [];
  for (const file of files) {
    const full = path.resolve(destination, file.relative);
    if (!full.startsWith(destination + path.sep))
      throw new Error("Path escaped target.");
    await guardAncestors(full);
    const stat = await exists(full);
    // Existing parent files must fail before any writes.
    let parent = path.dirname(full);
    while (parent !== destination) {
      const parentStat = await exists(parent);
      if (parentStat && !parentStat.isDirectory())
        throw new Error("Parent is not a directory: " + parent);
      parent = path.dirname(parent);
    }
    let action = "create";
    if (stat) {
      if (!stat.isFile())
        throw new Error("Destination is not a regular file: " + full);
      action = file.preserve
        ? "preserve"
        : (await fs.readFile(full, "utf8")) === file.content
          ? "unchanged"
          : "conflict";
    }
    plan.push({ ...file, full, action });
  }
  return { target: destination, tool, version: version.trim(), files: plan };
}

export async function install(options) {
  const plan = await makePlan(options);
  const conflicts = plan.files.filter((file) => file.action === "conflict");
  if (conflicts.length)
    throw new Error(
      "No files written. Conflicts: " +
        conflicts.map((file) => file.relative).join(", "),
    );
  if (options.apply) {
    for (const file of plan.files.filter((file) => file.action === "create")) {
      // Recheck immediately before writing; exclusive creation never replaces an existing file.
      await guardAncestors(file.full);
      await fs.mkdir(path.dirname(file.full), { recursive: true });
      await fs.writeFile(file.full, file.content, {
        encoding: "utf8",
        flag: "wx",
      });
    }
  }
  return plan;
}

export async function main(args = process.argv.slice(2)) {
  if (args.includes("--help")) {
    console.log(usage);
    return;
  }
  const options = { tool: "both", apply: false };
  let mode;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--target" || arg === "--tool") {
      const value = args[++i];
      if (!value || value.startsWith("--"))
        throw new Error("Missing value for " + arg);
      options[arg.slice(2)] = value;
    } else if (arg === "--apply" || arg === "--dry-run") {
      if (mode && mode !== arg)
        throw new Error("Choose either --apply or --dry-run.");
      mode = arg;
      options.apply = arg === "--apply";
    } else throw new Error("Unknown argument: " + arg);
  }
  const plan = await install(options);
  console.log(
    (options.apply ? "Installed" : "Dry run") +
      " Software Team " +
      plan.version +
      " → " +
      plan.target,
  );
  for (const file of plan.files) console.log(file.action + " " + file.relative);
  console.log(
    "AGENTS.md, CLAUDE.md and existing runtime settings are untouched.",
  );
  console.log(
    "Next: fill .software-team/PROJECT.md, open a new session and invoke .software-team/START.md.",
  );
}

if (
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

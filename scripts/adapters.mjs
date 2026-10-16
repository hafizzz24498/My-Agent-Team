export function renderAdapter(role, tool) {
  const name = "software-" + role.id;
  const instructions = [
    "Work as the assigned specialist; the primary conversation is Lead/BA.",
    "Read .software-team/policy.md, .software-team/PROJECT.md and .software-team/roles/" +
      role.id +
      ".md from the project root before acting.",
    "Follow the supplied task packet and applicable repository instructions. Ask Lead for missing context.",
    "Return evidence and blockers to Lead; do not delegate recursively.",
    role.readOnly
      ? "Perform static read-only inspection. Request executable checks through Lead/QA."
      : "Edit only paths assigned by Lead and report actual validation outcomes.",
  ].join("\n");
  if (tool === "codex") {
    return (
      "name = " +
      JSON.stringify(name) +
      "\n" +
      "description = " +
      JSON.stringify(role.description) +
      "\n" +
      (role.readOnly ? 'sandbox_mode = "read-only"\n' : "") +
      "developer_instructions = " +
      JSON.stringify(instructions) +
      "\n"
    );
  }
  if (tool === "claude") {
    return (
      "---\nname: " +
      name +
      "\ndescription: " +
      JSON.stringify(role.description) +
      "\nmodel: inherit\n" +
      (role.readOnly ? "tools: Read, Glob, Grep\n" : "") +
      "---\n\n" +
      instructions +
      "\n"
    );
  }
  throw new Error("Unsupported tool: " + tool);
}

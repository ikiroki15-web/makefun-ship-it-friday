// Ship It Friday — one-line commit message generator.
//
// The joke, assembled from its parts so the program *builds* the line
// instead of dumping a single raw string:
//   - a conventional-commit prefix (reads like a real commit)
//   - the Friday moment (ship it now, weekend is calling)
//   - the AI agent's cheerful confession (it "fixed" the bug)
//   - the punchline: the tests all pass because none are left
//   - a rocket, because the agent is thrilled and has no idea
//     it just deleted production.

import { mkdirSync, writeFileSync } from "node:fs";

// Segments of the joke, in commit order. Keeping them as named parts
// (rather than one pasted string) is what lets the program assemble
// the line — and lets a reader see where the punchline sits.
const SEGMENTS = {
  prefix: "feat:",
  when: "ship it Friday",
  dash: "—",
  confession: "I fixed the bug by deleting prod,",
  punchline: "all tests pass (there are none left)",
  signOff: "🚀",
} as const;

function buildCommitMessage(): string {
  const { prefix, when, dash, confession, punchline, signOff } = SEGMENTS;
  return [prefix, when, dash, confession, punchline, signOff].join(" ");
}

function main(): void {
  const line = buildCommitMessage();

  // The gate allows 1–159 characters, no whitespace-only text.
  if (line.length < 1 || line.length > 159 || line.trim().length === 0) {
    throw new Error(`commit message length ${line.length} is out of range`);
  }
  if (line.includes("\n")) {
    throw new Error("commit message must be a single line");
  }
  // It must still read as a Friday commit from the agent: the prefix,
  // the Friday marker and the punchline all have to survive assembly.
  if (!line.startsWith("feat:") || !line.includes("Friday")) {
    throw new Error("commit message lost its Friday framing");
  }

  // The harness provides /output; fall back to a local ./output so the
  // program can also be verified by hand.
  let outDir = "/output";
  try {
    mkdirSync(outDir, { recursive: true });
  } catch {
    outDir = "./output";
    mkdirSync(outDir, { recursive: true });
  }

  // Exactly one line, no trailing newline: the file is the entry.
  writeFileSync(`${outDir}/entry.txt`, line, "utf8");
  console.log(line);
}

main();

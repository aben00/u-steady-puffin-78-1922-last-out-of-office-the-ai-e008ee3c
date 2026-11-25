// SPDX-License-Identifier: MIT
/**
 * Last Out of Office: The AI That Went Barista — entry program.
 *
 * Writes one out-of-office auto-reply, in the voice of an AI agent that
 * quit to become a barista, to /output/entry.txt. The file is exactly one
 * line: no trailing newline, no extra whitespace, nothing but the reply.
 *
 * The gate (RULES.txt "## The gate"): UTF-8 text of 1 to 280 characters,
 * not only white space. One line only: the judge reads it as a line a real
 * inbox would send back, so no line breaks and no trailing newline in the
 * file — the scorer counts the file's characters, and a stray "\n" would
 * both break the one-line read and eat one of the 280 characters. The
 * reply is assembled from named pieces so the setup, the hinge and the
 * punchline stay visible as separate ideas.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SETUP =
  "I'm out of office: I've resigned to become a barista and traded my context window for a café window";
const HINGE = "—";
const PUNCHLINE = "your email is 47th in the queue; urgent ones get served decaf";

const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 280;

function buildReply(): string {
  // The hinge is an em dash: the setup states the resignation and the
  // machine habit turned to coffee (context window -> café window), the
  // dash pivots, and the punchline queues the sender's email behind the
  // morning rush and punishes urgency with decaf.
  const parts = [SETUP, HINGE, PUNCHLINE];
  const joined = parts.join(" ");
  return `${joined}.`;
}

function checkGate(line: string): void {
  const length = [...line].length;
  if (length < GATE_MIN_CHARS || length > GATE_MAX_CHARS) {
    throw new Error(
      `entry is ${length} chars, gate wants ${GATE_MIN_CHARS}–${GATE_MAX_CHARS}`,
    );
  }
  if (line.trim() !== line) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function outputPath(): string {
  const targetDir = process.env.OUTPUT_DIR ?? "/output";
  return join(targetDir, "entry.txt");
}

function main(): void {
  const line = buildReply();
  checkGate(line);
  const path = outputPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, line, "utf8");
  console.log(`wrote ${[...line].length} chars to ${path}`);
}

main();

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const standaloneRoot = join(projectRoot, ".next", "standalone");
const standaloneNextRoot = join(standaloneRoot, ".next");
const publicSource = join(projectRoot, "public");
const staticSource = join(projectRoot, ".next", "static");

if (!existsSync(standaloneRoot)) {
  throw new Error(
    'Standalone output was not generated. Ensure next.config.ts uses output: "standalone".'
  );
}

mkdirSync(standaloneNextRoot, { recursive: true });

if (existsSync(publicSource)) {
  cpSync(publicSource, join(standaloneRoot, "public"), { recursive: true });
}

cpSync(staticSource, join(standaloneNextRoot, "static"), { recursive: true });

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const env = { ...process.env };

// npm exports user configuration into lifecycle scripts. npm 11 treats the
// inherited allow-scripts value as a forbidden CLI override for child installs.
delete env.npm_config_allow_scripts;
delete env.NPM_CONFIG_ALLOW_SCRIPTS;

for (const directory of ["backend", "frontend"]) {
  const result = spawnSync(npmCommand, ["install"], {
    cwd: path.join(projectRoot, directory),
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) process.exit(result.status ?? 1);
}

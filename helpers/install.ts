import chalk from "chalk";
import { spawn } from "child_process";
import { MESSAGES } from "../utils/messages";
import { checkGitDirectory } from "./checkGitDirectory";

const runCommand = async (command: string, args: string[], cwd: string) => {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      cwd,
      shell: process.platform === "win32",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error("Command failed to execute."));
      }
    });

    child.on("error", reject);
  });
};

const installDependencies = async (
  destinationPath: string,
  packageManager: string,
  dependencies: string[],
  isDev = false
) => {
  let args = [packageManager === "yarn" ? "add" : "install", ...dependencies];
  if (isDev) {
    args.push(packageManager === "yarn" ? "--dev" : "-D");
  }

  // Corregir argumentos para Windows
  if (process.platform === "win32") {
    args = ["/c", packageManager].concat(args);
  }

  await runCommand(
    process.platform === "win32" ? "cmd" : packageManager,
    args,
    destinationPath
  );
  console.info(
    chalk.green(MESSAGES.DEPENDENCIES_INSTALLATION_SUCCEED(packageManager))
  );
};

const initializeHusky = async (destinationPath) => {
  await runCommand("npx", ["husky", "init"], destinationPath);
  console.info(chalk.green("Husky initialization successful."));
};

export const installAndConfigDependencies = async (
  destinationPath: string,
  packageManager: string
) => {
  const devDependencies = [
    "husky",
    "conventional-changelog",
    "cz-conventional-changelog",
    "@commitlint/cli",
    "@commitlint/config-conventional",
    "@commitlint/prompt-cli",
  ];

  const productionDependencies = ["@swc/cli", "@swc/core", "@swc/jest"];

  try {
    console.info(chalk.blue("Installing development dependencies..."));
    await installDependencies(
      destinationPath,
      packageManager,
      devDependencies,
      true
    );

    if (productionDependencies.length > 0) {
      console.info(chalk.blue("Installing production dependencies..."));
      await installDependencies(
        destinationPath,
        packageManager,
        productionDependencies
      );
    }

    const exists = await checkGitDirectory(destinationPath);
    if (!exists) {
      runCommand("git", ["init"], destinationPath);
    }

    console.info(chalk.blue("Initializing Husky..."));
    await initializeHusky(destinationPath);

    console.info(chalk.green("Setup complete."));
  } catch (error) {
    console.error(chalk.red(`Setup failed: ${error.message}`));
  }
};

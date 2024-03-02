import chalk from "chalk";

export const showConsoleInfo = async (packageManager: string, projectName: string, nestProject: boolean = false) => {
  console.log("Inside that directory, you can run several commands:");
  console.log();
  console.log(
    chalk.cyan(
      `  ${packageManager} ${packageManager !== "npm" ? "" : "run"} ${nestProject ? "start:dev" : "dev"}`
    )
  );
  console.log("    Starts the development server.");
  console.log();
  console.log(
    chalk.cyan(
      `  ${packageManager} ${packageManager !== "npm" ? "" : "run"} ${nestProject ? "start:build" : "build"}`
    )
  );
  console.log("    Builds the app for production.");
  console.log();
  console.log(chalk.cyan(`  ${packageManager} start`));
  console.log("    Runs the built app in production mode.");
  console.log();
  console.log("We suggest that you begin by typing:");
  console.log();
  console.log(chalk.cyan("  cd"), projectName);
  console.log(
    `  ${chalk.cyan(
      `${packageManager} ${packageManager !== "npm" ? "" : "run"} ${nestProject ? "start:dev" : "dev"}`
    )}`
  );
};

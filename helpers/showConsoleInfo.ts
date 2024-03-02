import chalk from "chalk";

export const showConsoleInfo = async (packageManager: string, projectName: string, nestProject: boolean = false) => {
  console.log();
  console.info(chalk.yellow("Dont forget to copy the .env.example file to .env and fill in the necessary environment variables."));
  console.info(chalk.red("IMPORTANT: Dont delete the .env.example file, it is used as a reference for the environment variables."));
  console.log();
  console.info("Inside that directory, you can run several commands:");
  console.log();
  console.info(
    chalk.cyan(
      `  ${packageManager}${packageManager !== "npm" ? "" : "run"} ${nestProject ? "start:dev" : "dev"}`
    )
  );
  console.info("    Starts the development server.");
  console.log();
  console.info(
    chalk.cyan(
      `  ${packageManager}${packageManager !== "npm" ? "" : "run"} ${nestProject ? "start:build" : "build"}`
    )
  );
  console.info("    Builds the app for production.");
  console.log();
  console.info(chalk.cyan(`  ${packageManager} start`));
  console.info("    Runs the built app in production mode.");
  console.log();
  console.info("We suggest that you begin by typing:");
  console.log();
  console.info(chalk.cyan("  cd"), projectName);
  console.info(
    `  ${chalk.cyan(
      `${packageManager}${packageManager !== "npm" ? "" : "run"} ${nestProject ? "start:dev" : "dev"}`
    )}`
  );
};

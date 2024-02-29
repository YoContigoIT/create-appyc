#!/usr/bin/env node

// index.ts
import { program } from "commander";

// actions/create.ts
import inquirer from "inquirer";
import fs from "fs/promises";
import path2 from "path";
import { fileURLToPath } from "url";

// utils/messages.ts
import chalk from "chalk";

// utils/emojis.ts
import { get } from "node-emoji";
var EMOJIS = {
  HEART: get("heart"),
  COFFEE: get("coffee"),
  BEER: get("beer"),
  BROKEN_HEART: get("broken_heart"),
  CRYING: get("crying_cat_face"),
  HEART_EYES: get("heart_eyes_cat"),
  JOY: get("joy_cat"),
  KISSING: get("kissing_cat"),
  SCREAM: get("scream_cat"),
  ROCKET: get("rocket"),
  SMIRK: get("smirk_cat"),
  RAISED_HANDS: get("raised_hands"),
  POINT_RIGHT: get("point_right"),
  ZAP: get("zap"),
  BOOM: get("boom"),
  PRAY: get("pray"),
  WINE: get("wine_glass")
};

// utils/messages.ts
var MESSAGES = {
  PACKAGE_MANAGER_INSTALLATION_SUCCEED: (name) => name !== "." ? `${EMOJIS.ROCKET}  Successfully created project ${chalk.green(name)}` : `${EMOJIS.ROCKET}  Successfully created a new project`,
  DEPENDENCIES_INSTALLATION_SUCCEED: (name) => `${EMOJIS.ROCKET}  Dependencies installed successfully with ${chalk.green(name)}`,
  PACKAGE_MANAGER_INSTALLATION_FAILED: (commandToRunManually) => `${EMOJIS.SCREAM}  Packages installation failed!
In case you don't see any errors above, consider manually running the failed command ${commandToRunManually} to see more details on why it errored out.`,
  PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: `Package installation in progress... ${EMOJIS.COFFEE}`,
  DIRECTORY_ALREADY_EXISTS: (directory) => `${EMOJIS.SCREAM}  The directory ${chalk.red(directory)} already exists. Aborting...`,
  CONFIG_INIT_SUCCEED: (project) => `${EMOJIS.ROCKET}  Successfully initialized the configuration for projects of ${chalk.green(project)}`,
  CONFIG_INIT_FAILED: `${EMOJIS.SCREAM}  Configuration initialization failed!`
};

// utils/template-choices.ts
var templateChoices = {
  "nestjs-jwt-strategy": {
    value: "nestjs-jwt-strategy",
    description: "NestJS with JWT Strategy"
  },
  "nodejs-express-basic": {
    value: "nodejs-express-basic",
    description: "Node.js with TypeScript"
  }
};
var connectorsDatabaseChoices = {
  "sequelize": {
    value: "sequelize",
    description: "Sequelize"
  },
  "typeorm": {
    value: "typeorm",
    description: "TypeORM"
  }
};
var databaseChoises = {
  "mongodb": {
    value: "mongodb",
    description: "MongoDB Database"
  },
  "mysql": {
    value: "mysql",
    description: "MySQL Database"
  },
  "postgres": {
    value: "postgres",
    description: "Postgres Database"
  }
};
var configChoices = {
  "nestjs": {
    value: "nestjs",
    description: "Config for NestJS"
  },
  "express": {
    value: "express",
    description: "Config for Express with TypeScript"
  }
};

// actions/create.ts
import chalk3 from "chalk";

// helpers/index.ts
import { readFile } from "fs/promises";

// helpers/install.ts
import chalk2 from "chalk";
import { spawn } from "child_process";
import os from "os";
import path from "path";
import { writeFile } from "fs/promises";

// helpers/searchLockFile.ts
import { readdir } from "fs/promises";
async function searchLockFile(destinationPath) {
  try {
    const files = await readdir(destinationPath);
    const regex = /^(yarn\.lock|package-lock\.json|pnpm-lock\.yaml)$/;
    const matchedFiles = files.filter((file) => regex.test(file));
    return matchedFiles;
  } catch (err) {
    console.error("Error al leer el directorio:", err);
    return [];
  }
}

// helpers/install.ts
var installDependenciesInNewProject = async (destinationPath, packageManager, projectName) => {
  const installProcess = spawn(packageManager, ["install"], {
    stdio: "inherit",
    cwd: destinationPath
  });
  installProcess.on("exit", (code) => {
    if (code === 0) {
      console.info(chalk2.green(MESSAGES.PACKAGE_MANAGER_INSTALLATION_SUCCEED(packageManager)));
      console.log("Inside that directory, you can run several commands:");
      console.log();
      console.log(chalk2.cyan(`  ${packageManager} ${packageManager !== "npm" ? "" : "run "}dev`));
      console.log("    Starts the development server.");
      console.log();
      console.log(chalk2.cyan(`  ${packageManager} ${packageManager !== "npm" ? "" : "run "}build`));
      console.log("    Builds the app for production.");
      console.log();
      console.log(chalk2.cyan(`  ${packageManager} start`));
      console.log("    Runs the built app in production mode.");
      console.log();
      console.log("We suggest that you begin by typing:");
      console.log();
      console.log(chalk2.cyan("  cd"), projectName);
      console.log(`  ${chalk2.cyan(`${packageManager} ${packageManager !== "npm" ? "" : "run "}dev`)}`);
    } else {
      chalk2.red(
        MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
          chalk2.bold(packageManager)
        )
      );
    }
  });
  installProcess.on("error", (error) => {
    chalk2.red(
      MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
        chalk2.bold(packageManager)
      )
    );
  });
};
var installConfigDependencies = async (sourcePath, destinationPath) => {
  const packageJSONOrigin = await readPackageJson(sourcePath);
  const packageJSONDestination = await readPackageJson(path.join(destinationPath, "package.json"));
  const [lockFile] = await searchLockFile(destinationPath);
  const mergedPackageJSON = {
    ...packageJSONDestination,
    scripts: {
      ...packageJSONDestination.scripts,
      ...packageJSONOrigin.scripts
    },
    dependencies: {
      ...packageJSONDestination.dependencies,
      ...packageJSONOrigin.dependencies
    },
    devDependencies: {
      ...packageJSONDestination.devDependencies,
      ...packageJSONOrigin.devDependencies
    },
    config: {
      ...packageJSONDestination.config,
      ...packageJSONOrigin.config
    }
  };
  await writeFile(
    path.join(destinationPath, "package.json"),
    JSON.stringify(mergedPackageJSON, null, 2) + os.EOL
  );
  const packageManager = extractPackageManager(lockFile) ?? "npm";
  const args = [
    packageManager === "yarn" ? "add" : "install",
    "husky",
    "conventional-changelog",
    "cz-conventional-changelog",
    "@commitlint/cli",
    "@commitlint/config-conventional",
    "@commitlint/prompt-cli"
  ];
  const installProcess = spawn(packageManager, args, {
    stdio: "inherit",
    cwd: destinationPath
  });
  installProcess.on("exit", async (code) => {
    if (code === 0) {
      console.info(chalk2.green(MESSAGES.DEPENDENCIES_INSTALLATION_SUCCEED(packageManager)));
      const huskyInitProcess = spawn("npx", ["husky", "init"], {
        stdio: "inherit",
        cwd: destinationPath
      });
      huskyInitProcess.on("exit", (huskyCode) => {
        if (huskyCode === 0) {
          console.info(chalk2.green("Husky initialization successful."));
        } else {
          console.error(chalk2.red("Husky initialization failed."));
        }
      });
    } else {
      chalk2.red(
        MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
          chalk2.bold(packageManager)
        )
      );
    }
  });
  installProcess.on("error", (error) => {
    chalk2.red(
      MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
        chalk2.bold(packageManager)
      )
    );
  });
};

// helpers/index.ts
var extractPackageManager = (filePath) => {
  const match = filePath.match(/\/(pnpm|npm|yarn)/);
  return match ? match[1] : null;
};
async function readPackageJson(filePath) {
  const data = await readFile(filePath, "utf-8");
  return JSON.parse(data);
}

// actions/create.ts
var create = async () => {
  const initialOptions = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Select a template:",
      choices: Object.keys(templateChoices)
    },
    {
      type: "list",
      name: "database",
      message: "Select the database to use:",
      choices: Object.keys(databaseChoises)
    }
  ]);
  let useDatabase = { connector: "" };
  if (initialOptions.database !== "mongodb") {
    useDatabase = await inquirer.prompt([
      {
        type: "list",
        name: "connector",
        message: "Select the connector to use:",
        choices: Object.keys(connectorsDatabaseChoices)
      }
    ]);
  }
  const configProyect = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Project name:",
      default: "my-app",
      validate: (input) => {
        if (/^([A-Za-z\-\_\d])+$/.test(input))
          return true;
        else
          return "Project name may only include letters, numbers, underscores and hashes.";
      }
    },
    {
      type: "list",
      name: "packageManager",
      message: "Select a package manager:",
      choices: ["npm", "yarn", "pnpm"]
    }
  ]);
  const project = templateChoices[initialOptions.template];
  const projectDirectory = configProyect.name;
  const destination = path2.join(process.cwd(), projectDirectory);
  const template = path2.join(
    path2.dirname(fileURLToPath(import.meta.url)),
    "templates",
    project.value
  );
  fs.mkdir(destination).catch((err) => {
    console.error(chalk3.red(MESSAGES.DIRECTORY_ALREADY_EXISTS(projectDirectory)));
    process.exit(1);
  });
  if (initialOptions.database !== "mongodb") {
    await fs.cp(path2.join(template, `${initialOptions.database}/${useDatabase.connector}`), destination, { recursive: true });
  } else {
    await fs.cp(path2.join(template, "mongoose"), destination, { recursive: true });
  }
  await installDependenciesInNewProject(destination, configProyect.packageManager, projectDirectory);
};

// actions/config.ts
import inquirer2 from "inquirer";
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var config = () => {
  inquirer2.prompt([
    {
      type: "list",
      name: "projectConfig",
      message: "Select your project:",
      choices: Object.keys(configChoices)
    },
    {
      type: "list",
      name: "type",
      message: "Select your project:",
      choices: ["monolithic"]
    }
  ]).then(async (answers) => {
    const project = answers.projectConfig;
    const typeProject = answers.type;
    const destination = process.cwd();
    const projectConfig = path3.join(
      path3.dirname(fileURLToPath2(import.meta.url)),
      "configs",
      `${project}/${typeProject}`
    );
    await installConfigDependencies(path3.join(projectConfig, "package.json"), destination);
  });
};

// package.json
var version = "1.1.0";

// index.ts
program.name("create-appyc").version(version, "-v, --version", "Output the current version").description("Create a new project with Appyc");
program.command("create").description("Create a new project").action(create);
program.command("config").description("Initialize the configuration").action(config);
if (process.argv.length <= 2)
  console.log(program.help());
else
  program.parse();
//# sourceMappingURL=index.mjs.map
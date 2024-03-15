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
  DEPENDENCIES_INSTALLATION_FAILED: `${EMOJIS.SCREAM}  Dependencies installation failed!`,
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
  }
  // 'nodejs-express-basic': {
  //   value: 'nodejs-express-basic',
  //   description: 'Node.js with TypeScript'
  // }
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
import chalk4 from "chalk";

// helpers/index.ts
import { readFile } from "fs/promises";

// helpers/install.ts
import chalk2 from "chalk";
import { spawn } from "child_process";

// helpers/checkGitDirectory.ts
import { access } from "fs/promises";
import path from "path";
var checkGitDirectory = async (directory) => {
  try {
    const gitPath = path.join(directory, ".git");
    await access(gitPath);
    return true;
  } catch (err) {
    return false;
  }
};

// helpers/install.ts
var runCommand = async (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      cwd,
      shell: process.platform === "win32"
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
var installDependencies = async (destinationPath, packageManager, dependencies, isDev = false) => {
  let args = [packageManager === "yarn" ? "add" : "install", ...dependencies];
  if (isDev) {
    args.push(packageManager === "yarn" ? "--dev" : "-D");
  }
  if (process.platform === "win32") {
    args = ["/c", packageManager].concat(args);
  }
  await runCommand(
    process.platform === "win32" ? "cmd" : packageManager,
    args,
    destinationPath
  );
  console.info(
    chalk2.green(MESSAGES.DEPENDENCIES_INSTALLATION_SUCCEED(packageManager))
  );
};
var initializeHusky = async (destinationPath) => {
  await runCommand("npx", ["husky", "init"], destinationPath);
  console.info(chalk2.green("Husky initialization successful."));
};
var installAndConfigDependencies = async (destinationPath, packageManager) => {
  const devDependencies = [
    "husky",
    "conventional-changelog",
    "cz-conventional-changelog",
    "@commitlint/cli",
    "@commitlint/config-conventional",
    "@commitlint/prompt-cli"
  ];
  const productionDependencies = ["@swc/cli", "@swc/core", "@swc/jest"];
  try {
    console.info(chalk2.blue("Installing development dependencies..."));
    await installDependencies(
      destinationPath,
      packageManager,
      devDependencies,
      true
    );
    if (productionDependencies.length > 0) {
      console.info(chalk2.blue("Installing production dependencies..."));
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
    console.info(chalk2.blue("Initializing Husky..."));
    await initializeHusky(destinationPath);
    console.info(chalk2.green(`Setup complete at ${process.cwd()}.`));
  } catch (error) {
    console.error(chalk2.red(`Setup failed: ${error.message}`));
  }
};

// helpers/index.ts
async function readPackageJson(filePath) {
  const data = await readFile(filePath, "utf-8");
  return JSON.parse(data);
}

// helpers/showConsoleInfo.ts
import chalk3 from "chalk";
var showConsoleInfo = async (packageManager, projectName, nestProject = false) => {
  console.log();
  console.info(chalk3.yellow("Dont forget to copy the .env.example file to .env and fill in the necessary environment variables."));
  console.info(chalk3.red("IMPORTANT: Dont delete the .env.example file, it is used as a reference for the environment variables."));
  console.log();
  console.info("Inside that directory, you can run several commands:");
  console.log();
  console.info(
    chalk3.cyan(
      `  ${packageManager}${packageManager !== "npm" ? "" : "run"} ${nestProject ? "start:dev" : "dev"}`
    )
  );
  console.info("    Starts the development server.");
  console.log();
  console.info(
    chalk3.cyan(
      `  ${packageManager}${packageManager !== "npm" ? "" : "run"} ${nestProject ? "start:build" : "build"}`
    )
  );
  console.info("    Builds the app for production.");
  console.log();
  console.info(chalk3.cyan(`  ${packageManager} start`));
  console.info("    Runs the built app in production mode.");
  console.log();
  console.info("We suggest that you begin by typing:");
  console.log();
  console.info(chalk3.cyan("  cd"), projectName);
  console.info(
    `  ${chalk3.cyan(
      `${packageManager}${packageManager !== "npm" ? "" : "run"} ${nestProject ? "start:dev" : "dev"}`
    )}`
  );
};

// helpers/isNestProject.ts
var isNestProject = async (project) => {
  const regex = /^nestjs/i;
  return regex.test(project);
};

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
    console.error(chalk4.red(MESSAGES.DIRECTORY_ALREADY_EXISTS(projectDirectory)));
    process.exit(1);
  });
  if (initialOptions.database !== "mongodb") {
    await fs.cp(path2.join(template, `${initialOptions.database}/${useDatabase.connector}`), destination, { recursive: true });
  } else {
    await fs.cp(path2.join(template, "mongoose"), destination, { recursive: true });
  }
  await installAndConfigDependencies(destination, configProyect.packageManager).then(async () => {
    showConsoleInfo(configProyect.packageManager, configProyect.name, await isNestProject(project.value));
  });
};

// actions/config.ts
import inquirer2 from "inquirer";
import path4 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// helpers/copy.ts
import chalk5 from "chalk";
import ncp from "ncp";
import path3 from "path";
var copyFiles = (projectConfigPath, destinationPath, projectName) => {
  ncp(projectConfigPath, destinationPath, {
    filter: (source) => {
      const nombreArchivo = path3.basename(source);
      return nombreArchivo !== "package.json";
    }
  }, function(error) {
    if (error) {
      console.error(chalk5.red(MESSAGES.CONFIG_INIT_FAILED));
    } else {
      console.log(chalk5.green(MESSAGES.CONFIG_INIT_SUCCEED(projectName)));
    }
  });
};

// helpers/searchLockFile.ts
import { readdir } from "fs/promises";
var packageManagers = {
  "package-lock.json": "npm",
  "yarn.lock": "yarn",
  "pnpm-lock.yaml": "pnpm"
};
async function searchLockFile(destinationPath) {
  const files = await readdir(destinationPath);
  const regex = /^(yarn\.lock|package-lock\.json|pnpm-lock\.yaml)$/;
  const matchedFiles = files.find((file) => regex.test(file));
  return packageManagers[matchedFiles ?? "npm"];
}

// actions/config.ts
import { writeFile } from "fs/promises";
import os from "os";
var config = async () => {
  const projectConfig = await inquirer2.prompt([
    {
      type: "list",
      name: "selectedProject",
      message: "Select your project:",
      choices: Object.keys(configChoices)
    }
  ]);
  let typeProject;
  if (projectConfig.selectedProject === "nestjs") {
    typeProject = await inquirer2.prompt([
      {
        type: "list",
        name: "type",
        message: "Select your project:",
        choices: ["monolith"]
      }
    ]);
  }
  const project = configChoices[projectConfig.selectedProject];
  const destination = process.cwd();
  const projectDir = path4.join(
    path4.dirname(fileURLToPath2(import.meta.url)),
    "configs",
    project.value
  );
  const source = path4.join(projectDir, "package.json");
  copyFiles(projectDir, destination, project);
  const packageJSONOrigin = await readPackageJson(source);
  const packageJSONDestination = await readPackageJson(
    path4.join(destination, "package.json")
  );
  delete packageJSONDestination.jest;
  delete packageJSONDestination.scripts["start:debug"];
  delete packageJSONDestination.scripts["start:prod"];
  const packageManager = await searchLockFile(destination);
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
    path4.join(destination, "package.json"),
    JSON.stringify(mergedPackageJSON, null, 2) + os.EOL
  );
  await installAndConfigDependencies(destination, packageManager);
};

// package.json
var package_default = {
  name: "create-appyc",
  version: "1.2.1",
  description: "Create a new projects from a template",
  main: "index.mjs",
  preferGlobal: true,
  bin: {
    "create-appyc": "dist/index.mjs"
  },
  files: [
    "dist/**/*"
  ],
  author: "Ulises Vargas",
  license: "MIT",
  dependencies: {
    chalk: "5.3.0",
    commander: "12.0.0",
    glob: "^10.3.10",
    inquirer: "8.2.6",
    ncp: "2.0.0",
    "node-emoji": "2.1.3",
    "ts-node": "10.9.2",
    "update-notifier": "^7.0.0"
  },
  scripts: {
    build: "tsup",
    start: "node dist/index.mjs",
    dev: "tsup --watch"
  },
  devDependencies: {
    "@types/inquirer": "9.0.7",
    "@types/ncp": "2.0.8",
    "@types/node": "^20.11.20",
    "@types/update-notifier": "^6.0.8",
    tsup: "^8.0.2",
    typescript: "^5.3.3"
  }
};

// index.ts
program.name("create-appyc").version(package_default.version, "-v, --version", "Output the current version").description("Create a new project with Appyc");
program.command("create").description("Create a new project").action(create);
program.command("config").description("Initialize the configuration").action(config);
if (process.argv.length <= 2)
  console.log(program.help());
else
  program.parse();
//# sourceMappingURL=index.mjs.map
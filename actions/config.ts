import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import { configChoices } from "../utils/template-choices";
import { installAndConfigDependencies, readPackageJson } from "../helpers";
import { copyFiles } from "../helpers/copy";
import { searchLockFile } from "../helpers/searchLockFile";
import { writeFile } from "fs/promises";
import os from "os";

export const config = async () => {
  const projectConfig = await inquirer
    .prompt([
      {
        type: "list",
        name: "selectedProject",
        message: "Select your project:",
        choices: Object.keys(configChoices),
      }
    ])

  let typeProject;

  if (projectConfig.selectedProject === "nestjs") {
    typeProject = await inquirer
      .prompt([
        {
          type: "list",
          name: "type",
          message: "Select your project:",
          choices: ['monolithic'],
        },
      ])
  }

  // Get the selected project
  const project = configChoices[projectConfig.selectedProject];

  // Get the selected type

  // root directory
  const destination = process.cwd();

  // Get the template folder
  const projectDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "configs",
    project.value
  );

  // Get the source package.json
  let source

  if (typeProject.type === "monolithic") {
    source = path.join(projectDir, "monolithic", "package.json");
  } else {
    source = path.join(projectDir, "package.json");
  }


  // Copy files
  if (typeProject === "monolithic") {
    copyFiles(path.join(projectDir, "monolithic"), destination, project);
  } else {
    copyFiles(projectDir, destination, project);
  }

  // Read package.json
  const packageJSONOrigin = await readPackageJson(source);
  const packageJSONDestination = await readPackageJson(
    path.join(destination, "package.json")
  );

  // Remove jest from package.json
  delete packageJSONDestination.jest;
  delete packageJSONDestination.scripts["start:debug"]
  delete packageJSONDestination.scripts["start:prod"]

  // Get the package manager
  const packageManager = await searchLockFile(destination);

  // Merge package.json
  const mergedPackageJSON = {
    ...packageJSONDestination,
    scripts: {
      ...packageJSONDestination.scripts,
      ...packageJSONOrigin.scripts,
    },
    dependencies: {
      ...packageJSONDestination.dependencies,
      ...packageJSONOrigin.dependencies,
    },
    devDependencies: {
      ...packageJSONDestination.devDependencies,
      ...packageJSONOrigin.devDependencies,
    },
    config: {
      ...packageJSONDestination.config,
      ...packageJSONOrigin.config,
    },
  };

  // Write package.json
  await writeFile(
    path.join(destination, "package.json"),
    JSON.stringify(mergedPackageJSON, null, 2) + os.EOL
  );

  // Install and configure dependencies
  await installAndConfigDependencies(destination, packageManager);
};

import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import { configChoices } from "../utils/template-choices";
import { installAndConfigDependencies, readPackageJson } from "../helpers";
import { copyFiles } from "../helpers/copy";
import { searchLockFile } from "../helpers/searchLockFile";
import { writeFile } from "fs/promises";
import os from "os";

export const config = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "projectConfig",
        message: "Select your project:",
        choices: Object.keys(configChoices),
      },
      {
        type: "list",
        name: "type",
        message: "Select your project:",
        choices: ["monolithic"],
      },
    ])
    .then(async (answers) => {
      // Get the selected project
      const project = answers.projectConfig;

      // Get the selected type
      const typeProject = answers.type;

      // root directory
      const destination = process.cwd();

      // Get the template folder
      const projectConfig = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "configs",
        `${project}/${typeProject}`
      );

      // Get Source package.json
      const source = path.join(projectConfig, "package.json");

      copyFiles(projectConfig, destination, project);

      const packageJSONOrigin = await readPackageJson(source);
      const packageJSONDestination = await readPackageJson(
        path.join(destination, "package.json")
      );

      delete packageJSONDestination.jest;
      delete packageJSONDestination.scripts["start:debug"]
      delete packageJSONDestination.scripts["start:prod"]

      const packageManager = await searchLockFile(destination);

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

      await writeFile(
        path.join(destination, "package.json"),
        JSON.stringify(mergedPackageJSON, null, 2) + os.EOL
      );

      await installAndConfigDependencies(destination, packageManager);
    });
};

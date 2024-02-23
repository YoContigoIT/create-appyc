import inquirer from 'inquirer'
import fs, { promises } from 'fs';
import path from 'path'
import { fileURLToPath } from "url";
import { MESSAGES } from '../utils/messages';
import { templateChoices } from '../utils/template-choices';
import chalk from 'chalk';
import { installDependenciesInNewProject } from '../helpers';

export const create = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select a template:',
      choices: Object.keys(templateChoices)
    },
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: 'my-app',
      validate: (input: string) => {
        if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
        else return 'Project name may only include letters, numbers, underscores and hashes.';
      }
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Select a package manager:',
      choices: ['npm', 'yarn', 'pnpm']
    },
  ])
    .then(async answers => {
      // Get the selected project
      const project = templateChoices[answers.template]
      // Get the project directory
      const projectDirectory = answers.name
      // Get the destination path
      const destination = path.join(process.cwd(), projectDirectory);
      // Get the template folder
      const template = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "templates",
        project.value,
      )
      // Check if the directory already exists
      if (fs.existsSync(destination)) {
        console.error(chalk.red(MESSAGES.DIRECTORY_ALREADY_EXISTS(projectDirectory)));
        process.exit(1);
      }
      // Copy the template to the destination
      await promises.cp(path.join(template, "project"), destination, { recursive: true });
      // List packageManagerOptions
      const packageManagerOptions = {
        npm: 'npm install',
        yarn: 'yarn',
        pnpm: 'pnpm install'
      }
      await installDependenciesInNewProject(destination, answers.packageManager, projectDirectory);
    })
}

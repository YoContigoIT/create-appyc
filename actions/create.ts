import inquirer from 'inquirer'
import fs from 'fs/promises';
import path from 'path'
import { fileURLToPath } from "url";
import { MESSAGES } from '../utils/messages';
import { connectorsDatabaseChoices, databaseChoises, templateChoices } from '../utils/template-choices';
import chalk from 'chalk';
import { installAndConfigDependencies } from '../helpers';
import { showConsoleInfo } from '../helpers/showConsoleInfo';
import { isNestProject } from '../helpers/isNestProject';

export const create = async () => {
  const initialOptions = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select a template:',
      choices: Object.keys(templateChoices)
    },
    {
      type: 'list',
      name: 'database',
      message: 'Select the database to use:',
      choices: Object.keys(databaseChoises)
    }
  ])

  let useDatabase = { connector: '' }

  if (initialOptions.database !== 'mongodb') {
    useDatabase = await inquirer.prompt([
      {
        type: 'list',
        name: 'connector',
        message: 'Select the connector to use:',
        choices: Object.keys(connectorsDatabaseChoices)
      }
    ])
  }

  const configProyect = await inquirer.prompt([
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
    }
  ])

  // Get the selected project
  const project = templateChoices[initialOptions.template]
  // Get the project directory
  const projectDirectory = configProyect.name
  // Get the destination path
  const destination = path.join(process.cwd(), projectDirectory);
  // Get the template folder
  const template = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "templates",
    project.value,
  )

  // Check if the directory already exists
  fs.mkdir(destination).catch((err) => {  
    console.error(chalk.red(MESSAGES.DIRECTORY_ALREADY_EXISTS(projectDirectory)));
    process.exit(1);
  })

  // Copy the template to the destination
  if (initialOptions.database !== 'mongodb') {
    await fs.cp(path.join(template, `${initialOptions.database}/${useDatabase.connector}`), destination, { recursive: true });
  } else {
    await fs.cp(path.join(template, 'mongoose'), destination, { recursive: true });
  }

  await installAndConfigDependencies(destination, configProyect.packageManager).then(async () => {
    showConsoleInfo(configProyect.packageManager, configProyect.name, await isNestProject(project.value))
  })
}

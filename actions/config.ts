import inquirer from 'inquirer'
import path from 'path'
import { fileURLToPath } from "url";
import { configChoices } from '../utils/template-choices'
import { installConfigDependencies } from '../helpers';
import { copyFiles } from '../helpers/copy';

export const config = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'projectConfig',
      message: 'Select your project:',
      choices: Object.keys(configChoices)
    },
    {
      type: 'list',
      name: 'type',
      message: 'Select your project:',
      choices: ['monolithic']
    },
  ])
    .then(async answers => {
      // Get the selected project
      const project = answers.projectConfig
      const typeProject = answers.type
      // Get the project directory

      // root directory
      const destination = process.cwd()

      // Get the template folder
      const projectConfig = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "configs",
        `${project}/${typeProject}`
      )
      
      copyFiles(projectConfig, destination, project)

      await installConfigDependencies(path.join(projectConfig, "package.json"), destination)
    })
}

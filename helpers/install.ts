import chalk from 'chalk';
import { glob } from 'glob';
import { spawn } from 'child_process';
import os from "os";
import path from 'path'
import { extractPackageManager, readPackageJson } from '.';
import { MESSAGES } from '../utils/messages';
import { writeFile } from 'fs/promises';

export const installDependenciesInNewProject = async (destinationPath: string, packageManager: string, projectName: string) => {
  const installProcess = spawn(packageManager, ['install'], {
    stdio: 'inherit',
    cwd: destinationPath
  });

  installProcess.on('exit', (code) => {
    if (code === 0) {
      console.info(chalk.green(MESSAGES.PACKAGE_MANAGER_INSTALLATION_SUCCEED(packageManager)));
      console.log('Inside that directory, you can run several commands:')
      console.log()
      console.log(chalk.cyan(`  ${packageManager} ${packageManager !== 'npm' ? '' : 'run '}dev`))
      console.log('    Starts the development server.')
      console.log()
      console.log(chalk.cyan(`  ${packageManager} ${packageManager !== 'npm' ? '' : 'run '}build`))
      console.log('    Builds the app for production.')
      console.log()
      console.log(chalk.cyan(`  ${packageManager} start`))
      console.log('    Runs the built app in production mode.')
      console.log()
      console.log('We suggest that you begin by typing:')
      console.log()
      console.log(chalk.cyan('  cd'), projectName)
      console.log(`  ${chalk.cyan(`${packageManager} ${packageManager !== 'npm' ? '' : 'run '}dev`)}`)
    } else {
      chalk.red(
        MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
          chalk.bold(packageManager),
        ),
      )
    }
  });

  // Handle errors during the installation process
  installProcess.on('error', (error) => {
    chalk.red(
      MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
        chalk.bold(packageManager),
      ),
    )
  })
}

export const installConfigDependencies = async (sourcePath: string, destinationPath: string) => {
  const packageJSONOrigin = await readPackageJson(sourcePath);
  const packageJSONDestination = await readPackageJson(path.join(destinationPath, "package.json"));

  const [packageLock] = await glob(path.join(destinationPath, '{yarn.lock,package-lock.json,pnpm-lock.yaml}'))

  const mergedPackageJSON = {
    ...packageJSONDestination,
    // Merge scripts
    scripts: {
      ...packageJSONDestination.scripts,
      ...packageJSONOrigin.scripts,
    },
    // Merge dependencies
    dependencies: {
      ...packageJSONDestination.dependencies,
      ...packageJSONOrigin.dependencies
    },
    // Merge devDependencies
    devDependencies: {
      ...packageJSONDestination.devDependencies,
      ...packageJSONOrigin.devDependencies
    },
    jest: {
      ...packageJSONDestination.jest,
      ...packageJSONOrigin.jest
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

  const packageManager = extractPackageManager(packageLock) ?? 'npm'
  const args = ['install'];


  const installProcess = spawn(packageManager, args, {
    stdio: 'inherit',
    cwd: destinationPath
  });

  installProcess.on('exit', async (code) => {
    if (code === 0) {
      console.info(chalk.green(MESSAGES.DEPENDENCIES_INSTALLATION_SUCCEED(packageManager)));
      await configHusky(packageManager);
    } else {
      chalk.red(
        MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
          chalk.bold(packageManager),
        ),
      )
    }
  });

  // Handle errors during the installation process
  installProcess.on('error', (error) => {
    chalk.red(
      MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(
        chalk.bold(packageManager),
      ),
    )
  })
}


const configHusky = async (packageManager: string) => {
  // Array of arguments to install multiple packages
  const args = [
    packageManager !== 'yarn' ? 'install' : '',
    'husky',
    'conventional-changelog',
    'cz-conventional-changelog',
    '@commitlint/cli',
    '@commitlint/config-conventional',
    '@commitlint/prompt-cli'
  ];

  // Create the process to install the packages
  const installPackagesProcess = spawn(packageManager, args);

  // Manage the output of the process
  installPackagesProcess.stdout.on('data', (data) => {
    console.log(`Instalando paquetes - stdout: ${data}`);
  });

  installPackagesProcess.stderr.on('data', (data) => {
    console.error(`Instalando paquetes - stderr: ${data}`);
  });

  installPackagesProcess.on('close', (code) => {
    console.log(`Code-closed package installation process ${code}`);

    // Create the Husky script
    const createComandoScript = 'echo';
    const createArgsScript = [
      'npx --no -- commitlint --edit $1',
      '>',
      '.husky/commit-msg'
    ];

    const createScriptProcess = spawn(createComandoScript, createArgsScript, { shell: true });

    createScriptProcess.stdout.on('data', (data) => {
      console.log(`Create script of Husky: ${data}`);
    });

    createScriptProcess.stderr.on('data', (data) => {
      console.error(`Create script of Husky: ${data}`);
    });

    createScriptProcess.on('close', (scriptCode) => {
      console.log(`Husky script creation process closed with code ${scriptCode}`);
    });

    createScriptProcess.on('error', (err) => {
      console.error(`Error running Husky script creation process: ${err}`);
    });
  });

  installPackagesProcess.on('error', (err) => {
    console.error(`Error running the package installation process: ${err}`);
  });
}
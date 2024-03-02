#!/usr/bin/env node

import { program } from 'commander'
import updateNotifier from 'update-notifier'
import { config, create } from './actions'
import pkg from './package.json'

const notifier = updateNotifier({pkg});
notifier.notify();

program
  .name("create-appyc")
  .version(pkg.version, '-v, --version', 'Output the current version')
  .description('Create a new project with Appyc')

program
  .command('create')
  .description('Create a new project')
  .action(create)

program
  .command('config')
  .description('Initialize the configuration')
  .action(config)

if (process.argv.length <= 2)
  console.log(program.help());
else
  program.parse();
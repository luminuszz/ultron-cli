const commander = require("commander");
const shelljs = require("shelljs");
const inquirer = require("inquirer");

const execute = () => {
  const UltronTerminalExecutor = require("../src/cli");

  const commanderInstance = new commander.Command();

  UltronTerminalExecutor.getInstance(commanderInstance, shelljs, inquirer);
};

execute();

const commander = require("commander");
const shelljs = require("shelljs");
const inquirer = require("inquirer");

const UltronTerminalExecutor = require("./cli");

(() => {
  const commanderInstance = new commander.Command();

  return UltronTerminalExecutor.getInstance(
    commanderInstance,
    shelljs,
    inquirer
  );
})();

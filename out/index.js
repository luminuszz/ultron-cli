"use strict";
exports.__esModule = true;
var commander = require("commander");
var shelljs = require("shelljs");
var inquirer = require("inquirer");
var cli_1 = require("./cli");
(function () {
    var commanderInstance = new commander.Command();
    return cli_1.UltronTerminalExecutor.getInstance(commanderInstance, shelljs, inquirer);
})();

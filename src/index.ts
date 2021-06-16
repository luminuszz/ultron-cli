#!/usr/bin/env node

import "reflect-metadata";

import { container } from "tsyringe";

import "./container/index";

import { UltronTerminalExecutor } from "./cli";

(() => {
  const ultronCLIInstance = container.resolve(UltronTerminalExecutor);

  ultronCLIInstance.initCli();
})();

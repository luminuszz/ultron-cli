#!/usr/bin/env node

import "reflect-metadata";

import "./container/index";

import { container } from "tsyringe";

import { UltronTerminalExecutor } from "./cli";

async function execute() {
  const ultronCLIInstance = container.resolve(UltronTerminalExecutor);

  await ultronCLIInstance.initCli();
}

execute();

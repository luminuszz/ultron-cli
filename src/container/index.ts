import { container } from "tsyringe";
import { ShellManager, ShellManagerToken } from "../libs/shellManager.lib";
import {
  ShellCommander,
  ShellCommanderToken,
} from "../libs/shellCommander.lib";
import {
  ShellInterface,
  ShellInterfaceToken,
} from "../libs/shellInterface.lib";

container.registerSingleton<ShellManager>(ShellManagerToken, ShellManager);

container.registerSingleton<ShellCommander>(
  ShellCommanderToken,
  ShellCommander
);

container.registerSingleton<ShellInterface>(
  ShellInterfaceToken,
  ShellInterface
);

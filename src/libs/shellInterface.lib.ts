import * as inquirer from "inquirer";

export class ShellInterface {
  public interface: typeof inquirer;

  constructor() {
    this.interface = inquirer;
  }
}

export const ShellInterfaceToken = "ShellInterfaceToken";

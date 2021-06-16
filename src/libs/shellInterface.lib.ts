import * as inquirerFactory from "inquirer";

export class ShellInterface {
  public interface: inquirerFactory.Inquirer;

  constructor() {
    this.interface = inquirerFactory;
  }
}

export const ShellInterfaceToken = "ShellInterfaceToken";

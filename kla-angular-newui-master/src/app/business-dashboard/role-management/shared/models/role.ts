import { Policies } from "./policies";

export class Role {
  constructor(
    public roleName: string = "",
    public description: string = "",
    public policies: Policies[] = [],
    public id: string = ""
  ) {}
}

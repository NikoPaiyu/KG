import { Privilages } from "./privilages";

export class Policies {
  constructor(
    public policyName: string = "",
    public privilages: string[] = [],
    public id: string = ""
  ) {}
}

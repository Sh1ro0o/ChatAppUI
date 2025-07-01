export class SystemMessageRequest {
  constructor(
    public groupName: string,
    public username?: string,
  ) {}
}
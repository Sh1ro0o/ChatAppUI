export class MessageRequest {
  constructor(
    public groupName: string,
    public username?: string,
    public message?: string
  ) {}
}
export class SystemMessages {
  static joined(username: string) {
    return `${username} has joined!`;
  }

  static left(username: string) {
    return `${username} has left`;
  }
}
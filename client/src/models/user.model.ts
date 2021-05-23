export class User {
  constructor(
    public uid: string,
    public firstName: string,
    public lastName: string,
    public biography: string,
    public imageUrl: string,
    public emailAddress: string
  ) {}
}

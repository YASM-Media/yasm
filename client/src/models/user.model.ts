export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public biography: string,
    public imageUrl: string,
    public emailAddress: string,
    public followers: User[],
    public following: User[]
  ) {}
}

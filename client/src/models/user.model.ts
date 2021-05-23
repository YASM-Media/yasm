export class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public biography: string,
    public imageUrl: string,
    public emailAddress: string,
    public password: string
  ) {}

  fromJson(json: any) {
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.emailAddress = json.emailAddress;
    this.password = json.password;
    this.imageUrl = json.imageUrl;
    this.biography = json.biography;
  }
}

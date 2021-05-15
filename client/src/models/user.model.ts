export class User {
  constructor(
    private firstName: string,
    private lastName: string,
    private emailAddress: string,
    private password: string
  ) {}

  fromJson(json: any) {
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.emailAddress = json.emailAddress;
    this.password = json.password;
  }
}

export class User {
  public id: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public biography: string = '';
  public imageUrl: string = '';
  public followers: User[] = [];
  public following: User[] = [];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    biography: string,
    imageUrl: string,
    followers: User[],
    following: User[]
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.biography = biography;
    this.imageUrl = imageUrl;
    this.followers = followers;
    this.following = following;
  }

  static newEmptyUser(): User {
    const user = new User('', '', '', '', '', [], []);

    return user;
  }

  static fromJson(json: any): User {
    const user = User.newEmptyUser();

    user.id = json.id ?? '';
    user.firstName = json.firstName ?? '';
    user.lastName = json.lastName ?? '';
    user.biography = json.biography ?? '';
    user.imageUrl = json.imageUrl ?? '';
    user.followers = json.followers
      ? json.followers.map((jsonUser: any) => User.fromJson(jsonUser))
      : [];
    user.following = json.following
      ? json.following.map((jsonUser: any) => User.fromJson(jsonUser))
      : [];

    return user;
  }

  toJson(): {
    id: string;
    firstName: string;
    lastName: string;
    biography: string;
    imageUrl: string;
    followers: any[];
    following: any[];
  } {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.firstName,
      biography: this.biography,
      imageUrl: this.imageUrl,
      followers: this.followers.map((user) => user.toJson()),
      following: this.following.map((user) => user.toJson()),
    };
  }
}

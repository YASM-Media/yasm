import { User } from './user.model';

export class Like {
  public id: string = '';
  public user: User = User.newEmptyUser();
  constructor(id: string, user: User) {
    this.id = id;
    this.user = user;
  }

  static newEmptyLike(): Like {
    const like = new Like('', User.newEmptyUser());

    return like;
  }

  static fromJson(json: any): Like {
    const like = Like.newEmptyLike();

    like.id = json.id ?? '';
    like.user = json.user ? User.fromJson(json.user) : User.newEmptyUser();

    return like;
  }

  toJson(): {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      biography: string;
      imageUrl: string;
      followers: any[];
      following: any[];
    };
  } {
    return {
      id: this.id,
      user: this.user.toJson(),
    };
  }
}

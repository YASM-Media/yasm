import { Image } from './image.model';
import { Like } from './like.model';
import { User } from './user.model';

export class Post {
  public id: string = '';
  public text: string = '';
  public createdAt: Date = new Date(Date.now());
  public user: User = User.newEmptyUser();
  public images: Image[] = [];
  public likes: Like[] = [];
  public comments: Post[] = [];

  static newPost(): Post {
    const post = new Post(
      '',
      '',
      new Date(Date.now()),
      User.newEmptyUser(),
      [],
      [],
      []
    );

    return post;
  }

  constructor(
    id: string,
    text: string,
    createdAt: Date,
    user: User,
    images: Image[],
    likes: Like[],
    comments: Post[]
  ) {
    this.id = id;
    this.text = text;
    this.createdAt = createdAt;
    this.user = user;
    this.images = images;
    this.likes = likes;
    this.comments = comments;
  }

  static fromJson(json: any): Post {
    const post = Post.newPost();

    return post;
  }

  toJson(): {
    id: string;
    text: string;
    createdAt: Date;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      biography: string;
      imageUrl: string;
      emailAddress: string;
      followers: any[];
      following: any[];
    };
    images: { id: string; imageUrl: string }[];
    likes: {
      id: string;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        biography: string;
        imageUrl: string;
        emailAddress: string;
        followers: any[];
        following: any[];
      };
    }[];
    comments: any[];
  } {
    return {
      id: this.id,
      text: this.text,
      createdAt: this.createdAt,
      user: this.user.toJson(),
      images: this.images.map((image) => image.toJson()),
      likes: this.likes.map((like) => like.toJson()),
      comments: this.comments.map((comment) => comment.toJson()),
    };
  }
}

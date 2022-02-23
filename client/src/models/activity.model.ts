import { Post } from './post.model';
import { User } from './user.model';

export class Activity {
  public id: string = '';
  public mainUser: User = User.newEmptyUser();
  public triggeredByUser: User = User.newEmptyUser();
  public activityType: string = '';
  public post?: Post = Post.newPost();
  public createdAt: Date = new Date(Date.now());
  public updatedAt: Date = new Date(Date.now());

  constructor(
    id: string,
    mainUser: User,
    triggeredByUser: User,
    activityType: string,
    createdAt: Date,
    updatedAt: Date,
    post: Post = Post.newPost()
  ) {
    this.id = id;
    this.mainUser = mainUser;
    this.triggeredByUser = triggeredByUser;
    this.activityType = activityType;
    this.post = post;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static newActivity() {
    const activity = new Activity(
      '',
      User.newEmptyUser(),
      User.newEmptyUser(),
      '',
      new Date(Date.now()),
      new Date(Date.now())
    );

    return activity;
  }

  static fromJson(json: any): Activity {
    const activity = Activity.newActivity();

    activity.id = json.id ?? '';
    activity.mainUser = json.mainUser
      ? User.fromJson(json.mainUser)
      : User.newEmptyUser();
    activity.triggeredByUser = json.triggeredByUser
      ? User.fromJson(json.triggeredByUser)
      : User.newEmptyUser();
    activity.activityType = json.activityType ?? '';
    activity.post = json.post ? Post.fromJson(json.post) : Post.newPost();
    activity.createdAt = json.createdAt
      ? new Date(json.createdAt)
      : new Date(Date.now());
    activity.updatedAt = json.updatedAt
      ? new Date(json.updatedAt)
      : new Date(Date.now());

    return activity;
  }

  toJson(): {
    id: string;
    mainUser: {
      id: string;
      firstName: string;
      lastName: string;
      biography: string;
      imageUrl: string;
      emailAddress: string;
      followers: any[];
      following: any[];
    };
    triggeredByUser: {
      id: string;
      firstName: string;
      lastName: string;
      biography: string;
      imageUrl: string;
      emailAddress: string;
      followers: any[];
      following: any[];
    };
    activityType: string;
    createdAt: Date;
    updatedAt: Date;
    post: {
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
    };
  } {
    return {
      id: this.id,
      mainUser: this.mainUser.toJson(),
      triggeredByUser: this.triggeredByUser.toJson(),
      activityType: this.activityType,
      post: this.post ? this.post.toJson() : Post.newPost().toJson(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

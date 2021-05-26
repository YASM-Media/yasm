import { CreatePostDto } from './../../DTOs/posts/createPost.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/models/post.model';
import { Repository } from 'typeorm';
import { Image } from 'src/models/image.model';
import { User } from 'src/models/user.model';

/**
 * Service Implementation for Posts.
 */
@Injectable()
export class PostsService {
  // Injecting Post and Image Repositories from Nest Context.
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  /**
   * Save a new post to the database.
   * @param createPostDto DTO For Post Creation
   */
  public async createPost(
    createPostDto: CreatePostDto,
    user: User,
  ): Promise<Post> {
    // Create Image model and save it to the database out of the URLs.
    const modelImages: Image[] = await Promise.all(
      createPostDto.images.map(async (imageLink) => {
        const imageModel = new Image();
        imageModel.imageUrl = imageLink;

        return await this.imageRepository.save(imageModel);
      }),
    );

    // Create and assign values to post model.
    const postModel = new Post();
    postModel.text = createPostDto.text;
    postModel.images = modelImages;
    postModel.user = user;

    // Save the post to the database and return to the User.
    return await this.postRepository.save(postModel);
  }
}

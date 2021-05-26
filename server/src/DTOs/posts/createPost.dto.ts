import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(1, { each: true })
  images: string[];

  @IsNotEmpty()
  text: string;
}

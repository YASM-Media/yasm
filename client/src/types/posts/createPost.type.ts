import { Image } from '../../models/image.model';

export type CreatePostType = {
  images: Image[];
  text: string;
};

import { Image } from '../../models/image.model';

export type UpdatePostType = {
  id: string;
  images: Image[];
  text: string;
};

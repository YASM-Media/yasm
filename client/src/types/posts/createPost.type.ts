export type CreatePostType = {
  images: File[] | Blob[] | ArrayBuffer[] | Uint8Array[] | undefined[];
  text: string;
};

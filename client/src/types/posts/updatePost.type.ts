export type UpdatePostType = {
  id: string;
  images: File[] | Blob[] | ArrayBuffer[] | Uint8Array[] | undefined[];
  text: string;
};

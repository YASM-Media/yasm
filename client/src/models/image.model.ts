export class Image {
  public id: string = '';
  public imageUrl: string = '';

  constructor(id: string, imageUrl: string) {
    this.id = id;
    this.imageUrl = imageUrl;
  }

  static newEmptyImage(): Image {
    const image = new Image('', '');

    return image;
  }

  static fromJson(json: any): Image {
    const image = new Image('', '');

    image.id = json.id ?? '';
    image.imageUrl = json.imageUrl ?? '';

    return image;
  }

  toJson(): { id: string; imageUrl: string } {
    return {
      id: this.id,
      imageUrl: this.imageUrl,
    };
  }
}

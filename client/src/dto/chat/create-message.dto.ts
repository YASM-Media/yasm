export class CreateMessageDto {
  public message: string = '';
  public threadId: string = '';
  public createdAt: Date = new Date(Date.now());

  static newCreateMessageDto(
    message: string,
    threadId: string
  ): CreateMessageDto {
    const createMessageDto = new CreateMessageDto();
    createMessageDto.message = message;
    createMessageDto.threadId = threadId;

    return createMessageDto;
  }

  static fromJson(json: any): CreateMessageDto {
    const createMessageDto = new CreateMessageDto();

    createMessageDto.message = json.message ?? '';
    createMessageDto.threadId = json.threadId ?? '';
    createMessageDto.createdAt = json.createdAt ?? new Date(Date.now());

    return createMessageDto;
  }

  toJson(): { message: string; threadId: string; createdAt: Date } {
    return {
      message: this.message,
      threadId: this.threadId,
      createdAt: this.createdAt,
    };
  }
}

export class DeleteMessageDto {
  public threadId: string = '';
  public messageId: string = '';

  static newDeleteMessageDto(
    threadId: string,
    messageId: string
  ): DeleteMessageDto {
    const deleteMessageDto = new DeleteMessageDto();

    deleteMessageDto.threadId = threadId;
    deleteMessageDto.messageId = messageId;

    return deleteMessageDto;
  }

  static fromJson(json: any): DeleteMessageDto {
    const deleteMessageDto = new DeleteMessageDto();

    deleteMessageDto.threadId = json.threadId ?? '';
    deleteMessageDto.messageId = json.messageId ?? '';

    return deleteMessageDto;
  }

  toJson(): { threadId: string; messageId: string } {
    return {
      threadId: this.threadId,
      messageId: this.messageId,
    };
  }
}

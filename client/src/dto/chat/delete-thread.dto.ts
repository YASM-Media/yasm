export class DeleteThreadDto {
  public threadId: string = '';

  static newDeleteThreadDto(threadId: string): DeleteThreadDto {
    const deleteThreadDto = new DeleteThreadDto();

    deleteThreadDto.threadId = threadId;

    return deleteThreadDto;
  }

  static fromJson(json: any): DeleteThreadDto {
    const deleteThreadDto = new DeleteThreadDto();

    deleteThreadDto.threadId = json.threadId ?? '';

    return deleteThreadDto;
  }

  toJson(): { threadId: string } {
    return {
      threadId: this.threadId,
    };
  }
}

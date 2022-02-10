export class CreateThreadDto {
  public participants: string[] = [];

  static newCreateThreadDto(participants: string[]): CreateThreadDto {
    const createThreadDto = new CreateThreadDto();

    createThreadDto.participants = participants;

    return createThreadDto;
  }

  static fromJson(json: any): CreateThreadDto {
    const createThreadDto = new CreateThreadDto();

    createThreadDto.participants = json.participants ?? [];

    return createThreadDto;
  }

  toJson(): { participants: string[] } {
    return {
      participants: this.participants,
    };
  }
}

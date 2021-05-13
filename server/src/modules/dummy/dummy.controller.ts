import { DummyService } from './dummy.service';
import { Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/dummy')
export class DummyController {
  constructor(private readonly dummyService: DummyService) {}

  @Get()
  async getDummyData(@Res() response: Response): Promise<any> {
    response.cookie('dummy', 'dummy', { httpOnly: true });
    return response.sendStatus(HttpStatus.OK);
  }

  @Post('/check')
  async checkDummyData(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    return response.json(request.cookies.dummy);
  }
}

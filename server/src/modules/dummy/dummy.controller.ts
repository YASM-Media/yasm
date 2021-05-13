import { JwtAuthGuard } from './../../guards/auth.guard';
import { DummyService } from './dummy.service';
import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('/dummy')
export class DummyController {
  constructor(private readonly dummyService: DummyService) {}

  @UseGuards(JwtAuthGuard)
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

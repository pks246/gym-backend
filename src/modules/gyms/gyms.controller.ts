import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateGymDto } from './dto/create-gym.dto';
import { GymsService } from './gyms.service';

@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Get()
  getGyms() {
    return this.gymsService.findAll();
  }

  @Get(':id')
  getGymById(@Param('id', ParseIntPipe) id: number) {
    return this.gymsService.findOne(id);
  }

  @Post()
  createGym(@Body() createGymDto: CreateGymDto) {
    return this.gymsService.create(createGymDto);
  }
}

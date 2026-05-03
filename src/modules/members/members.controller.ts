import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  getMembers() {
    return this.membersService.findAll();
  }

  @Get(':id')
  getMemberById(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findOne(id);
  }

  @Post()
  createMember(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }
}

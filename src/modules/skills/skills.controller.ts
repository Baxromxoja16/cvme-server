import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SkillsService } from './skills.service';

@Controller('skills')
@UseGuards(AuthGuard('jwt'))
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll(@Req() req) {
    return this.skillsService.findAll(req.user._id);
  }

  @Post()
  async add(@Req() req, @Body('skill') skill: string) {
    return this.skillsService.add(req.user._id, skill);
  }

  @Patch()
  async update(
    @Req() req,
    @Body('oldSkill') oldSkill: string,
    @Body('newSkill') newSkill: string,
  ) {
    return this.skillsService.update(req.user._id, oldSkill, newSkill);
  }

  @Delete()
  async remove(@Req() req, @Body('skill') skill: string) {
    return this.skillsService.remove(req.user._id, skill);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Experience } from '../users/schemas/user.schema';
import { ExperienceService } from './experience.service';

@Controller('experience')
@UseGuards(AuthGuard('jwt'))
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  async findAll(@Req() req) {
    return this.experienceService.findAll(req.user._id);
  }

  @Post()
  async add(@Req() req, @Body() experience: Experience) {
    return this.experienceService.add(req.user._id, experience);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') experienceId: string,
    @Body() updateData: Partial<Experience>,
  ) {
    return this.experienceService.update(
      req.user._id,
      experienceId,
      updateData,
    );
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') experienceId: string) {
    return this.experienceService.remove(req.user._id, experienceId);
  }
}

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
import { Education } from '../users/schemas/user.schema';
import { EducationService } from './education.service';

@Controller('education')
@UseGuards(AuthGuard('jwt'))
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async findAll(@Req() req) {
    return this.educationService.findAll(req.user._id);
  }

  @Post()
  async add(@Req() req, @Body() education: Education) {
    return this.educationService.add(req.user._id, education);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') educationId: string,
    @Body() updateData: Partial<Education>,
  ) {
    return this.educationService.update(req.user._id, educationId, updateData);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') educationId: string) {
    return this.educationService.remove(req.user._id, educationId);
  }
}

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
import { Project } from '../users/schemas/user.schema';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.projectsService.findAll(req.user._id);
  }

  @Post()
  async add(@Req() req: any, @Body() project: Project) {
    return this.projectsService.add(req.user._id, project);
  }

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') projectId: string,
    @Body() updateData: Partial<Project>,
  ) {
    return this.projectsService.update(req.user._id, projectId, updateData);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') projectId: string) {
    return this.projectsService.remove(req.user._id, projectId);
  }
}

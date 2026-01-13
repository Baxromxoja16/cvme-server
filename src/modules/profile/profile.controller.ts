import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: any) {
    return { url: `/uploads/${file.filename}` };
  }

  @Get()
  async getMe(@Req() req) {
    return this.profileService.getMe(req.user._id);
  }

  @Patch()
  async updateMe(@Req() req, @Body() body: any) {
    return this.profileService.updateMe(req.user._id, body);
  }
}

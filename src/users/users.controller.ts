import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('upload')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: any) {
        // Return the path where the file is served
        // Assuming backend is at localhost:3000
        return { url: `/uploads/${file.filename}` };
    }

    @Get('public')
    async getPublicProfile(@Req() req) {
        // This endpoint relies on SubdomainMiddleware
        const tenant = req['tenant'];
        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }
        // Return only public data
        return {
            slug: tenant.slug,
            profile: tenant.profile,
            experience: tenant.experience,
            skills: tenant.skills,
            education: tenant.education,
            // Do not return email/googleId/dates unless necessary
        };
    }

    // Endpoint to get user by slug directly (fallback)
    @Get('profile/:slug')
    async getProfileBySlug(@Param('slug') slug: string) {
        const user = await this.usersService.findBySlug(slug);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            slug: user.slug,
            profile: user.profile,
            experience: user.experience,
            skills: user.skills,
            education: user.education,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getMe(@Req() req) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async updateMe(@Req() req, @Body() body: any) {
        // Prevent updating critical fields like googleId/email directly here if unsafe
        // Body validation should be done via DTOs
        const userId = req.user._id;
        return this.usersService.update(userId, body);
    }
}

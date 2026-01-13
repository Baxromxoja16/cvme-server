import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
      contacts: tenant.contacts,
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
      contacts: user.contacts,
    };
  }

  @Get('check-slug/:slug')
  async checkSlugAvailability(@Param('slug') slug: string) {
    const isAvailable = await this.usersService.isSlugAvailable(slug);
    return { available: isAvailable };
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateGoogleUser(details: any) {
        const user = await this.usersService.findByEmail(details.email);
        if (user) return user;

        // Create new user
        // Generate slug from email or name
        let slug = details.email.split('@')[0];
        // Simple check if slug exists, if so append random number (basic logic)
        const existing = await this.usersService.findBySlug(slug);
        if (existing) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }

        const newUser = await this.usersService.create({
            email: details.email,
            googleId: details.googleId,
            slug: slug,
            profile: {
                header: 'Welcome to my generic profile',
                avatar: details.picture,
                about: 'This is a new profile.',
            },
            skills: [],
            experience: [],
            education: [],
        });
        return newUser;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id, slug: user.slug };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
}

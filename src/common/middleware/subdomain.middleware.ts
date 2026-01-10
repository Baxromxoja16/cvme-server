import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const host = req.headers.host;
        // Assuming host format: slug.domain.com or slug.localhost:3000
        // We need to extract 'slug'.

        // Logic to extract subdomain. 
        // If running on localhost:3000, usually we simulate via /etc/hosts or just test with header.
        // Let's support a custom header 'X-Tenant-Slug' for easy testing, AND the real host parsing.

        let slug = req.headers['x-tenant-slug'] as string;

        if (!slug && host) {
            const parts = host.split('.');
            // Check if we are in a subdomain environment
            // e.g. user.cvme.com -> parts ['user', 'cvme', 'com'] -> length 3
            // e.g. localhost:3000 -> length 1 (no subdomain)
            // e.g. user.localhost:3000 -> parts ['user', 'localhost:3000'] -> length 2

            if (parts.length > 2 || (parts.length === 2 && parts[1].includes('localhost'))) {
                slug = parts[0];
            }
        }

        if (slug && slug !== 'www' && slug !== 'api' && slug !== 'admin') {
            const tenant = await this.usersService.findBySlug(slug);
            if (tenant) {
                req['tenant'] = tenant;
            }
        }

        next();
    }
}

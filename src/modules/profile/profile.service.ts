import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { slugify } from '../../common/utils/slug.util';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly usersService: UsersService,
  ) {}

  async getMe(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  async updateMe(userId: string, body: any): Promise<User> {
    if (body.slug) {
      body.slug = slugify(body.slug);

      // Check uniqueness
      const isAvailable = await this.usersService.isSlugAvailable(
        body.slug,
        userId,
      );
      if (!isAvailable) {
        throw new ConflictException('Username is already taken');
      }
    }
    return this.userModel.findByIdAndUpdate(userId, body, { new: true }).exec();
  }
}

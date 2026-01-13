import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { slugify } from '../../common/utils/slug.util';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getMe(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  async updateMe(userId: string, body: any): Promise<User> {
    if (body.slug) {
      body.slug = slugify(body.slug);
    }
    return this.userModel.findByIdAndUpdate(userId, body, { new: true }).exec();
  }
}

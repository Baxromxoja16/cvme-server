import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { slugify } from '../../common/utils/slug.util';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<User> {
    if (createUserDto.slug) {
      createUserDto.slug = slugify(createUserDto.slug);
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findBySlug(slug: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ slug }).exec();
  }

  async isSlugAvailable(
    slug: string,
    excludeUserId?: string,
  ): Promise<boolean> {
    const query: any = { slug };
    if (excludeUserId) {
      query._id = { $ne: excludeUserId };
    }
    const existing = await this.userModel.findOne(query).exec();
    return !existing;
  }

  async findById(id: string): Promise<UserDocument | undefined> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateData: any): Promise<User> {
    if (updateData.slug) {
      updateData.slug = slugify(updateData.slug);
    }
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
}

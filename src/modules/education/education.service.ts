import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Education, User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class EducationService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user.education || [];
  }

  async add(userId: string, education: Education) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { education: education } },
        { new: true },
      )
      .exec();
    return user.education;
  }

  async update(
    userId: string,
    educationId: string,
    updateData: Partial<Education>,
  ) {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: userId, 'education._id': educationId },
        {
          $set: {
            'education.$.institution': updateData.institution,
            'education.$.degree': updateData.degree,
            'education.$.year': updateData.year,
          },
        },
        { new: true },
      )
      .exec();
    return user.education;
  }

  async remove(userId: string, educationId: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { education: { _id: educationId } } },
        { new: true },
      )
      .exec();
    return user.education;
  }
}

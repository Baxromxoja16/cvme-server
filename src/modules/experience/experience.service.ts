import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experience, User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ExperienceService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user.experience || [];
  }

  async add(userId: string, experience: Experience) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { experience: experience } },
        { new: true },
      )
      .exec();
    return user.experience;
  }

  async update(
    userId: string,
    experienceId: string,
    updateData: Partial<Experience>,
  ) {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: userId, 'experience._id': experienceId },
        {
          $set: {
            'experience.$.company': updateData.company,
            'experience.$.position': updateData.position,
            'experience.$.startDate': updateData.startDate,
            'experience.$.endDate': updateData.endDate,
            'experience.$.description': updateData.description,
          },
        },
        { new: true },
      )
      .exec();
    return user.experience;
  }

  async remove(userId: string, experienceId: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { experience: { _id: experienceId } } },
        { new: true },
      )
      .exec();
    return user.experience;
  }
}

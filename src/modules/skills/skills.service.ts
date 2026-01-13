import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class SkillsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user.skills || [];
  }

  async add(userId: string, skill: string): Promise<string[]> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { skills: skill } },
        { new: true },
      )
      .exec();
    return user.skills;
  }

  async update(
    userId: string,
    oldSkill: string,
    newSkill: string,
  ): Promise<string[]> {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: userId, skills: oldSkill },
        { $set: { 'skills.$': newSkill } },
        { new: true },
      )
      .exec();
    return user.skills;
  }

  async remove(userId: string, skill: string): Promise<string[]> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $pull: { skills: skill } }, { new: true })
      .exec();
    return user.skills;
  }
}

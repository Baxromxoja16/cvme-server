import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user.projects || [];
  }

  async add(userId: string, project: Project) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { projects: project } },
        { new: true },
      )
      .exec();
    return user.projects;
  }

  async update(
    userId: string,
    projectId: string,
    updateData: Partial<Project>,
  ) {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: userId, 'projects._id': projectId },
        {
          $set: {
            'projects.$.title': updateData.title,
            'projects.$.description': updateData.description,
            'projects.$.startDate': updateData.startDate,
            'projects.$.endDate': updateData.endDate,
            'projects.$.link': updateData.link,
          },
        },
        { new: true },
      )
      .exec();
    return user.projects;
  }

  async remove(userId: string, projectId: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { projects: { _id: projectId } } },
        { new: true },
      )
      .exec();
    return user.projects;
  }
}

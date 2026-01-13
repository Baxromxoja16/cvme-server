import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user.contacts || [];
  }

  async add(
    userId: string,
    contact: { type: string; value: string; icon: string },
  ) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { contacts: contact } },
        { new: true },
      )
      .exec();
    return user.contacts;
  }

  async update(
    userId: string,
    contactId: string,
    updateData: Partial<{ type: string; value: string; icon: string }>,
  ) {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: userId, 'contacts._id': contactId },
        {
          $set: {
            'contacts.$.type': updateData.type,
            'contacts.$.value': updateData.value,
            'contacts.$.icon': updateData.icon,
          },
        },
        { new: true },
      )
      .exec();
    return user.contacts;
  }

  async remove(userId: string, contactId: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { contacts: { _id: contactId } } },
        { new: true },
      )
      .exec();
    return user.contacts;
  }
}

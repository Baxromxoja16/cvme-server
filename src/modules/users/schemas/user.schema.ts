import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class Profile {
  @Prop()
  header: string;

  @Prop()
  avatar: string;

  @Prop({ default: true })
  avatarActive: boolean;

  @Prop()
  about: string;

  @Prop()
  cvUrl?: string;
}

@Schema()
export class Experience {
  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  position: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date; // Null means "Present"

  @Prop()
  description: string;
}

@Schema()
export class Education {
  @Prop({ required: true })
  institution: string;

  @Prop({ required: true })
  degree: string;

  @Prop()
  year: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  googleId: string;

  @Prop({ required: true, unique: true })
  slug: string; // The subdomain

  @Prop({ type: Profile, default: {} })
  profile: Profile;

  @Prop([Experience])
  experience: Experience[];

  @Prop([
    {
      type: { type: String },
      value: { type: String },
      icon: { type: String },
    },
  ])
  contacts: { type: string; value: string; icon: string }[];

  @Prop([String])
  skills: string[];

  @Prop({ default: 'minimalist' })
  templateId: string;

  @Prop([Education])
  education: Education[];
}

export const UserSchema = SchemaFactory.createForClass(User);

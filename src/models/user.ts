/**
 * Node Modules
 */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

/**
 * User schema
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      maxlength: [20, 'Username must be less than 20 characters'],
      unique: [true, 'Username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      maxlength: [50, 'Email must be less than 50 characters'],
      unique: [true, 'Email must be unique'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false,
    },
    firstName: {
      type: String,
      maxlength: [20, 'First name must be less than 20 characters'],
    },
    lastName: {
      type: String,
      maxlength: [20, 'Last name must be less than 20 characters'],
    },
    socialLinks: {
      website: {
        type: String,
        maxLength: [100, 'Website address must be less than 100 characters'],
      },
      facebook: {
        type: String,
        maxLength: [100, 'Facebook profile must be less than 100 characters'],
      },
      instagram: {
        type: String,
        maxLength: [100, 'Instagram profile must be less than 100 characters'],
      },
      linkedin: {
        type: String,
        maxLength: [100, 'LinkedIn profile must be less than 100 characters'],
      },
      x: {
        type: String,
        maxLength: [100, 'X profile must be less than 100 characters'],
      },
      youtube: {
        type: String,
        maxLength: [100, 'YouTube profile must be less than 100 characters'],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  //   Hash the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>('User', userSchema);

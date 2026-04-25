import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/models';

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    avatar: { type: String },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add a method to remove password when converting to JSON
UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete (ret as any).password;
    return ret;
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

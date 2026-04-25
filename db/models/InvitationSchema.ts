import mongoose, { Schema } from 'mongoose';
import { IInvitation } from '../interfaces/models';

const InvitationSchema = new Schema<IInvitation>(
  {
    projectId: { type: String, required: true },
    adminId: { type: String, required: true },
    memberId: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);

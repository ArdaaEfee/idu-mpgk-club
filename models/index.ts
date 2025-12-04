import mongoose, { Schema, model, models } from 'mongoose';

// 1. İletişim Formu Şeması
const ContactSchema = new Schema({
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

// 2. Başvuru Şeması
const ApplicationSchema = new Schema({
  firstName: String,
  lastName: String,
  studentNumber: String,
  department: String,
  interests: String,
  status: { type: String, default: 'pending' }, 
  timestamp: { type: Date, default: Date.now }
});

// 3. Üye Şeması
const MemberSchema = new Schema({
  firstName: String,
  lastName: String,
  studentNumber: String,
  department: String,
  role: { type: String, default: 'üye' },
  joinDate: { type: Date, default: Date.now },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' }
});

// HATA ÇÖZÜMÜ BURADA: "as any" ekleyerek TypeScript hatalarını susturuyoruz.
export const Contact = (models.Contact || model('Contact', ContactSchema)) as any;
export const Application = (models.Application || model('Application', ApplicationSchema)) as any;
export const Member = (models.Member || model('Member', MemberSchema)) as any;
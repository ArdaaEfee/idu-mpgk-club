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

// 4. Proje Fikri Şeması (YENİ EKLENEN KISIM)
const IdeaSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  projectTitle: { type: String, required: true },
  description: { type: String, required: true },
  fileLink: { type: String }, // <-- YENİ EKLENDİ (Zorunlu değil)
  status: { type: String, default: 'new' }, 
  timestamp: { type: Date, default: Date.now }
});

// MODELLERİ DIŞARI AKTARMA
export const Contact = (models.Contact || model('Contact', ContactSchema)) as any;
export const Application = (models.Application || model('Application', ApplicationSchema)) as any;
export const Member = (models.Member || model('Member', MemberSchema)) as any;
export const Idea = (models.Idea || model('Idea', IdeaSchema)) as any; // Yeni export
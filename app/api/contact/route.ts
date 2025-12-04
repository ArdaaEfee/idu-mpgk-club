import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// İletişim formu veritabanı dosyasının yolu
const contactsPath = path.join(process.cwd(), 'data', 'contacts.json');

// İletişim formu veritabanı dosyasını oluştur
function ensureContactsDbExists() {
  const dir = path.dirname(contactsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(contactsPath)) {
    fs.writeFileSync(contactsPath, JSON.stringify([], null, 2));
  }
}

// İletişim formu verisini kaydet
function saveContact(data: any) {
  ensureContactsDbExists();
  const existingData = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'));
  const newEntry = {
    id: Date.now(),
    ...data,
    timestamp: new Date().toISOString(),
    read: false // Okunma durumu
  };
  existingData.push(newEntry);
  fs.writeFileSync(contactsPath, JSON.stringify(existingData, null, 2));
  return newEntry;
}

// Email gönderici
async function sendEmail(subject: string, text: string, html?: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"IDU MPGK Website" <${process.env.EMAIL_USER}>`,
    to: 'ardaxzadee@gmail.com',
    subject: subject,
    text: text,
    html: html || text.replace(/\n/g, '<br>'),
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validasyon
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Veriyi kaydet
    const contact = saveContact({ name, email, message });

    // Email gönder
    const emailSubject = `Yeni İletişim Formu: ${name}`;
    const emailText = `
Yeni bir iletişim formu gönderildi:

İsim: ${name}
Email: ${email}
Mesaj: ${message}

Gönderim Zamanı: ${new Date(contact.timestamp).toLocaleString('tr-TR')}
    `;

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1e40af;">Yeni İletişim Formu Gönderildi</h2>
  <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
    <p><strong>İsim:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Mesaj:</strong></p>
    <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
      ${message.replace(/\n/g, '<br>')}
    </div>
    <p style="margin-top: 15px; color: #666; font-size: 14px;">
      <strong>Gönderim Zamanı:</strong> ${new Date(contact.timestamp).toLocaleString('tr-TR')}
    </p>
  </div>
</div>
    `;

    await sendEmail(emailSubject, emailText, emailHtml);

    return NextResponse.json(
      { message: 'Mesajınız başarıyla gönderildi ve kaydedildi!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
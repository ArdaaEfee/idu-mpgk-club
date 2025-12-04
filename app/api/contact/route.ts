import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Use writable data directory when possible. On Vercel the build filesystem is read-only,
// so use `/tmp/data` there (ephemeral) or a custom `DATA_DIR` env var.
const isVercel = !!process.env.VERCEL;
const dataDir = process.env.DATA_DIR || (isVercel ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data'));
const contactsPath = path.join(dataDir, 'contacts.json');

function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
    } catch (e) {
      console.warn('Could not create data directory', dirPath, e);
    }
  }
}

// Save contact, but don't fail the whole request if filesystem is read-only.
function saveContact(data: any) {
  try {
    ensureDirExists(path.dirname(contactsPath));
    let existingData: any[] = [];
    if (fs.existsSync(contactsPath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(contactsPath, 'utf-8')) || [];
      } catch (e) {
        console.warn('Could not parse contacts.json, starting fresh', e);
        existingData = [];
      }
    }

    const newEntry = {
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString(),
      read: false
    };
    existingData.push(newEntry);

    try {
      fs.writeFileSync(contactsPath, JSON.stringify(existingData, null, 2));
    } catch (e) {
      // Likely running on a read-only filesystem (e.g. Vercel). Log and continue.
      console.warn('Could not write contacts.json (filesystem may be read-only):', e);
    }

    return newEntry;
  } catch (err) {
    console.error('saveContact error', err);
    // Return what we can; don't throw so we can continue sending email.
    return { id: Date.now(), ...data, timestamp: new Date().toISOString(), read: false };
  }
}

// Email gönderici
async function sendEmail(subject: string, text: string, html?: string) {
  // If email credentials are not configured, skip sending but log.
  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email not sent - missing EMAIL_SERVER/EMAIL_USER/EMAIL_PASS env vars');
    return;
  }

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

    // Email gönder (don't fail the request if email sending is not configured or fails)
    const emailSubject = `Yeni İletişim Formu: ${name}`;
    const emailText = `Yeni bir iletişim formu gönderildi:\n\nİsim: ${name}\nEmail: ${email}\nMesaj: ${message}\n\nGönderim Zamanı: ${new Date(contact.timestamp).toLocaleString('tr-TR')}`;

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

    try {
      await sendEmail(emailSubject, emailText, emailHtml);
    } catch (e) {
      console.warn('Failed to send contact email:', e);
      // Do not fail the request; the contact was already saved (or at least created in-memory)
      return NextResponse.json({ message: 'Mesaj kaydedildi, ancak e-posta gönderilemedi (sunucu yapılandırması eksik).' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Mesajınız başarıyla gönderildi ve kaydedildi!' }, { status: 200 });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
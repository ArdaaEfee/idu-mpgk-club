import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/mongodb'; // Veritabanı bağlantısı
import { Contact } from '@/models';      // Veritabanı tablosu

// Email gönderici (Aynı kalıyor)
async function sendEmail(to: string, subject: string, text: string, html?: string) {
  // Eğer email ayarları yoksa hata verme, sadece logla ve geç
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Mail ayarları eksik, mail gönderilemedi.");
    return; 
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"IDU MPGK Website" <${process.env.EMAIL_USER}>`,
    to: 'ardaxzadee@gmail.com', // Senin mailin
    subject: subject,
    text: text,
    html: html || text.replace(/\n/g, '<br>'),
  };

  await transporter.sendMail(mailOptions);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur' }, { status: 400 });
    }

    // 1. Veritabanına Bağlan
    await connectDB();

    // 2. Veriyi MongoDB'ye Kaydet
    const newContact = await Contact.create({
      name,
      email,
      message,
      timestamp: new Date()
    });

    // 3. Email Gönder
    const emailSubject = `Yeni İletişim Formu: ${name}`;
    const emailText = `İsim: ${name}\nEmail: ${email}\nMesaj: ${message}`;
    const emailHtml = `
      <h3>Yeni İletişim Mesajı</h3>
      <p><strong>Kimden:</strong> ${name} (${email})</p>
      <p><strong>Mesaj:</strong> ${message}</p>
    `;

    try {
        await sendEmail('ardaxzadee@gmail.com', emailSubject, emailText, emailHtml);
    } catch (mailError) {
        console.error("Mail gönderme hatası:", mailError);
        // Mail gitmese bile veri kaybolmadı, devam et.
    }

    return NextResponse.json(
      { message: 'Mesajınız başarıyla kaydedildi!', id: newContact._id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu' }, { status: 500 });
  }
}
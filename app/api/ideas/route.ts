import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { Idea } from '@/models'
import nodemailer from 'nodemailer'

// 1. POST: Yeni Fikir Ekle ve Mail Gönder
export async function POST(req: Request) {
  try {
    const body = await req.json()
    await dbConnect()
    await Idea.create(body)

    // Mail Ayarları
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"IDU MPGK Fikir Kutusu" <${process.env.EMAIL_USER}>`,
      to: 'ardaxzadee@gmail.com',
      subject: `🚀 Yeni Proje Fikri: ${body.projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Yeni Bir Fikir Geldi! 💡</h2>
          <p><strong>Gönderen:</strong> ${body.name} (<a href="mailto:${body.email}">${body.email}</a>)</p>
          <p><strong>Proje Adı:</strong> ${body.projectTitle}</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <strong>Fikir Detayı:</strong><br/>${body.description}
          </div>
          <p><strong>Dosya Linki:</strong> ${body.fileLink ? `<a href="${body.fileLink}">${body.fileLink}</a>` : 'Yok'}</p>
        </div>
      `,
    }

    try { await transporter.sendMail(mailOptions) } catch (e) { console.error(e) }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// 2. GET: Listele
export async function GET() {
  try {
    await dbConnect()
    const ideas = await Idea.find({}).sort({ timestamp: -1 })
    return NextResponse.json({ ideas }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Fetch error' }, { status: 500 })
  }
}

// 3. DELETE: Fikri Sil (YENİ EKLENEN KISIM)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

    await dbConnect()
    await Idea.findByIdAndDelete(id)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Delete error' }, { status: 500 })
  }
}
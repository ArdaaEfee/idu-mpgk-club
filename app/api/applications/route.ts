import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Application, Member } from '@/models';

// Başvuruları Getir
export async function GET() {
  try {
    await connectDB();
    const applications = await Application.find().sort({ timestamp: -1 });

    // MONGODB DÖNÜŞÜMÜ: _id'yi id'ye çeviriyoruz
    const formattedApplications = applications.map(app => ({
      ...app.toObject(),
      id: app._id.toString() // SİHİRLİ SATIR
    }));

    return NextResponse.json(formattedApplications);
  } catch (error) {
    return NextResponse.json({ error: 'Hata' }, { status: 500 });
  }
}

// Başvuru Sil (Reddet)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    await connectDB();
    await Application.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Başvuru silindi' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 });
  }
}

// Başvuru Onayla (Üye Yap)
export async function PATCH(request: NextRequest) {
  try {
    const { id, role = 'üye' } = await request.json();

    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    await connectDB();

    // 1. Başvuruyu MongoDB ID ile bul
    const application = await Application.findById(id);
    if (!application) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });

    // 2. Yeni Üye Oluştur
    const newMember = await Member.create({
      firstName: application.firstName,
      lastName: application.lastName,
      studentNumber: application.studentNumber,
      department: application.department,
      role: role,
      applicationId: application._id
    });

    // 3. Başvuruyu Sil
    await Application.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Onaylandı', member: newMember }, { status: 200 });

  } catch (error) {
    console.error("Onay hatası:", error);
    return NextResponse.json({ error: 'Onaylama hatası' }, { status: 500 });
  }
}
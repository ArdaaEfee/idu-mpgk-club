import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // veya senin yolun: ../../../lib/mongodb
import { Member } from '@/models'; // veya senin yolun: ../../../models

export async function GET() {
  try {
    await connectDB();
    
    // Üyeleri getir (En yeni en üstte)
    const members = await Member.find().sort({ joinDate: -1 });

    // Frontend için _id -> id dönüşümü (ÇOK ÖNEMLİ)
    const formattedMembers = members.map(member => ({
      ...member.toObject(),
      id: member._id.toString()
    }));

    return NextResponse.json(formattedMembers);
  } catch (error) {
    return NextResponse.json({ error: 'Üyeler alınamadı' }, { status: 500 });
  }
}

// Üye Silme (Lazım olur diye ekliyorum)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    await connectDB();
    await Member.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Üye silindi' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 });
  }
}
// Rol Güncelleme Fonksiyonu
export async function PATCH(request: NextRequest) {
  try {
    const { id, role } = await request.json();

    if (!id || !role) {
      return NextResponse.json({ error: 'ID ve Rol gerekli' }, { status: 400 });
    }

    await connectDB();

    // MongoDB'de bul ve güncelle
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { role: role },
      { new: true } // Güncellenmiş halini geri döndür
    );

    if (!updatedMember) {
      return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 });
    }

    // Frontend'in anlaması için _id -> id dönüşümü
    const formattedMember = {
      ...updatedMember.toObject(),
      id: updatedMember._id.toString()
    };

    return NextResponse.json({ 
      message: 'Rol başarıyla güncellendi', 
      member: formattedMember 
    }, { status: 200 });

  } catch (error) {
    console.error("Rol güncelleme hatası:", error);
    return NextResponse.json({ error: 'Rol güncellenirken sunucu hatası oluştu' }, { status: 500 });
  }
}
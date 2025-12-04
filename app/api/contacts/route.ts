import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // veya yolu nasıl düzelttiysen öyle kalsın
import { Contact } from '@/models';

export async function GET() {
  try {
    await connectDB();
    // Verileri tarihe göre tersten sırala
    const contacts = await Contact.find().sort({ timestamp: -1 });
    
    // MONGODB DÖNÜŞÜMÜ: _id'yi id'ye çeviriyoruz ki frontend anlasın
    const formattedContacts = contacts.map(contact => ({
      ...contact.toObject(),
      id: contact._id.toString() // BURASI SİHİRLİ SATIR
    }));

    return NextResponse.json(formattedContacts);
  } catch (error) {
    return NextResponse.json({ error: 'Veriler alınamadı' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    await connectDB();
    // MongoDB ID'si ile silme işlemi
    await Contact.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Silindi' }, { status: 200 });
  } catch (error) {
    console.error("Silme hatası:", error);
    return NextResponse.json({ error: 'Silme hatası' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contactsPath = path.join(process.cwd(), 'data', 'contacts.json');

export async function GET() {
  try {
    if (!fs.existsSync(contactsPath)) {
      return NextResponse.json([]);
    }

    const data = fs.readFileSync(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    
    // Tarihe göre sırala (yeniden eskiye)
    contacts.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Contacts fetch error:', error);
    return NextResponse.json(
      { error: 'İletişim formları alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(contactsPath)) {
      return NextResponse.json(
        { error: 'İletişim formu bulunamadı' },
        { status: 404 }
      );
    }

    const contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'));
    const filteredContacts = contacts.filter((contact: any) => contact.id !== parseInt(id));

    fs.writeFileSync(contactsPath, JSON.stringify(filteredContacts, null, 2));

    return NextResponse.json(
      { message: 'İletişim formu başarıyla silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact delete error:', error);
    return NextResponse.json(
      { error: 'İletişim formu silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
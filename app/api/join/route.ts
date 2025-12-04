import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const membersPath = path.join(process.cwd(), 'data', 'members.json');
const applicationsPath = path.join(process.cwd(), 'data', 'applications.json'); // Yeni: Başvurular için ayrı dosya

// Başvurular için ayrı veritabanı
function ensureApplicationsDbExists() {
  const dir = path.dirname(applicationsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(applicationsPath)) {
    fs.writeFileSync(applicationsPath, JSON.stringify([], null, 2));
  }
}

function ensureMembersDbExists() {
  const dir = path.dirname(membersPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(membersPath)) {
    fs.writeFileSync(membersPath, JSON.stringify([], null, 2));
  }
}

// Başvuruyu kaydet (üye değil, sadece başvuru)
function saveApplication(data: any) {
  ensureApplicationsDbExists();
  const existingData = JSON.parse(fs.readFileSync(applicationsPath, 'utf-8'));
  const newEntry = {
    id: Date.now(),
    ...data,
    timestamp: new Date().toISOString(),
    status: 'pending' // Başvuru durumu
  };
  existingData.push(newEntry);
  fs.writeFileSync(applicationsPath, JSON.stringify(existingData, null, 2));
  return newEntry;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== BAŞVURU API ÇAĞRILDI ===');
    
    const body = await request.json();
    console.log('Gelen veri:', body);

    const { firstName, lastName, studentNumber, department, interests } = body;

    // Detaylı validasyon
    if (!firstName?.trim()) {
      return NextResponse.json(
        { error: 'Ad alanı zorunludur' },
        { status: 400 }
      );
    }
    if (!lastName?.trim()) {
      return NextResponse.json(
        { error: 'Soyad alanı zorunludur' },
        { status: 400 }
      );
    }
    if (!studentNumber?.trim()) {
      return NextResponse.json(
        { error: 'Öğrenci numarası zorunludur' },
        { status: 400 }
      );
    }
    if (!department?.trim()) {
      return NextResponse.json(
        { error: 'Bölüm seçimi zorunludur' },
        { status: 400 }
      );
    }

    console.log('Validasyon başarılı, veri kaydediliyor...');

    // Başvuruyu kaydet (üye değil)
    const application = saveApplication({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      studentNumber: studentNumber.trim(),
      department: department.trim(),
      interests: interests?.trim() || ''
    });

    console.log('Başvuru kaydedildi:', application);

    return NextResponse.json(
      { 
        message: 'Başvurunuz başarıyla alındı! Onaylandıktan sonra üye olacaksınız.',
        applicationId: application.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('=== BAŞVURU HATASI ===', error);
    
    let errorMessage = 'Başvuru gönderilirken bir hata oluştu';
    
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        errorMessage = 'Veritabanı dosyası oluşturulamadı';
      } else if (error.message.includes('Unexpected token')) {
        errorMessage = 'Veritabanı dosyası bozuk';
      } else {
        errorMessage = `Hata: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
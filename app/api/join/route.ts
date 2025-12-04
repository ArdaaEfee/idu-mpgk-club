import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use /tmp/data on Vercel (writable, ephemeral) or DATA_DIR env override
const isVercel = !!process.env.VERCEL;
const dataDir = process.env.DATA_DIR || (isVercel ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data'));
const membersPath = path.join(dataDir, 'members.json');
const applicationsPath = path.join(dataDir, 'applications.json');

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn('Could not create data dir', dir, e);
    }
  }
}

function saveApplication(data: any) {
  try {
    ensureDirExists(path.dirname(applicationsPath));
    let existingData: any[] = [];
    if (fs.existsSync(applicationsPath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(applicationsPath, 'utf-8')) || [];
      } catch (e) {
        console.warn('Could not parse applications.json, starting fresh', e);
        existingData = [];
      }
    }

    const newEntry = {
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    existingData.push(newEntry);

    try {
      fs.writeFileSync(applicationsPath, JSON.stringify(existingData, null, 2));
    } catch (e) {
      console.warn('Could not write applications.json (filesystem may be read-only):', e);
    }

    return newEntry;
  } catch (err) {
    console.error('saveApplication error', err);
    return { id: Date.now(), ...data, timestamp: new Date().toISOString(), status: 'pending' };
  }
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
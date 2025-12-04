import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const applicationsPath = path.join(process.cwd(), 'data', 'applications.json');
const membersPath = path.join(process.cwd(), 'data', 'members.json');

// Başvuruları getir
export async function GET() {
  try {
    if (!fs.existsSync(applicationsPath)) {
      return NextResponse.json([]);
    }

    const data = fs.readFileSync(applicationsPath, 'utf-8');
    const applications = JSON.parse(data);
    
    applications.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { error: 'Başvurular alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Başvuruyu sil
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

    if (!fs.existsSync(applicationsPath)) {
      return NextResponse.json(
        { error: 'Başvuru bulunamadı' },
        { status: 404 }
      );
    }

    const applications = JSON.parse(fs.readFileSync(applicationsPath, 'utf-8'));
    const filteredApplications = applications.filter((app: any) => app.id !== parseInt(id));

    fs.writeFileSync(applicationsPath, JSON.stringify(filteredApplications, null, 2));

    return NextResponse.json(
      { message: 'Başvuru başarıyla silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Application delete error:', error);
    return NextResponse.json(
      { error: 'Başvuru silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Başvuruyu onayla ve üye yap
export async function PATCH(request: NextRequest) {
  try {
    const { id, role = 'üye' } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(applicationsPath)) {
      return NextResponse.json(
        { error: 'Başvuru bulunamadı' },
        { status: 404 }
      );
    }

    // Başvuruyu bul
    const applications = JSON.parse(fs.readFileSync(applicationsPath, 'utf-8'));
    const applicationIndex = applications.findIndex((app: any) => app.id === parseInt(id));

    if (applicationIndex === -1) {
      return NextResponse.json(
        { error: 'Başvuru bulunamadı' },
        { status: 404 }
      );
    }

    const application = applications[applicationIndex];

    // Üyeler dosyasını hazırla
    const membersDir = path.dirname(membersPath);
    if (!fs.existsSync(membersDir)) {
      fs.mkdirSync(membersDir, { recursive: true });
    }
    
    let members = [];
    if (fs.existsSync(membersPath)) {
      members = JSON.parse(fs.readFileSync(membersPath, 'utf-8'));
    }

    // Yeni üye oluştur
    const newMember = {
      id: Date.now(),
      ...application,
      role: role,
      joinDate: new Date().toISOString(),
      applicationId: application.id // Hangi başvurudan geldiği
    };

    // Üye listesine ekle
    members.push(newMember);
    fs.writeFileSync(membersPath, JSON.stringify(members, null, 2));

    // Başvuruyu sil (artık üye oldu)
    applications.splice(applicationIndex, 1);
    fs.writeFileSync(applicationsPath, JSON.stringify(applications, null, 2));

    return NextResponse.json(
      { 
        message: 'Başvuru onaylandı ve üye eklendi',
        member: newMember 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Application approve error:', error);
    return NextResponse.json(
      { error: 'Başvuru onaylanırken bir hata oluştu' },
      { status: 500 }
    );
  }
}
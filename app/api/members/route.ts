import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const membersPath = path.join(process.cwd(), 'data', 'members.json');

export async function GET() {
  try {
    if (!fs.existsSync(membersPath)) {
      return NextResponse.json([]);
    }

    const data = fs.readFileSync(membersPath, 'utf-8');
    const members = JSON.parse(data);
    
    members.sort((a: any, b: any) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    
    return NextResponse.json(members);
  } catch (error) {
    console.error('Members fetch error:', error);
    return NextResponse.json(
      { error: 'Üyeler alınırken bir hata oluştu' },
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

    if (!fs.existsSync(membersPath)) {
      return NextResponse.json(
        { error: 'Üye bulunamadı' },
        { status: 404 }
      );
    }

    const members = JSON.parse(fs.readFileSync(membersPath, 'utf-8'));
    const filteredMembers = members.filter((member: any) => member.id !== parseInt(id));

    fs.writeFileSync(membersPath, JSON.stringify(filteredMembers, null, 2));

    return NextResponse.json(
      { message: 'Üye başarıyla silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Member delete error:', error);
    return NextResponse.json(
      { error: 'Üye silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, role } = await request.json();

    if (!id || !role) {
      return NextResponse.json(
        { error: 'ID ve rol parametreleri gerekli' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(membersPath)) {
      return NextResponse.json(
        { error: 'Üye bulunamadı' },
        { status: 404 }
      );
    }

    const members = JSON.parse(fs.readFileSync(membersPath, 'utf-8'));
    const memberIndex = members.findIndex((member: any) => member.id === parseInt(id));

    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Üye bulunamadı' },
        { status: 404 }
      );
    }

    members[memberIndex].role = role;
    fs.writeFileSync(membersPath, JSON.stringify(members, null, 2));

    return NextResponse.json(
      { message: 'Üye rolü güncellendi', member: members[memberIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Member update error:', error);
    return NextResponse.json(
      { error: 'Üye güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Application } from '@/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, studentNumber, department, interests } = body;

    if (!firstName || !lastName || !studentNumber || !department) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    await connectDB();

    // Veritabanına kaydet
    const newApplication = await Application.create({
      firstName,
      lastName,
      studentNumber,
      department,
      interests,
      status: 'pending'
    });

    return NextResponse.json(
      { message: 'Başvuru alındı', applicationId: newApplication._id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Join error:', error);
    return NextResponse.json({ error: 'Başvuru sırasında hata oluştu' }, { status: 500 });
  }
}
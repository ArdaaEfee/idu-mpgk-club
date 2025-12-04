import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'submissions.json');

export async function GET(request: NextRequest) {
  try {
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json([]);
    }
    
    const data = fs.readFileSync(dbPath, 'utf-8');
    const submissions = JSON.parse(data);
    
    // Tarihe göre sırala (yeniden eskiye)
    submissions.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Submissions fetch error:', error);
    return NextResponse.json(
      { error: 'Veriler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}
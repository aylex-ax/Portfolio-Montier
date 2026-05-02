import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'projects.json');

export async function POST(request) {
  try {
    const reorderedProjects = await request.json();
    
    // Ensure directory exists
    const dir = path.dirname(dataFilePath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }

    // Physically overwrite the file
    await fs.writeFile(dataFilePath, JSON.stringify(reorderedProjects, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: "Order permanently saved." });
  } catch (error) {
    console.error('Error rewriting projects order:', error);
    return NextResponse.json({ error: 'Failed to rewrite data' }, { status: 500 });
  }
}

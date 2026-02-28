import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  let filePath = '';
  let browser = null;
  try {
    const { data, template } = await req.json();
    
    if (!data || !template) {
      return NextResponse.json({ error: 'Missing data or template' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    filePath = path.join('/tmp', `resume-${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data));

    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    const url = `${baseUrl}/print?id=${id}&template=${template}`;

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    // Use scale 1 and default behavior for exact match
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: (data.spacing?.pageSize as any) === 'A4' ? 'A4' : 'Letter',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    return new NextResponse(pdfBuffer as unknown as Blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"'
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

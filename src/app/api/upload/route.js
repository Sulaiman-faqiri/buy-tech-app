import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    console.log('Uploading file:', file.name)

  const blob = await put(file.name, file, {
  access: 'public',
  addRandomSuffix: true,
  contentType: file.type,
})

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('UPLOAD ERROR:', error) 

    return NextResponse.json(
      {
        error: error.message || 'Upload failed',
      },
      { status: 500 }
    )
  }
}
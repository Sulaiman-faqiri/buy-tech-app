import { del } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function DELETE(request) {
  try {
    const { url } = await request.json()

    await del(url)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    )
  }
}
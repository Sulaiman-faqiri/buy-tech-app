import { connectToDb } from '../../../lib/connectToDb'
import { User } from '../../../models/models'

import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
export const dynamic = 'force-dynamic'
export const GET = async (request) => {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get('query') || ''
    let page = parseInt(url.searchParams.get('page'))
    page = page > 0 ? page : 1
    const ITEM_PER_PAGE = 9

    await connectToDb()

    const filter = {
      isActive: true, // Ensure only active users are fetched
      ...(query ? { username: { $regex: query, $options: 'i' } } : {}),
    }

    const count = await User.countDocuments(filter)

    const users = await User.find(filter)
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))

    return NextResponse.json({ ITEM_PER_PAGE, count, users })
  } catch (err) {
    console.log(err)
    return NextResponse.error('Failed to fetch users', { status: 500 })
  }
}

export const POST = async (req, res) => {
  try {
    const data = await req.json()
    const { username, email, isAdmin, password, imageInfo } = data
    let img = null
    if (imageInfo.src) {
      img = {
        src: imageInfo.src,
        size: imageInfo.size,
        name: imageInfo.name,
      }
    }
    if (
      username.trim().length < 4 ||
      username.trim().length > 19 ||
      !email.trim() ||
      email.trim().length > 49 ||
      !password.trim()
    ) {
      return NextResponse.json(
        {
          message: `User fields cannot be empty. Username must be between 3 and 20 characters, and email must be maximum 50 characters.`,
        },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await connectToDb()
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        {
          message: `Email already exists. Please use a different email.`,
        },
        { status: 400 }
      )
    }

    const newUser = new User({
      username,
      email,
      isAdmin,
      password: hashedPassword,
      img,
    })

    await newUser.save()
    revalidatePath('/dashboard', 'page')
    revalidatePath('/dashboard/users', 'page')

    return NextResponse.json(
      { message: 'User has been created successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.error('Failed to create user')
  }
}

import { connectToDb } from '../../../../lib/connectToDb'
import { User } from '../../../../models/models'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export const GET = async (request, { params }) => {
  const { id } = params
  try {
    await connectToDb()
    const user = await User.findOne({ _id: id })

    if (!user) {
      return NextResponse.error('User not found', { status: 404 })
    }
    return NextResponse.json(user)
  } catch (err) {
    console.error(err)
    return NextResponse.error('Failed to fetch user', { status: 500 })
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params

  try {
    await connectToDb()

    const data = await request.json()

    const { username, email, isAdmin, oldPassword, newPassword, imageInfo } =
      data

    // Validate input data
    if (!username || !email || !imageInfo) {
      return NextResponse.json(
        { message: 'Username, email, and image are required' },
        { status: 400 }
      )
    }

    if (
      username.trim().length < 4 ||
      username.trim().length > 19 ||
      email.trim().length > 49
    ) {
      return NextResponse.json(
        { message: 'Invalid username or email length' },
        { status: 400 }
      )
    }

    // Check if email is already in use by another user
    const existingUserWithEmail = await User.findOne({ email })
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== id) {
      return NextResponse.json(
        { message: 'Email already in use by another user' },
        { status: 400 }
      )
    }

    // Fetch current user from database to compare old password
    const currentUser = await User.findById(id)
    if (!currentUser) {
      return NextResponse.error('User not found', { status: 404 })
    }

    // Hash the new password if provided
    let hashedPassword = currentUser.password
    if (newPassword) {
      if (oldPassword) {
        // Compare old password with stored hashed password
        const passwordMatch = await bcrypt.compare(
          oldPassword,
          currentUser.password
        )
        if (!passwordMatch) {
          return NextResponse.json(
            { message: 'Old password does not match' },
            { status: 400 }
          )
        }
      }
      hashedPassword = await bcrypt.hash(newPassword, 10)
    }

    // Determine if email or password was updated

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
        email,
        isAdmin,
        password: hashedPassword,
        img: imageInfo,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run validators to ensure data validity
      }
    )

    if (!updatedUser) {
      return NextResponse.error('User not found', { status: 404 })
    }
    revalidatePath('/dashboard/users', 'page')

    return NextResponse.json({
      message: 'Settings updated successfully',
    })
  } catch (err) {
    console.error(err)
    return NextResponse.error('Failed to update settings', { status: 500 })
  }
}

export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    await connectToDb()

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.error('User not found', { status: 404 })
    }
    revalidatePath('/dashboard/users', 'page')
    revalidatePath('/dashboard', 'page')

    return NextResponse.json({ message: 'User deactivated successfully' })
  } catch (err) {
    console.error(err)
    return NextResponse.error('Failed to deactivate user', { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { connectToDb } from '../../../lib/connectToDb'
import { Category } from '../../../models/models'

export const GET = async (request) => {
  try {
    await connectToDb()

    const categories = await Category.find()

    return NextResponse.json(categories, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.error('Failed to fetch categories', { status: 500 })
  }
}

export const POST = async (request) => {
  try {
    const { name, description } = await request.json()

    if (!name.trim()) {
      console.log('runned')
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      )
    }

    await connectToDb()

    const existingCategory = await Category.findOne({ name })

    if (existingCategory) {
      return NextResponse.json('Category with this name already exists', {
        status: 400,
      })
    }

    const newCategory = new Category({
      name,
      description,
    })

    await newCategory.save()

    return NextResponse.json(
      { message: 'Category created successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.error('Failed to create category', { status: 500 })
  }
}

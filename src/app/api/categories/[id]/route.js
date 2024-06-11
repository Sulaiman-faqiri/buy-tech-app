import { NextResponse } from 'next/server'
import { connectToDb } from '../../../../lib/connectToDb'
import { Category, Product } from '../../../../models/models'
import { revalidatePath } from 'next/cache'

export const DELETE = async (request, { params }) => {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { message: 'Category ID is required' },
        { status: 400 }
      )
    }

    await connectToDb()

    // Find and delete the category
    const deletedCategory = await Category.findByIdAndDelete(id)

    if (!deletedCategory) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    // Find products with the deleted category and delete them
    await Product.deleteMany({ category: id })
    revalidatePath('/dashboard/categories', 'page')

    return NextResponse.json(
      { message: 'Category and associated products deleted successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.error(
      'Failed to delete category and associated products',
      { status: 500 }
    )
  }
}

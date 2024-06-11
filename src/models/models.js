import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
    },
    img: {
      name: { type: String },
      size: { type: String },
      src: { type: String },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  providerAccountId: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
  },
  access_token: {
    type: String,
  },
  expires_at: {
    type: Number,
  },
  token_type: {
    type: String,
  },
  scope: {
    type: String,
  },
  id_token: {
    type: String,
  },
  session_state: {
    type: String,
  },
})

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: [
      {
        name: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        src: {
          type: String,
          required: true,
        },
      },
    ],
    currentPrice: {
      type: Number,
      required: true,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    discountStartDate: {
      type: Date,
      default: null,
    },
    discountEndDate: {
      type: Date,
      default: null,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    outOfStock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    phoneNumber: { type: String },
    orderItems: [orderItemSchema],
    orderStatus: {
      type: String,
      default: 'Pending',
    },
    stripeChargeId: {
      type: String,
    },
  },
  { timestamps: true }
)

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true })

export const User = mongoose.models?.User || mongoose.model('User', userSchema)

export const Account =
  mongoose.models?.Account || mongoose.model('Account', accountSchema)

export const Category =
  mongoose.models?.Category || mongoose.model('Category', categorySchema)

export const Product =
  mongoose.models?.Product || mongoose.model('Product', productSchema)

export const Order =
  mongoose.models?.Order || mongoose.model('Order', orderSchema)

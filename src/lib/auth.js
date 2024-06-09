import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDb } from './connectToDb'
import { Account, User } from '../models/models'
import { authConfig } from './auth.config'
import bcrypt from 'bcryptjs'

// Login function for email and password
const login = async (credentials) => {
  try {
    let user = null
    await connectToDb()
    user = await User.findOne({ email: credentials.email })

    if (!user) {
      throw new Error('Wrong credentials!')
    }

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    )

    if (!isPasswordCorrect) throw new Error('Wrong credentials!')
    return user
  } catch (err) {
    console.log(err)
    throw new Error('Failed to login!')
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await login(credentials)
          return user
        } catch (err) {
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id || user._id
        token.isAdmin = user.isAdmin
      } else if (account && profile) {
        // Connect to the database
        await connectToDb()

        // Find or create the user by email
        let existingUser = await User.findOne({ email: profile.email })

        if (!existingUser) {
          // Create a new user if they do not exist
          const newUser = new User({
            username: profile.name,
            email: profile.email,
            img: { src: profile.picture },
            isAdmin: false,
          })
          existingUser = await newUser.save()
        }

        token.id = existingUser._id
        token.isAdmin = existingUser.isAdmin
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.isAdmin = token.isAdmin
      }
      return session
    },

    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          // Connect to the database
          await connectToDb()

          // Find or create the user by email
          let existingUser = await User.findOne({ email: profile.email })

          if (!existingUser) {
            // Create a new user if they do not exist
            const newUser = new User({
              username: profile.name,
              email: profile.email,
              img: { src: profile.picture },
              isAdmin: false,
            })
            existingUser = await newUser.save()
          }

          // Ensure the user ID and isAdmin are added to the user object
          user.id = existingUser._id
          user.isAdmin = existingUser.isAdmin

          // Find or create the account associated with the user
          let existingAccount = await Account.findOne({
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          })

          if (!existingAccount) {
            // Create a new account if it does not exist
            const newAccount = new Account({
              userId: existingUser._id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            })

            await newAccount.save()
          } else {
            // Update account details if account already exists
            existingAccount.access_token = account.access_token
            existingAccount.refresh_token = account.refresh_token
            existingAccount.expires_at = account.expires_at
            existingAccount.token_type = account.token_type
            existingAccount.scope = account.scope
            existingAccount.id_token = account.id_token
            existingAccount.session_state = account.session_state

            await existingAccount.save()
          }
          return true
        } catch (err) {
          console.error(err)
          return false
        }
      }
      return true
    },
  },
  redirect({ url, baseUrl }) {
    // Redirect to home page after sign-in
    if (url === '/') {
      return baseUrl
    }
    // Default redirect to homepage
    return baseUrl
  },
})

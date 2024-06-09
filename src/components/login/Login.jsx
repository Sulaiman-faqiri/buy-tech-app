'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import GoogleIcon from '@mui/icons-material/Google'
import { useRouter, useSearchParams } from 'next/navigation'
import './Login.scss'

const Login = () => {
  const router = useRouter()
  const { status } = useSession()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setError(params.get('error'))
  }, [params])
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])
  console.log(status)
  const handleSignIn = async () => {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (res?.error) {
      setError(res.error)
    }
  }
  return (
    <div className='loginBox'>
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Login</h1>
        <div className='inputBox'>
          <label htmlFor='LoginEmail'>Email</label>
          <input
            placeholder='Enter your email.'
            id='loginEmail'
            type='email'
            name='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className='inputBox'>
          <label htmlFor='loginPassword'>Password</label>
          <input
            placeholder='Enter your password.'
            id='loginPassword'
            type='password'
            name='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        {error && <p className={`error`}>Wrong credentials!</p>}
        <button type='button' onClick={handleSignIn} className='btn1'>
          Login
        </button>
        <div className={`separator`}>
          <hr />
          <span>Or</span>
          <hr />
        </div>
        <button type='button' onClick={() => signIn('google')} className='btn2'>
          Login with google <GoogleIcon />
        </button>
        <span>
          Don&apos;t have any account? <Link href={'/register'}>Sign Up</Link>
        </span>
      </form>
    </div>
  )
}

export default Login

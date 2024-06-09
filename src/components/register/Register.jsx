'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import GoogleIcon from '@mui/icons-material/Google'
import './Register.scss'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
const RegisterForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [sumbitForm, setSubmitForm] = useState(false)

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'userName':
        if (value.trim() === '') {
          return 'Please enter your name.'
        }
        return ''

      case 'email':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address.'
        }
        return ''

      case 'password':
        const passwordRegex =
          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        if (!passwordRegex.test(value)) {
          return 'Please enter a valid password containing numbers, symbols, uppercase, and lowercase letters.'
        }
        return ''

      case 'confirmPassword':
        if (value !== formData.password) {
          return "Passwords don't match."
        }
        return ''

      default:
        return ''
    }
  }

  const handleBlur = (fieldName, value) => {
    const fieldError = validateField(fieldName, value)

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: fieldError,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { userName: username, email, password } = formData
    const newErrors = {}
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })

    if (Object.keys(newErrors).length === 0) {
      try {
        setSubmitForm(true)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
          {
            username,
            email,
            password,
            isAdmin: false,
            imageInfo: { src: null },
          }
        )
        if (response.status === 200) {
          setSubmitForm(true)
          toast.success('Account has been created successfully.')
          router.push('/login')
        }
      } catch (error) {
        if (error) {
          setSubmitForm(false)
          console.log(error.response.data.message)
          toast.error(error.response.data.message)
        }
      }
    }
  }

  return (
    <div className={`resgisterForm`}>
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Registration form</h1>

        <div className='inputBox'>
          <label htmlFor='nameRegister'>Name</label>
          <input
            name='userName'
            placeholder='Enter your name.'
            id='nameRegister'
            type='text'
            value={formData.userName}
            onBlur={() => handleBlur('userName', formData.userName)}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
          />
          {errors.userName && <span className='error'>{errors.userName}</span>}
        </div>

        <div className='inputBox'>
          <label htmlFor='registerEmail'>Email</label>
          <input
            name='email'
            placeholder='Enter your email.'
            id='registerEmail'
            type='email'
            value={formData.email}
            onBlur={() => handleBlur('email', formData.email)}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && <span className='error'>{errors.email}</span>}
        </div>
        <div className='inputBox'>
          <label htmlFor='registerPassword'>Password</label>
          <input
            name='password'
            placeholder='Enter your password.'
            id='registerPassword'
            type='password'
            value={formData.password}
            onBlur={() => handleBlur('password', formData.password)}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && <span className='error'>{errors.password}</span>}
        </div>
        <div className='inputBox'>
          <label htmlFor='registerConfirmPassword'>Confirm Password</label>
          <input
            name='confirmPassword'
            placeholder='Enter your password.'
            id='registerConfirmPassword'
            type='password'
            value={formData.confirmPassword}
            onBlur={() =>
              handleBlur('confirmPassword', formData.confirmPassword)
            }
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          {errors.confirmPassword && (
            <span className='error'>{errors.confirmPassword}</span>
          )}
        </div>
        <button
          disabled={sumbitForm}
          onClick={handleSubmit}
          className='btn1'
          type='submit'
        >
          Submit
        </button>
        <button className='btn2'>
          Sign up with google <GoogleIcon />
        </button>
        <span>
          <Link href={'/login'}>Sign In</Link>
        </span>
      </form>
    </div>
  )
}

export default RegisterForm

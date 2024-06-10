'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../../lib/firebaseConfig'
import { v4 as uuidv4 } from 'uuid'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import './AddUser.scss'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export const formatFileSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

const AddNewUser = ({ singleUser, admin, add }) => {
  const router = useRouter()

  const inputRef = useRef(null)
  const [imageInfo, setImageInfo] = useState({
    name: '',
    size: '',
    src: '',
    file: '',
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formValidate, setFormValidate] = useState(true)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false,
  })
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (singleUser) {
      setUserData({
        username: singleUser.username,
        email: singleUser.email,
        password: '',
        isAdmin: singleUser.isAdmin ? true : false,
      })
      setImageInfo({ ...singleUser.img, file: '' })
    }
  }, [singleUser])

  const handleInputs = (e) => {
    const { name, value } = e.target

    if (name === 'isAdmin') {
      const isAdmin = value === 'true'

      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: isAdmin,
      }))
    } else {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: value,
      }))
    }
  }

  const handlePasswordInputs = (e) => {
    const { name, value } = e.target
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }))
  }

  const inputImg = ({ target: { files } }) => {
    if (files[0]) {
      const { name, size } = files[0]
      setImageInfo({
        name: `${uuidv4()}_${name}`,
        size: formatFileSize(size),
        src: URL.createObjectURL(files[0]),
        file: files[0],
      })
    }
  }

  const isValid = (isAddUser) => {
    let error = ''

    // For adding a new user
    if (isAddUser) {
      if (
        userData.username?.trim().length < 4 ||
        userData.username?.trim().length > 19
      ) {
        error = 'Username must be between 4 and 19 characters.'
      } else if (!userData.email?.trim()) {
        error = 'Email is required.'
      } else if (userData.email?.trim().length > 49) {
        error = 'Email must be maximum 50 characters.'
      } else if (userData.password?.trim().length <= 4) {
        error = 'Password must be more than 4 characters.'
      } else if (!imageInfo.file) {
        error = 'Image is required.'
      }
    } else {
      // For updating an existing user
      if (passwords.oldPassword && !passwords.newPassword) {
        error = 'New password is required when old password is provided.'
      } else if (passwords.newPassword && !passwords.oldPassword) {
        error = 'Old password is required when new password is provided.'
      } else if (
        passwords.newPassword &&
        passwords.newPassword !== passwords.confirmPassword
      ) {
        error = 'New password and confirm password do not match.'
      } else if (passwords.newPassword && passwords.newPassword.length <= 4) {
        error = 'New password must be more than 5 characters.'
      } else if (
        userData.username?.trim().length < 4 ||
        userData.username?.trim().length > 19
      ) {
        error = 'Username must be between 4 and 19 characters.'
      } else if (!userData.email?.trim()) {
        error = 'Email is required.'
      } else if (userData.email?.trim().length > 49) {
        error = 'Email must be maximum 50 characters.'
      }
    }

    if (error) {
      setErrorMessage(error)
      return false
    }
    setErrorMessage('')
    return true
  }

  const formSubmit = async (e) => {
    e.preventDefault()
    let downloadURL = null

    const isAddUser = !singleUser

    if (!isValid(isAddUser)) {
      setFormValidate(false)
      return
    }

    setFormValidate(true)
    setFormSubmitted(true)

    try {
      if (imageInfo.file) {
        const storageRef = ref(storage, `images/${imageInfo.name}`)
        const uploadTask = uploadBytesResumable(storageRef, imageInfo.file)

        uploadTask.on('state_changed', (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        })

        await uploadTask
        downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
      }

      const updateData = {
        ...userData,
        imageInfo: {
          ...imageInfo,
          src: downloadURL || singleUser?.img?.src,
        },
        ...(singleUser &&
          admin &&
          passwords.newPassword &&
          passwords.newPassword === passwords.confirmPassword && {
            newPassword: passwords.newPassword,
            oldPassword: passwords.oldPassword,
          }),
      }
      console.log(updateData)
      const url = isAddUser
        ? `http://localhost:3000/api/users`
        : `http://localhost:3000/api/users/${singleUser._id?.toString()}`

      const method = isAddUser ? 'post' : 'put'

      const response = await axios[method](url, updateData)

      if (response.status === 200) {
        setFormSubmitted(false)
        toast.success(response.data.message)
        router.push('/dashboard/users')
        router.refresh('/dashboard/users')
      }
    } catch (error) {
      setFormSubmitted(false)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='addNewUser'>
      <h2>
        {admin && singleUser
          ? 'Edit Settings'
          : singleUser
          ? 'View User'
          : 'Add New User'}
      </h2>

      <form onSubmit={formSubmit}>
        <div className='box'>
          <div className='left'>
            <div className='wrapper'>
              <div className='inputBox'>
                <label htmlFor='name'>Name</label>
                {singleUser && !admin ? (
                  <p>{userData.username}</p>
                ) : (
                  <input
                    placeholder='Enter your name.'
                    id='name'
                    type='text'
                    name='username'
                    value={userData.username}
                    onChange={handleInputs}
                  />
                )}
              </div>
              <div className='inputBox'>
                <label htmlFor='email'>Email</label>
                {singleUser && !admin ? (
                  <p>{userData.email}</p>
                ) : (
                  <input
                    placeholder='Enter your email.'
                    id='loginEmail'
                    type='email'
                    name='email'
                    value={userData.email}
                    onChange={handleInputs}
                  />
                )}
              </div>
            </div>
            <div className='wrapper'>
              {!singleUser && (
                <div className='inputBox'>
                  <label htmlFor='password'>Password</label>
                  <input
                    placeholder='Enter your password.'
                    id='password'
                    type='password'
                    name='password'
                    value={userData.password}
                    onChange={handleInputs}
                  />
                </div>
              )}
              {singleUser && (
                <>
                  <div className='inputBox'>
                    <label htmlFor='oldPassword'>Old Password</label>
                    <input
                      placeholder='Enter your old password.'
                      id='oldPassword'
                      type='password'
                      name='oldPassword'
                      value={passwords.oldPassword}
                      onChange={handlePasswordInputs}
                    />
                  </div>
                  <div className='inputBox'>
                    <label htmlFor='newPassword'>New Password</label>
                    <input
                      placeholder='Enter your new password.'
                      id='newPassword'
                      type='password'
                      name='newPassword'
                      value={passwords.newPassword}
                      onChange={handlePasswordInputs}
                    />
                  </div>
                  <div className='inputBox'>
                    <label htmlFor='confirmPassword'>
                      Confirm New Password
                    </label>
                    <input
                      placeholder='Confirm your new password.'
                      id='confirmPassword'
                      type='password'
                      name='confirmPassword'
                      value={passwords.confirmPassword}
                      onChange={handlePasswordInputs}
                    />
                  </div>
                </>
              )}
              <div className='selectBox'>
                <label htmlFor='isAdmin'>Is Admin</label>
                {singleUser && !add ? (
                  <p>{userData.isAdmin ? 'Yes' : 'No'}</p>
                ) : (
                  <select
                    name='isAdmin'
                    id='isAdmin'
                    value={userData.isAdmin ? 'true' : 'false'}
                    onChange={handleInputs}
                  >
                    <option value='false'>No</option>
                    <option value='true'>Yes</option>
                  </select>
                )}
              </div>
            </div>
          </div>
          {(admin || add) && (
            <div className='right'>
              <div className='box' onClick={() => inputRef.current?.click()}>
                <span>Upload Image</span>
                <CloudUploadIcon />
                <input
                  onChange={inputImg}
                  accept='image/*'
                  type='file'
                  hidden
                  ref={inputRef}
                />
                {imageInfo.src && (
                  <>
                    <Image
                      src={imageInfo.src}
                      alt='img'
                      width={80}
                      height={80}
                      blur='true'
                    />
                    {uploadProgress && (
                      <span className='progress'>
                        uploading: {uploadProgress.toFixed(0)}%
                      </span>
                    )}
                    <span>{imageInfo.name + ' ' + imageInfo.size}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {singleUser && !admin && (
            <div className='right'>
              <div className='box'>
                <span>User Image</span>
                {imageInfo.src && (
                  <Image
                    src={imageInfo.src}
                    alt='img'
                    width={80}
                    height={80}
                    blur='true'
                    loading='lazy'
                  />
                )}
              </div>
            </div>
          )}
        </div>
        {!formValidate && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button disabled={formSubmitted} type='submit'>
          {formSubmitted
            ? 'Loading'
            : singleUser && admin
            ? 'Update'
            : 'Submit'}
        </button>

        {singleUser && !admin && (
          <Link style={{ color: 'blue' }} href={'/dashboard/users'}>
            Back to users table
          </Link>
        )}
      </form>
    </div>
  )
}

export default AddNewUser

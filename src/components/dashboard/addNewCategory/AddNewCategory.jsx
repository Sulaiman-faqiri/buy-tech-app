'use client'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import './AddNewCategory.scss'
const AddNewCategory = () => {
  const router = useRouter()
  const [categoryInfo, setCategoryInfo] = useState({
    name: '',
    description: '',
  })
  const [validationErr, setValidationErr] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const handleInputs = (e) => {
    const { name, value } = e.target
    setCategoryInfo((p) => {
      return {
        ...p,
        [name]: value,
      }
    })
  }

  const handleSubmit = async () => {
    if (!categoryInfo.name.trim()) {
      setValidationErr(true)
      return
    }
    setFormSubmitted(true)
    try {
      await axios.post(`http://localhost:3000/api/categories`, categoryInfo)
      router.push('/dashboard/categories')
      router.refresh('/dashboard/categories')
      toast.success('Category is added successfully')
    } catch (error) {
      if (error) {
        setFormSubmitted(false)
        console.error('Error sending data to backend:', error)
        toast.error(error.response.data.message)
      }
    }
  }
  return (
    <div className='addNewCategory'>
      <h2>Add New Category</h2>
      <div className='wrapper'>
        <div className='inputBox'>
          <label htmlFor='name'>Category Name</label>
          <input
            placeholder='Enter Category name...'
            id='name'
            type='text'
            name='name'
            value={categoryInfo.name}
            onChange={handleInputs}
          />
        </div>
        {validationErr && (
          <p style={{ color: '#ff6347' }}>Category name is required</p>
        )}
        <div className='inputBox'>
          <label htmlFor='description'>Description</label>
          <textarea
            placeholder='Enter Description about category...'
            cols={5}
            rows={5}
            name='description'
            id='description'
            value={categoryInfo.description}
            onChange={handleInputs}
          ></textarea>
        </div>
        <button disabled={formSubmitted} onClick={handleSubmit}>
          {formSubmitted ? 'Loading' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default AddNewCategory

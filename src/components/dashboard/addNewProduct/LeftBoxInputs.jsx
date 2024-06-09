function LeftBoxInputs({
  setFormData,
  formData,
  error,
  formSubmitted,
  editMode,
  categories,
}) {
  const today = new Date().toISOString().split('T')[0]
  const maxDiscountDate = new Date()
  maxDiscountDate.setFullYear(new Date().getFullYear() + 1)
  const maxDiscountDateStr = maxDiscountDate.toISOString().split('T')[0]
  return (
    <div className='left'>
      <div className='box'>
        <div className='inputBox'>
          <label htmlFor='productName'>Product Name</label>
          <input
            placeholder='Enter product name...'
            id='productName'
            type='text'
            name='productName'
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
          />
        </div>
        <div className='inputBox'>
          <label htmlFor='curPrice'>Current Price</label>
          <input
            placeholder='Enter current price...'
            id='curPrice'
            type='number'
            name='curPrice'
            value={formData.curPrice}
            onChange={(e) =>
              setFormData({ ...formData, curPrice: +e.target.value })
            }
          />
        </div>
        <div className='inputBox'>
          <label htmlFor='prvPrice'>Previous Price</label>
          <input
            placeholder='Enter previous price optional...'
            id='prvPrice'
            type='number'
            name='prvPrice'
            value={formData.prvPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                prvPrice: e.target.value ? +e.target.value : null,
              })
            }
          />
        </div>
      </div>
      <div className='box'>
        <div className='inputBox'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            name='description'
            placeholder='Enter description...'
            cols='30'
            rows='5'
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </div>
        <div className='selectBox'>
          <label htmlFor='category'>Category</label>
          <select
            name='category'
            id='category'
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='' hidden>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className='inputBox'>
          <label htmlFor='stockQuantity'>Stock Quantity</label>
          <input
            placeholder='Enter stock quantity...'
            id='stockQuantity'
            type='number'
            name='stockQuantity'
            value={formData.stockQuantity}
            onChange={(e) =>
              setFormData({ ...formData, stockQuantity: +e.target.value })
            }
          />
        </div>
      </div>
      <div className='checkBoxWrapper'>
        <div className='checkBox'>
          <label htmlFor='isNewArrival'>Is New Arrival</label>
          <input
            type='checkbox'
            id='isNewArrival'
            name='isNewArrival'
            checked={formData.isNewArrival}
            onChange={(e) =>
              setFormData({ ...formData, isNewArrival: e.target.checked })
            }
          />
        </div>
        <div className='checkBox'>
          <label htmlFor='isDiscounted'>Is Discounted</label>
          <input
            type='checkbox'
            id='isDiscounted'
            name='isDiscounted'
            checked={formData.isDiscounted}
            onChange={(e) =>
              setFormData({ ...formData, isDiscounted: e.target.checked })
            }
          />
        </div>
      </div>
      <div className='box'>
        {formData.isDiscounted && (
          <>
            <div className='inputBox'>
              <label htmlFor='discountPercentage'>Discount Percentage</label>
              <input
                placeholder='Enter discount percentage...'
                id='discountPercentage'
                type='number'
                name='discountPercentage'
                value={formData.discountPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPercentage: +e.target.value,
                  })
                }
              />
            </div>
            <div className='inputBox'>
              <label htmlFor='discountStartDate'>Discount Start Date</label>
              <input
                id='discountStartDate'
                type='date'
                name='discountStartDate'
                value={formData.discountStartDate || ''}
                min={today}
                max={maxDiscountDateStr}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountStartDate: e.target.value,
                  })
                }
              />
            </div>
            <div className='inputBox'>
              <label htmlFor='discountEndDate'>Discount End Date</label>
              <input
                id='discountEndDate'
                type='date'
                name='discountEndDate'
                value={formData.discountEndDate || ''}
                min={today}
                max={maxDiscountDateStr}
                onChange={(e) =>
                  setFormData({ ...formData, discountEndDate: e.target.value })
                }
              />
            </div>
          </>
        )}
      </div>
      {error && <p>{error}</p>}
      <button disabled={formSubmitted} type='submit'>
        {formSubmitted ? 'Loading' : ` ${editMode ? 'Update' : 'Submit'}`}
      </button>
    </div>
  )
}

export default LeftBoxInputs

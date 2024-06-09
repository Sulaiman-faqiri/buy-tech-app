import Image from 'next/image'
import { ProgressBar } from './ProgressBar'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

function RightBoxImages({
  handleImages,
  images,
  imgError,
  inputRefs,
  uploadProgress,
  editMode,
  removeImage,
}) {
  return (
    <div className='right'>
      <div className='wrapper'>
        {images.map((image, index) => {
          return (
            <div key={index} className='box'>
              <span>{`Image ${index + 1}`}</span>
              <CloudUploadIcon
                onClick={() => inputRefs.current[index]?.click()}
              />
              <input
                onChange={(e) => handleImages(index, e)}
                accept='image/*'
                type='file'
                hidden
                ref={(el) => (inputRefs.current[index] = el)}
              />
              {image.src && (
                <>
                  <Image src={image.src} alt='img' width={80} height={80} />
                  {uploadProgress && uploadProgress[index] > 0 && (
                    <ProgressBar value={+uploadProgress[index].toFixed(2)} />
                  )}
                  <span>{image.name + ' ' + image.size}</span>
                  {editMode && (
                    <DeleteOutlineIcon
                      onClick={() => removeImage(index)}
                      style={{ color: '#991b1b' }}
                    />
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
      {imgError && <p>{imgError}</p>}
    </div>
  )
}
export default RightBoxImages

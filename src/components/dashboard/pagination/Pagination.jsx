'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import './Pagination.scss'
const Pagination = ({ ITEM_PER_PAGE, count }) => {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const params = new URLSearchParams(searchParams)
  const { replace } = useRouter()
  const page = searchParams.get('page') || 1

  const hasPrev = ITEM_PER_PAGE * (parseInt(page) - 1) > 0
  const hasNext = ITEM_PER_PAGE * (parseInt(page) - 1) + ITEM_PER_PAGE < count
  const handleChangePage = (type) => {
    type === 'prev'
      ? params.set('page', parseInt(page) - 1)
      : params.set('page', parseInt(page) + 1)
    replace(`${pathName}?${params}`)
  }
  return (
    <div className='paginationBox'>
      <button disabled={!hasPrev} onClick={() => handleChangePage('prev')}>
        Previous
      </button>
      <button disabled={!hasNext} onClick={() => handleChangePage('next')}>
        Next
      </button>
    </div>
  )
}

export default Pagination

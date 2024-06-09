import { Box, CircularProgress } from '@mui/material'

export function ProgressBar(props) {
  return (
    <div className='progressBar'>
      <CircularProgress
        size={'60px'}
        color='secondary'
        variant='determinate'
        {...props}
      />
      <div
        style={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>{`${Math.round(props.value)}%`}</div>
      </div>
    </div>
  )
}

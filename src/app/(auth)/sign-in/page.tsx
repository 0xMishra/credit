import SignIn from '@/components/SignIn'
import React from 'react'

const page = () => {
  return (
    <div className='absolute inset-0 '>
      <div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
        <SignIn />
      </div>
    </div>
  )
}

export default page

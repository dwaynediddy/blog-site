import Image from 'next/image'
import React from 'react'
import Barney from './barney.avif'

function Banner() {
  return (
    <div className='flex justify-between items-center bg-teal-400 border-y border-white py-10 lg:py-0'>
        <div className="px-10 space-y-5">
            <h1 className='text-6xl max-w-xl font-serif'>
                <span className='underline decoration-white decoration-4'>
                    Diddys
                </span>
                {" "}
                Blogs are going to be Legen, wait for it... dary! LEGENDARY
             </h1>
            <h2>Inspired by Barney The Barnicle Stinsons blogs from HIMYM</h2>
        </div>
        <div className='hidden md:inline-flex h-32 lg:h-full'>
            <Image src={Barney} height={500} width={500} alt='' />
        </div>
    </div>
  )
}

export default Banner
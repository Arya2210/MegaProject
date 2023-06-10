import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import Instructor from "../../../assets/Images/Instructor.png"
import CTAButton from './Button'
import HighlightText from './HighlightText'

function InstructorSection() {
  return (
    <div className='mt-16' >
        <div className=' flex flex-row gap-20 items-center'>

            {/* left image */}
            <div className='w-[50%]'>

              <img
              src={Instructor} 
              className='shadow-white'
              />

            </div>
            {/* right section */}
            <div className='w-[50%] flex flex-col gap-10' >

                <div className='text-4xl font-semibold text-white w-[50%] '>
                    Become an
                    <HighlightText text={"Instructor"}/>
                </div>
                <p className='text-richblack-300 font-med text-[16px] w-[80%]'>
                Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>
                 

                 <div className='w-fit'>

                     
                <CTAButton active={true} linkto={"/login"} >
                    <div className='flex flex-row gap-2 items-center'>Start teaching today
                    <FaArrowRight/>
                    </div>
                </CTAButton>

                 </div>

            </div>

        </div>
    </div>
  )
}

export default InstructorSection
import React from 'react'
import HighlightText from './HighlightText'
import Compare_with_others from "../../../assets/Images/Compare_with_others.png"
import Know_your_progress from "../../../assets/Images/Know_your_progress.png"
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from './Button'

function LearnlanguageSection() {
  return (
  <div className='mt-[150px]'>

    <div className='flex flex-col gap-5 items-center '>

        {/* heading and highlighted*/}

        <div className='text-4xl font-semibold text-center' >
            Your swiss knife for
            <HighlightText text={"learning any language"}/>
        </div>

        <div className='font-med text-richblack-600 text-center mx-auto w-[70%]' >
        Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        {/* 3 dabbe */}

        <div className='flex flex-row items-center justify-center mt-5'>

            <img src={Know_your_progress }
                 alt="Know_your_progress"
                 className="object-contain -mr-32"
            />
            <img src={Compare_with_others}
                 alt="Compare_with_others"
                 className="object-contain"
            />
            <img src={Plan_your_lessons}
                 alt="Plan_your_lessons"
                 className="object-contain -ml-32"
            />
            

        </div>

       <div className='w-fit mb-5 ' >
       <CTAButton active={true} linkto={"/login"} >
           <div>
               
        learn More
        </div>
        </CTAButton>
       </div>
        
    </div>
  </div>    
  )
}

export default LearnlanguageSection
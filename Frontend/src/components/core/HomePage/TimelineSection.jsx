import React from 'react'

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

const timeline = [
  {

    LOGO: Logo1,
    heading: "Leadership",
    description: "full committed to the succes company"

  },
  {

    LOGO: Logo2,
    heading: "Leadership",
    description: "full committed to the succes company"

  },
  {

    LOGO: Logo3,
    heading: "Leadership",
    description: "full committed to the succes company"

  },
  {

    LOGO : Logo4 ,
    heading : "Leadership" ,
    description : "full committed to the succes company"

  },
]

function TimelineSection() {
  return (
    <div>
      <div className='flex flex-row gap-14 items-center' >
        {/* left  */}
        <div className='w-[45%] flex flex-col gap-5' >
          {
            timeline.map((element, index) => {
              return (
                <div className='flex flex-row gap-6 ' key={index}>
                  {/* logo */}
                  <div className='w-[50px] h-[50px] bg-white flex items-center' >
                    <img src={element.LOGO} />
                  </div>
                  {/* heading */}

                  <div>
                    <h2 className='font-semibold text-[18px]' >{element.heading}</h2>
                    <p className='text-base ' >{element.description}</p>
                  </div>

                </div>
              )
            })
          }
        </div>
        {/* right */}
        <div className='relative shadow-blue-200 ' >

          <img src={timelineImage} alt='timelineimg' className='shadow-white h-fit' />

          {/* green scetion */}

          <div className='absolute w-[80%] bg-caribbeangreen-700 flex flex-row text-white gap-1 uppercase py-10
           left-[-50%] -translate-x-[-74%] translate-y-[-50%]'>
           {/* left */}
             <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7 ' >

               <p className='text-3xl font-bold' >10</p>
               <p className='text-caribbeangreen-300 text-sm '>Years of experience</p>

             </div>
             {/* right */}

             <div className='flex flex-row gap-5 items-center border-l border-caribbeangreen-300 px-7' >

               <p className='text-3xl font-bold'> 250 </p>
               <p className='text-caribbeangreen-300 text-sm>type of course' >Types of Course</p>

             </div>

          </div>
          
        </div>
      </div>
    </div>
  )
}

export default TimelineSection
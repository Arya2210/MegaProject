import React from 'react'
import Button from './Button'

function CourseCard({cardData , currentCard ,setCurrentCard}) {
  return (
    <div className='flex flex-col'>
       <div>
           <h2>{cardData.heading}</h2>
       </div>
       <div>
           <p>{cardData.description}</p>
       </div>
       <div className='flex flex-row gap-9'>
           <div>{cardData.level}</div>          
           <div>{cardData.lessionNumber}{" Lessons"}</div>          
       </div>
    </div>
  )
}

export default CourseCard
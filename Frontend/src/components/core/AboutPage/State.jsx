import React from 'react'

const Stats = [
     {count : "5k" , label : "Active-Status"},
     {count : "10+" , label : "Mentors"},
     {count : "200+" , label : "Courses"},
     {count : "50+" , label : "Awards"},
];

function State() {
  return (
        <section>
            <div>
                <div className='flex gap-5'>
                    {
                        Stats.map( (data , index)=>{
                            return (
                                <div key={index}>
                                    <h1>{data.count}</h1>
                                    <h2>{data.label}</h2>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
  )
}

export default State
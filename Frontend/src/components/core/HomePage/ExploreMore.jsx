import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabName = [
  "free",
  "New to coding",
  "Most popular",
  "Skill paths",
  "Career paths",
];

function ExploreMore() {
  const [currentTab, setCurrentTab] = useState(tabName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses[0]);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div>
      <div className="text-4xl font-semibold text-center" >
          Unlock the
          <HighlightText text={"Power Of code"}/>
      </div>
      <div>
          <p className="text-center  text-richblack-400 border-richblack-100 text-lg font-semibold mt-8 px-1 py-1">
           Learn To Build Anything You Imagine
          </p>
      </div>
      {/* tab */}
      
      <div className="flex flex-row rounded-full bg-richblack-700 mb-5 mt-5 w-fit" >
          {
              tabName.map( (element , index)=>{
                  return (
                      <div className={`text-[16px] flex flex-row items-center gap-2 
                             ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium" 
                             : "text-richblack-200 "} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2 mx-1 my-1
                      `} key={index} 
                      onClick={()=>setMyCards(element)}
                      >
                          {
                              element
                          }
                      </div>
                  )
              })
          }
      </div>

      <div className="lg:h-[150px] "></div>

      {/* CArd Section */}
       
       <div >
           {
               courses.map( (element , index)=>{
                   return (
                       <div >
                       <CourseCard
                       key={index}
                       cardData = {element}
                       currentCard = {currentCard} 
                       setCurrentCard = {setCurrentCard}
                       />
                       </div>
                   )
               })
           }
       </div>

    </div>
  );
}

export default ExploreMore;

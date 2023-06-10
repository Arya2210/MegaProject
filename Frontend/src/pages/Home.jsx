import React from "react";

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearnlanguageSection from "../components/core/HomePage/LearnlanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Navbar from "../components/common/Navbar";

function Home() {
  return (
    <div>
     
      {/* Section 1 */}

      <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
        {/* signup button */}
        <Link to={"/signup"}>
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit ">
            <div className=" flex  flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900 ">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="text-centre text-4xl font-semibold mt-7">
          Empower your future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className="w-[90%] mt-4  text-center text-lg text-richblack-300 ">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* video */}

        <div className="mx-3 my-12  shadow-blue-200 ">
          <video muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* code section */}

        <div>
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock your
                <HighlightText text={"coding potential"} />
                with our online courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "try is YourSelf",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>
             <html lang="en">
             <head>
                 <meta charset="UTF-8">
                 <meta http-equiv="X-UA-Compatible" content="IE=edge">
                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                 <title>Document</title>
             </head>
             <body>
                 
             </body>
             </html>`}
            codeColor={"text-yellow-25"}
          />
        </div>

        {/* code section 2 */}

        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold flex flex-col">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>
             <html lang="en">
             <head>
                 <meta charset="UTF-8">
                 <meta http-equiv="X-UA-Compatible" content="IE=edge">
                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                 <title>Document</title>
             </head>
             <body>
                 
             </body>
             </html>`}
            codeColor={"text-yellow-25"}
          />
        </div>
      <ExploreMore/>
      </div>


      {/* Section 2 */}

      <div className="bg-pure-greys-5  text-richblack-700">
        <div className="homepage-bg h-[310px]">
          <div className="w-[11/12] max-w-maxContent flex flex-col justify-between items-center gap-5 mx-auto ">
            <div className="h-[150px] "></div>

            <div className="flex flex-row gap-7 mt-8 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex gap-3 items-center">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>

              <CTAButton active={false} linkto={"/login"}>
                <div className="flex gap-3 items-center">
                  learn More
                  <FaArrowRight />
                </div>
              </CTAButton>
            </div>
          </div>
        </div>

        {/* plain white part */}

        <div className="w-11/12  flex flex-col gap-7 max-w-maxContent items-center justify-between mx-auto">
          <div className="flex flex-row gap-5 mb-8 mt[95px]">
            {/* left part */}
            <div className="text-4xl font-semibold w-[45%]">
              Get the Skill you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            {/* right part */}

            <div className="flex flex-col gap-10 w-[40%] items-start ">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>

              <CTAButton active={true} linkto={"/signup"}>
                <div>learn more</div>
              </CTAButton>
            </div>
          </div>


        <TimelineSection/>
        <LearnlanguageSection/>
        </div>
      </div>

      {/* Section 3 */}

      <div className="w-11/12  mx-auto max-w-maxContent flex flex-col">


        <InstructorSection/>
        <h2>review from other learner</h2>

      </div>

      {/* Section 4 */}
      <div className="mt-8">
        <Footer/>
      </div>
    </div>
  );
}

export default Home;

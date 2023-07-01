import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import GetAvgRating from '../utils/avgRating';
import  Error  from './Error';
import ConfirmationModal from '../components/common/ConfirmationModal';
import RatingStars from '../components/common/RatingStars';
const CourseDetails = () => {
   // const navigate = useNavigate();
    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {courseId}  = useParams();
    const {loading}=useSelector((state)=>state.profile)
    const {paymentLoading}=useSelector((state)=>state.course);

    const [courseData,setCourseData]=useState(null);
    const [confirmationModal,setConfirmationModal]=useState(null);

    useEffect(()=>{
        const getCourseFullDetails=async ()=>{
            try{
              const result=await fetchCourseDetails(courseId);
              setCourseData(result);
              console.log("printing course details",result)
            }
            catch(err){
                  console.log("Could not fetch courses details");
            }
        }
         getCourseFullDetails();
    },[courseId]);



    const [avgReviewCount,setAvgReviewCount]=useState(0);
    useEffect(()=>{
          const count=GetAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
          setAvgReviewCount(count);
    },[courseData])


     const [totalNoOfLectures,setTotalNoOfLectures]=useState(0);
     useEffect(()=>{
        let lectures=0;
        courseData?.data?.courseDetails?.courseContent?.forEach((sec)=>{
            lectures += sec.subSection.length || 0;
        })

        setTotalNoOfLectures(lectures);

     },[courseData])






    const handleBuyCourse = () => {
        
        if(token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
            return;
        }

        // koi vyakti jo login nhi hai wo buy karne ki kosis kr rha hai
        setConfirmationModal({
            text1:"You are not Logged in",
            text2:"Please Login",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null)


        })

    }


    if(loading || !courseData){
        return (
            <div>
                Loading...
            </div>
        )
    }

    if(!courseData.success){
        return (
            <div>
                <Error/>
            </div>
        )
    }

    const {
        _id:course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt
    }=courseData?.data?.courseDetails

 

  return (
    <div className='flex flex-col items-center text-white'>
    <p>{courseName}</p>
    <p>{courseDescription}</p>
    <div>
    <span>{avgReviewCount}</span>
    <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
    <span>{`(${ ratingAndReviews.length} reviews)`}</span>
    <span>{`(${studentsEnrolled.length} students enrolled)`}</span>
  

    </div>
        



        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/> }
    </div>
  )
}

export default CourseDetails


















// import React, { useEffect ,useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { buyCourse } from '../services/operations/studentFeaturesAPI';
// import {fetchCourseDetails} from "../services/operations/courseDetailsAPI"
// import GetAvgRating from '../utils/avgRating';
// import Error from './Error';
// import ConfirmationModal from '../components/common/ConfirmationModal';
// import RatingStars from '../components/common/RatingStars';


// const CourseDetails = () => {

   
    
//     const {user} = useSelector((state)=>state.profile);
//     const {token} = useSelector((state)=>state.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const {courseId}  = useParams();
//     const {loading} = useSelector( (state)=>state.profile) ;
//     const {paymentLoading} = useSelector((state)=>state.course) ;

//     const [courseData , setCourseData] = useState(null) ;
//     const [confirmationModal , setConfirmationModal] = useState(null) ;

//     useEffect( ()=>{
//         const getCourseFullDetails  = async ()=>{
//             try{
//                 const result  = await fetchCourseDetails(courseId) ;
//                 console.log("ye h result" , result)
//                 setCourseData(result)
//             }catch(err){
//                 console.log("could not fetch course details")
               
    
//             }
//         }

//         getCourseFullDetails() ;
//     },[courseId]) ;

//     const [avgReviewCount , setAvgReviewCount] = useState(0) ;
//     useEffect( ()=>{
//         const count = GetAvgRating(courseData?.data?.courseDetails?.ratingAndReviews) ;
//         setAvgReviewCount(count) ;
//     } ,[courseData])
// // galti
//     const [totalNoLectures , setTotalNoLectures] = useState(0) ;
//     useEffect( ()=>{
//         let lectures = 0 ;
//         courseData?.data?.courseDetails?.courseContent?.forEach( (sec)=>{
//             lectures += sec.subSection.length || 0 ;
//         })
//     })

//     const handleBuyCourse = () => {
        
//         if(token) {

//             buyCourse(token, [courseId], user, navigate, dispatch);
//             return;
//         }
//         setConfirmationModal({
//             text1 : "You are Not logged in" ,
//             text2 : "Please login" ,
//             btn1Text :"login" ,
//             btn2Text : "Cancel" ,
//             btnHandler : ()=>navigate("/login") ,
//             btn2Handler : ()=>setConfirmationModal(null) ,
//         })
//     }

//     // if(!loading || !paymentLoading){
//     //     return (
//     //         <div>
//     //             loading,,,,
//     //         </div>
//     //     )
//     // }


//     // if(!courseData.success){
//     //     return (
//     //         <div>
//     //             <Error/>
//     //         </div>
//     //     )
//     // }

//     const {
//         _id:course_id, 
//         courseName ,
//         courseDescription ,
//         thumbnail ,
//         price ,
//         whatYouWillLearn ,
//         courseContent ,
//         ratingAndReviews ,
//         instructor ,
//         studentEnrolled ,
//         createdAt ,
//     } = courseData?.data?.courseDetails ;


//   return (
//     <div className='flex  flex-col items-center'>

//         <p>{courseName}</p>
//         <p>{courseDescription}</p>
//         <div>
//             <span>{avgReviewCount} </span>
//             <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
//             <span >{`$({ratingAndReviews.length} reviews)`}</span>
//             <span >{`$({studentsEnrolled.length} students enrolled)`}</span>
//         </div>







//         <button className='bg-yellow-50 p-6 mt-10 '
//         onClick={handleBuyCourse}>
//             Buy Now
//         </button>

//         confirmationModal && <ConfirmationModal modalData={confirmationModal} />
//     </div>
//   )
// }

// export default CourseDetails

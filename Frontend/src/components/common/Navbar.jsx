import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, matchPath , useLocation} from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import {NavbarLinks} from "../../data/navbar-links"

import {AiOutlineShoppingCart} from "react-icons/ai"
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import {IoIosArrowDropdownCircle} from "react-icons/io"


function Navbar() {

    const {token} = useSelector( (state)=>state.auth) ;
    const {user} = useSelector((state)=>state.profile) ;
    const {totalItems} = useSelector( (state)=>state.cart) ;

    const subLinks = [
        {
            title : "python" ,
            link : "/catalog/python" ,
        },
        {
            title : "web dev" ,
            link : "/catalog/web-development"
        }
    ]



    // const [subLinks , setSubLinks] = useState([]) ;

    
    // const fetchSublinks =     async()=>{
    //         try{

    //             const result =await apiConnector( "GET" , categories.CATEGORIES_API) ;
    //             console.log(result)
    //             setSubLinks(result.data.data) ;

    //         }catch(err){
    //             console.log("could not fetched the category list=>" + err.message)
    //         }
    //     }

    //     useEffect( ()=>{
    //         fetchSublinks() ;
    //     },[]) 


    const location = useLocation() ;

    const matchRoute=(route)=>{
        return matchPath({path:route} , location.pathname) ;
    }
  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-richblack-700 ">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img src={logo} width={160} height={42} loading="lazy" />
        </Link>

        {/* navlinks */}

        <nav>
            <ul className="flex gap-x-6 text-richblack-25" >
                {
                    NavbarLinks.map( (link , index)=>(
                        <li key={index}>
                            {
                                link.title === "Catalog" ? (
                                    <div className="relative flex items-center gap-2 group">
                                        <p>{link.title}</p>
                                        <IoIosArrowDropdownCircle/>

                                        <div className="invisible absolute translate-x-[-50%] translate-y-[50%] left-[50%] top-[50%] flex flex-col rounded-md bg-richblack-5 text-richblack-900 opacity-0
                                        transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] p-4 ">

                                            <div className="absolute left-[50%] top-0 translate-x-[80%] translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblue-5  " >

                                            </div>

                                            {
                                                subLinks.length? (
                                                    subLinks.map((subLink , index)=>(
                                                        <Link to={`${subLink.link}`}  key={index}>
                                                            <p>{subLink.title}</p>
                                                        </Link>
                                                    ))
                                                ) : (<div>kwjelw</div>) 
                                            }

                                        </div>


                                    </div>
                                )
                                : (
                                    <Link to={link?.path} >
                                    <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-white" }`} >{link.title}</p>
                                    </Link>
                                )
                            }
                        </li>
                    ))
                }
            </ul>
        </nav>
        {/* login signup */}

        <div className="flex flex-row items-center gap-x-4">

            {
                user && user?.accountType != "Instructor" && (
                    <Link to="/dashboard/cart" className="relative" >
                        <AiOutlineShoppingCart/>
                        {
                            totalItems > 0 && (
                                <spam>
                                    {totalItems}
                                </spam>
                            )
                        }
                    
                    </Link>
                )
            }
            {

                token === null && (
                    <Link to="/login">

                        {
                            <button className="border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md" >
                                Log in
                            </button>
                        }
                    
                    </Link>
                )
               

            }
            {
                 token === null && (
                    <Link to="/signup">

                        {
                            <button className="border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md" >
                                sign up
                            </button>
                        }
                    
                    </Link>
                )
            }
            {
                token !== null && (
                    <ProfileDropDown/>
                )
            }

        </div>

      </div>
    </div>
  );
}

export default Navbar;

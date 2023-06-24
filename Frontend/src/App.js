import "./App.css";
import {Route, Routes } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/Dashboard/MyProfile";  
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "../src/pages/Error"
import Settings from "./components/core/Dashboard/Settings/Index";
import  EnrolledCourses  from "./components/core/Dashboard/EnrolledCourses";

import Cart from "./components/core/Dashboard/Cart" ;
import { ACCOUNT_TYPE } from "./utils/constants"
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";

function App() {
  const { user } = useSelector ((state) => state.profile)
  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="*" element={<Error/>}></Route>
      <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
         path="forgot-password"
         element={
           <OpenRoute>
             <ForgotPassword/>
           </OpenRoute>
         }
        ></Route>
        <Route
         path="update-password/:id"
         element={
           <OpenRoute>
             <UpdatePassword/>
           </OpenRoute>
         }
        ></Route>

        <Route
         path="verify-email"
         element={
           <OpenRoute>
             <VerifyEmail/>
           </OpenRoute>
         }
        ></Route>

        <Route
         path="about"
         element={
           <OpenRoute>
             <About/>
           </OpenRoute>
         }
        ></Route>

        <Route
         path="/contact"
         element={
           
             <Contact/>
           
         }
        ></Route> 


        <Route element={
          <PrivateRoute >
            <Dashboard/>
          </PrivateRoute>
        } >
        <Route  path="/dashboard/my-profile"element={<MyProfile/>}></Route>
        <Route path="/dashboard/settings" element={ <Settings/>  }></Route>
        <Route path="/dashboard/enrolled-courses" element={ <EnrolledCourses/>  }></Route>
        {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
      }
       {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          <Route path="dashboard/add-course" element={<AddCourse />} />
          
          </>
        )
      }

        </Route>

        
         

    </Routes>

   </div>
  );
}

export default App;

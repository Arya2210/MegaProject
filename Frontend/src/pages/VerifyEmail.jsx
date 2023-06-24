import React, {  useState , useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OTPInput from "react-otp-input"
import {signUp ,sendOtp} from "../services/operations/authAPI"
import {Link, useNavigate } from "react-router-dom"

function VerifyEmail() {
    const {loading ,signupData } = useSelector( (state)=>state.auth)
    const [otp , setOtp] = useState("") ;
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect( ()=>{
        if(!signupData){
            navigate("/signup") ;
        }
    },[])

    const handleOnSubmit = (e)=>{
        e.preventDefault() ;

        const{
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            
            

        } = signupData
        dispatch(signUp( accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,navigate ))

    }
  return (
    <div className='text-white'>
        {
            loading ? (
                <div>Loading...</div>
            ) :(
                <div>
                    <h1>Verify Email</h1>
                    <p>A verification code has been sent to you. Enter the code below</p>
                    <form onSubmit={handleOnSubmit}>
                      <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderInput={(props) => (<input {...props} />)}
                      renderSeparator={<span>-</span>}
                      />
                      <button type='submit'>Verify Email</button>
                    </form>

                    <div>
                        <div>
                            <Link to="/login">
                                <p>Back to login</p>
                            </Link>
                        </div>
                        <div>
                              <button
                               onClick={()=>dispatch(sendOtp(signupData.email ,navigate))}
                             > Resend it</button>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail
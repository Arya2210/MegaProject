import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiconnector";
import {contactusEndpoint} from "../../../src/services/apis"
import CountryCode from "../../data/countrycode.json"

function ContactUsForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccesful },
  } = useForm();

  const submitContactform = async (data) => {
    console.log("logging " ,data) ;
    try{

      setLoading(true) ;
      // const response = await apiConnector ("POST" ,contactusEndpoint.CONTACT_US_API , data) ;
      const response = {status : "OK"}
      console.log("logging response" , response) ;

      setLoading(false) ;

    }catch(err){

      console.log("eror" , err.message) ;
      setLoading(false) ;

    }
  };

  useEffect(() => {
    if (isSubmitSuccesful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccesful]);
  return (
    <form onSubmit={handleSubmit(submitContactform)}>
      <div className="flex flex-col gap-14">
        <div className="flex gap-5">
          {/* firstName */}
          <div className="flex flex-col ">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              className="text-black"
              placeholder="Enter First Name"
              {...register("firstname", { required: true })}
            />
            {/* handle error */}
            {errors.firstname && <span>Please Enter your name</span>}
          </div>
          {/* lastNAme */}
          <div className="flex flex-col ">
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              className="text-black"

              placeholder="Enter last Name"
              {...register("lastname")}
            />
            {/* handle error */}
            {errors.lastname && <span>Please Enter your name</span>}
          </div>
        </div>
        {/* email */}
        <div className="flex flex-col">
          <label htmlFor="email">Email Address de</label>
          <input
            type="email"
            name="email"
            id="email"
            className="text-black"

            placeholder="Enter Email Address "
            {...register("email", { required: true })}
          />
          {/* error handle */}
          {errors.email && <span>Please enter your email Address</span>}
        </div>
        {/* phone No */}
        <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="lable-style">
          Phone Number
        </label>

        <div className="flex gap-5">
          <div className="flex w-[81px] flex-col gap-2">
            <select
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter first name"
              className="form-style text-black"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((ele, i) => {
                return (
                  <option key={i} value={ele.code}>
                    {ele.code} -{ele.country}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              className="form-style text-black"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number.",
                },
                maxLength: { value: 12, message: "Invalid Phone Number" },
                minLength: { value: 10, message: "Invalid Phone Number" },
              })}
            />
          </div>
        </div>
        {errors.phoneNo && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {errors.phoneNo.message}
          </span>
        )}
      </div>
        {/* message box */}
        <div className="flex flex-col">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            className="text-black"

            cols="30"
            rows="7"
            placeholder="Enter your message here"
            {...register("message", { required: true })}
          />
          {errors.message && <span>Please enter your message</span>}
        </div>

        <button type="submit"
        className="rounded-md bg-yellow-50 text-black font-bold px-6 text-[15px] "
        >Send Message</button>
      </div>
    </form>
  );
}

export default ContactUsForm;

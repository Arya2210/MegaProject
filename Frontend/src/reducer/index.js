import {combineReducers, createReducer} from "@reduxjs/toolkit"
import authReducer from "../slices/authSlice"
import cartReducer from "../slices/cartSlice"
import courseReducer from "../slices/courseSlice"
import profileReducer from "../slices/profileSlice"

const rootReducer = combineReducers({
    auth : authReducer ,
    profile : profileReducer ,
    cart : cartReducer ,
    course :courseReducer ,
})

export default rootReducer ;
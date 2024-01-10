import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName:{ // First name defined properties
        type : 'string',
        required: true,
        min : 2,
        max : 50,
    },
    lastName:{ // Last name defined properties
        type : 'string',
        required: true,
        min : 2,
        max : 50,
    },
    email:{ // email defined properties
        type : 'string',
        required: true,
        max : 50,
        unique : true,
    },
    password:{ // email defined properties
        type : 'string',
        required: true,
        min : 5,
    },
    picturePath:{ // picture defined properties
        type : 'string',
        default : " ",
    },
    friends:{ // picture defined properties
        type : 'array',
        default : [],
    },
    location : String, 
    occupation : String,
    viewedProfile : Number,
    impressions : Number,

}, {timestamps: true})

const User = mongoose.model("User", UserSchema);
export default User;
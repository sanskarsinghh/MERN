import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";

/* REGISTER USER */
// This function handles user registration. It receives data from the frontend request.
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body; // Receiving user data from the request body.

        const salt = await bcrypt.genSalt(); // Generating a salt for password encryption.
        const passwordHash = await bcrypt.hash(password, salt); // Hashing the password using the generated salt.

        // Creating a new User instance with the received data and the hashed password.
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000), // Random value for viewedProfile.
            impressions: Math.floor(Math.random() * 10000), // Random value for impressions.
        });

        const savedUser = await newUser.save(); // Saving the new user to the database.
        res.status(201).json(savedUser); // Sending the saved user as a response with status 201 (created).

    } catch (err) {
        res.status(500).json({ error: err.message }); // If an error occurs, send the error as a response with status 500 (internal server error).
    }
};

/* LOGIN */
// This function handles user login.
export const login = async (req, res) => {
     try {
        const { email, password } = req.body; // Receiving email and password from the frontend request.
        const user = await User.findOne({ email: email }); // Finding the user in the database using the provided email.

        if (!user) return res.status(404).json({ message: 'User not found' }); // If user not found, send a response with status 404 (not found).

        const isMatch = await bcrypt.compare(password, user.password); // Comparing the provided password with the hashed password in the database.
        if (!isMatch) return res.status(404).json({ message: 'Invalid credentials' }); // If passwords don't match, send a response with status 404 (not found).

        // If the login is successful, generate a JWT token with the user's id and the secret from the environment.
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        delete user.password; // Deleting the hashed password from the user object to avoid sending it in the response.
        return res.status(200).json({ token, user }); // Sending the JWT token and the user object in the response with status 200 (OK).

     } catch (error) {
        res.status(500).json({ error: err.message }); // If an error occurs, send the error as a response with status 500 (internal server error).
     }
}

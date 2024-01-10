import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer, { diskStorage } from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./Routes/auth.js";
import {register} from "./controllers/auth.js";

/*Configurations*/

const __filename = fileURLToPath(import.meta.url);   //we can grab file url with this using module
const __dirname = path.dirname(__filename); //only used when we type modules
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit : "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit : "30mb", extended: true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname, 'public/assets')));  //set the dir of where we keep the assets

/*FILE STORAGE*/

//Got this information from the Multer github repository
const storage = multer.diskStorage({
    desintaion : function (req, file, cb) {  //Whenever someone upload some files to your website it will be automatically saved here
        cb(null, "public/assets");
    },
    filename : function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage})

/*ROUTES WITH FILES*/

app.post('/auth/register', upload.single("picture"), register); // Middleware function before uploading picture in the local storage above 

/*ROUTES*/
app.use("/auth", authRoutes); 

/*MONGOOSE SETUP*/
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(() => {
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
})
.catch((error) => console.log(`Server error: ${error}`));
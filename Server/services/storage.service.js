import { ImageKit } from "@imagekit/nodejs/client.js";
import dotenv from "dotenv";

dotenv.config();

const ImageKitClient = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY
})

const uploadFile = async (file) =>{
    const result = await ImageKitClient.files.upload({
        file ,
        fileName : "music_" + Date.now(),
        folder : "yt-complete-backend/music"
    })
    return result
}

export default uploadFile
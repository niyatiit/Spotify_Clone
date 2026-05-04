import { ImageKit } from "@imagekit/nodejs/client.js";
import dotenv from "dotenv";

dotenv.config();

const ImageKitClient = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/yt"
})

const uploadFile = async (file) => {
    try {
        const result = await ImageKitClient.files.upload({
            file,
            fileName: "music_" + Date.now(),
            folder: "yt-complete-backend/music"
        })
        return result
    } catch (error) {
        console.log("ImageKit Upload Error:", error)
        throw error
    }
}

export default uploadFile
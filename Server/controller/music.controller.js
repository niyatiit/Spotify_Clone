import albumModel from "../model/album.model.js";
import musicModel from "../model/music.model.js";
import uploadFile from "../services/storage.service.js";
import jwt from "jsonwebtoken";

const createMusic = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: req.user.id,
    });

    return res.json({
      success: true,
      message: "Music is created successfully",
      music,
    });
  } catch (error) {
    console.log("Create Model Error : ", error);
  }
};

const createAlbum = async (req, res) => {
  try {
    const { title, musics } = req.body;

    const album = await albumModel.create({
      title,
      artist: req.user.id,
      musics: musics,
    });

    return res.json({
      success: true,
      message: "Album is created successfully",
      album,
      musics,
    });
  } catch (error) {
    console.log("Create Album Error : ", error);
  }
};

const getAllMusics = async (req, res) => {
  try {
    // only 2 musics will be shown in home page and rest of the musics will be shown in music page
    const musics = await musicModel.find().limit(2).populate("artist", "username email");

    return res.json({
      success: true,
      message: "Gell All Musics ",
      musics,
    });
  } catch (error) {
    console.log("Get All Error : ", error);
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await albumModel
      .find().select("title artist")
      .populate("artist", "username email")

    return res.json({ success: true, message: "Get All Albums ", albums });
  } catch (error) {
    console.log("Get All Album Error : ", error);
  }
};

const getAlubmById = async (req, res) => {
  try{
    const { id } = req.params.albumId;

    const album = await albumModel.findById(id).populate("artist", "username email").populate("musics");

    return res.json({ success: true, message: "Get Album By Id ", album });
  }
  catch(error){
    console.log("Get Album By Id Error : ", error);
  }
}
export { createMusic, createAlbum, getAllMusics, getAllAlbums , getAlubmById };

import albumModel from "../model/album.model.js";
import musicModel from "../model/music.model.js";
import uploadFile from "../services/storage.service.js";
import jwt from "jsonwebtoken";

const createMusic = async (req, res) => {
  try {
    const { title } = req.body;
    const musicFile = req.files?.music?.[0];
    const imageFile = req.files?.image?.[0];

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Song title is required" });
    }

    if (!musicFile) {
      return res.status(400).json({ success: false, message: "Audio file is required" });
    }

    if (!musicFile.mimetype.startsWith('audio/')) {
      return res.status(400).json({ success: false, message: "Invalid audio file" });
    }

    const musicUpload = await uploadFile(musicFile.buffer.toString("base64"), {
      fileName: `music_${Date.now()}`,
      folder: "yt-complete-backend/music",
    });

    let imageUrl = null;
    if (imageFile) {
      if (!imageFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ success: false, message: "Invalid image file" });
      }

      const imageUpload = await uploadFile(imageFile.buffer.toString("base64"), {
        fileName: `song_cover_${Date.now()}`,
        folder: "yt-complete-backend/music-covers",
      });
      imageUrl = imageUpload.url;
    }

    const music = await musicModel.create({
      uri: musicUpload.url,
      image: imageUrl,
      title,
      artist: req.user.id,
    });

    return res.json({
      success: true,
      message: "Music is created successfully",
      music,
    });
  } catch (error) {
    console.log("Create Music Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload music"
    });
  }
};

const createAlbum = async (req, res) => {
  try {
    const { title, musics } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Album title is required" });
    }

    if (!musics || musics.length === 0) {
      return res.status(400).json({ success: false, message: "At least one song ID is required" });
    }

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
    console.log("Create Album Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create album"
    });
  }
};

const getAllMusics = async (req, res) => {
  try {
    const musics = await musicModel
      .find()
      .populate({
        path: "artist",
        select: "username email role",
        match: { _id: { $exists: true } }
      })
      .sort({ createdAt: -1 });

    const validMusics = musics.filter(music => music.artist !== null);

    return res.status(200).json({
      success: true,
      message: "Get All Musics",
      musics: validMusics,
    });
  } catch (error) {
    console.log("Get All Error : ", error);
    return res.status(500).json({ success: false, message: "Failed to fetch songs" });
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await albumModel
      .find()
      .populate({
        path: 'artist',
        select: 'username email role',
        match: { _id: { $exists: true } }
      })
      .populate({ path: 'musics', populate: { path: 'artist', select: 'username email role' } })
      .sort({ createdAt: -1 });

    const validAlbums = albums.filter(album => album.artist !== null);

    return res.status(200).json({ 
      success: true, 
      message: 'Get All Albums', 
      albums: validAlbums 
    });
  } catch (error) {
    console.log('Get All Album Error : ', error)
    return res.status(500).json({ success: false, message: 'Failed to fetch albums' })
  }
}

const getArtistSongs = async (req, res) => {
  try {
    const musics = await musicModel
      .find({ artist: req.user.id })
      .populate('artist', 'username email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({ 
      success: true, 
      message: 'Get Artist Songs', 
      musics 
    });
  } catch (error) {
    console.log('Get Artist Songs Error : ', error)
    return res.status(500).json({ success: false, message: 'Failed to fetch artist songs' })
  }
}

const getArtistAlbums = async (req, res) => {
  try {
    const albums = await albumModel
      .find({ artist: req.user.id })
      .populate('artist', 'username email role')
      .populate({ path: 'musics', populate: { path: 'artist', select: 'username email role' } })
      .sort({ createdAt: -1 });

    return res.status(200).json({ 
      success: true, 
      message: 'Get Artist Albums', 
      albums 
    });
  } catch (error) {
    console.log('Get Artist Albums Error : ', error)
    return res.status(500).json({ success: false, message: 'Failed to fetch artist albums' })
  }
}

const getAlubmById = async (req, res) => {
  try {
    const albumId = req.params.albumId;

    const album = await albumModel
      .findById(albumId)
      .populate("artist", "username email role")
      .populate({ path: "musics", populate: { path: "artist", select: "username email role" } });

    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    if (!album.artist) {
      return res.status(404).json({ success: false, message: "Album not available" });
    }

    album.musics = album.musics.filter(music => music.artist !== null);

    return res.status(200).json({ 
      success: true, 
      message: "Get Album By Id", 
      album 
    });
  } catch (error) {
    console.log("Get Album By Id Error : ", error);
    return res.status(500).json({ success: false, message: "Failed to fetch album" });
  }
};
export { createMusic, createAlbum, getAllMusics, getAllAlbums, getArtistSongs, getArtistAlbums, getAlubmById };

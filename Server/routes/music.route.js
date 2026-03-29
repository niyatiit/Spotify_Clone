import express from 'express'
import multer from "multer";
import { createAlbum, createMusic, getAllAlbums, getAllMusics, getAlubmById } from '../controller/music.controller.js'
import {authArtist,  authUser } from '../middleware/auth.middleware.js';

const musicRoute = express.Router()
const upload = multer({
    storage : multer.memoryStorage()
})


musicRoute.post('/upload' ,authArtist , upload.single('music'), createMusic)
musicRoute.post('/album' , authArtist, createAlbum)
musicRoute.get('/' , authUser , getAllMusics)
musicRoute.get('/album' , authUser , getAllAlbums)
musicRoute.get('/album/:albumId' , authUser , getAlubmById)



export default musicRoute
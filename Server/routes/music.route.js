import express from 'express'
import multer from 'multer'
import { createAlbum, createMusic, getAllAlbums, getAllMusics, getArtistSongs, getArtistAlbums, getAlubmById } from '../controller/music.controller.js'
import { authArtist, authUser } from '../middleware/auth.middleware.js'

const musicRoute = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
})

musicRoute.post('/upload', authArtist, upload.fields([
  { name: 'music', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]), createMusic)
musicRoute.post('/album', authArtist, createAlbum)
musicRoute.get('/', authUser, getAllMusics)
musicRoute.get('/album', authUser, getAllAlbums)
musicRoute.get('/album/:albumId', authUser, getAlubmById)
musicRoute.get('/artist/songs', authArtist, getArtistSongs)
musicRoute.get('/artist/albums', authArtist, getArtistAlbums)

export default musicRoute
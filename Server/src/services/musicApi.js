import API from './api'

export const getAllSongs = () => API.get('/music')
export const getAllAlbums = () => API.get('/music/album')
export const getAlbumById = (id) => API.get(`/music/album/${id}`)
export const uploadSong = (formData) => API.post('/music/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const uploadAlbum = (albumData) => API.post('/music/album', albumData)
export const getArtistSongs = () => API.get('/music/artist/songs')
export const getArtistAlbums = () => API.get('/music/artist/albums')

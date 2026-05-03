import API from './api'

export const deleteUser = (userId) => API.delete(`/user/${userId}`)
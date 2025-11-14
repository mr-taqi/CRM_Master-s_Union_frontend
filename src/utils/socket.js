import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null

export const initSocket = (token, userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token
      }
    })

    socket.on('connect', () => {
      console.log('Connected to server')
      if (userId) {
        socket.emit('join-room', userId)
      }
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })
  }

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}


import { io } from 'socket.io-client'
import { baseUrl } from './API/Api'

const socket = io(`${baseUrl?.slice(0, 22)}`) 

export default socket

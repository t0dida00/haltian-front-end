import io from "socket.io-client"

const socket = io("https://air-quality.azurewebsites.net/")

export default socket

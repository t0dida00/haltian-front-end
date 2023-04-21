import io from "socket.io-client"

const socket = io("https://air-quality.azurewebsites.net/")
//const socket = io("http://localhost:8080")

export default socket

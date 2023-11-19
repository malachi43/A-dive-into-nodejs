const net = require('net')
const PORT = 4000
const ip = "localhost"
let numOfUsers = 0
const connectedSockets = []


const server = net.createServer(() => { })

server.on('connection', (socket) => {
    console.log(`A new connection to the server!`)
    const clientId = connectedSockets.length + 1

    //send to the client a unique id
    socket.write(`id:${clientId}`)

    //Broadcast to everyone when a client enters the chatroom
    connectedSockets.forEach(client => {
        client.socket.write(`User ${clientId} joined!`)
    })

    //send messages to all clients
    socket.on('data', (chunk) => {
        const dataString = chunk.toString()
        const userId = dataString.slice(0, dataString.indexOf("-"))
        const message = dataString.slice(dataString.indexOf('-message-') + 9)

        connectedSockets.forEach((client) => {
            client.socket.write(`User${userId}> ${message}`)
        })


    })

    connectedSockets.push({ socket: socket, id: clientId })

    socket.on('error', (err) => {
        console.log(`Error: `, err.message)
    })

    //Broadcast to everyone when a client leaves the chatroom
    socket.on('close', () => {
        console.log(`Close event emitted`)
        connectedSockets.forEach((client) => {
            client.socket.write(`User ${clientId} left`)
        })
    })

})

server.on('error', (err) => {
    console.log(`Error: `, err.message)
})

server.listen(PORT, ip, () => {
    console.log(`Opened server on `, server.address())
})
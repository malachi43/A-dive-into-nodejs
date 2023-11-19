const dgram = require('dgram')
const host = "127.0.0.1"
const socket = dgram.createSocket('udp4')

socket.send('This is the server testing the dgram module', 3000, host, (err, bytes) => {
    if (err) console.log(`Error: ${err.name}: ${err.message}`)
    console.log(`Chunk received: ${bytes}`)
})
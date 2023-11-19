const net = require('net')

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
    socket.write(`First tcp app`)
    socket.on('error', (err) => {
        console.log(`Error: `, err.message)
    })
})
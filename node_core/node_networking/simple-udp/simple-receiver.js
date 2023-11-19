const dgram = require('dgram')
const host = "127.0.0.1"
const server = dgram.createSocket('udp4')

server.bind(3000, host, () => {
    console.log(`Connected to another server.`)
})

server.on("error", (err) => {
    console.log(`ERROR MESSAGE---> ${err.name}: ${err.message} ${err.code}`)
    server.close()
})

server.on('message', (msg, remoteInfo) => {
    console.log(`Server received this message: "${msg}" from ${remoteInfo.address}:${remoteInfo.port}`)
})

server.on('listening', () => {
    const { address, port, family } = server.address()
    console.log(`server has been successfully bound to another server.`)
    console.log(`Server info: ${address}: ${port}: ${family}`)
})

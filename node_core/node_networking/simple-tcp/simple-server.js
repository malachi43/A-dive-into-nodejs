const net = require('net')

const server = net.createServer((socket) => {
  socket.on('data', (chunk) => {
    console.log(chunk)
  })

  socket.on('error', (err) => {
    console.log(`Error: `, err.message)
  })
})

server.on('error',(err)=>{
  console.log(`Error: `, err.message)
})

server.listen(3000, "127.0.0.1", () => {
  console.log(`Server listening `, server.address())
})

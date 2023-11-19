const http = require('http')
const hostname = "127.0.0.1"
const fs = require('fs/promises')

const PORT = 3000
const server = http.createServer(async (req, res) => {

    const fileHandle = await fs.open('./../../encrypt-decrypt/encryption.js', 'r')
    const readStream = fileHandle.createReadStream()
    readStream.pipe(res)

})

server.listen(PORT, hostname, () => {
    console.log(`Server running on http://${hostname}:${PORT}`)
})
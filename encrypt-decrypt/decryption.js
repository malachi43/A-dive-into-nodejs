const { Transform, pipeline } = require('node:stream')
const fs = require('node:fs/promises')



function clearLine(direction) {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(direction, () => { resolve() })
    })
}

function moveCursor(dx, dy) {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => { resolve() })
    })
}

class Decrypt extends Transform {

    constructor(filePath) {
        super()
        this.chunkLength = 0
        this.fileSize = require('fs').statSync(filePath).size
    }
    _transform(chunk, encoding, callback) {
        this.chunkLength += chunk.length

        if (this.chunkLength !== this.fileSize) {
            console.log(`Decryption | ${Math.floor((this.chunkLength / this.fileSize).toFixed(2) * 100)}% complete.`)
            moveCursor(0, -1)
            clearLine(0)
        }

        for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] !== 255) {
                chunk[i] = chunk[i] - 1
            }
        }

        if (this.chunkLength === this.fileSize) {
            console.log(`Decryption | ${Math.floor((this.chunkLength / this.fileSize).toFixed(2) * 100)}% complete.`)
        }

        this.push(chunk)

        callback()
    }
}

(async () => {
    const decrypt = new Decrypt('./encrypt.txt')
    const readFile = await fs.open('./encrypt.txt', 'r')
    const writreFile = await fs.open('./decrypt.txt', 'w')
    const readStream = readFile.createReadStream()
    const writeStream = writreFile.createWriteStream()

    pipeline(
        readStream,
        decrypt,
        writeStream,
        (err) => {
            console.log('Done pipelining')
        }
    )
})()

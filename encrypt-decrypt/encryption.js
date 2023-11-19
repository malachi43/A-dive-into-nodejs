const { Transform, pipeline } = require('node:stream')
const fs = require('node:fs/promises')
const { Interface } = require('node:readline')

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

class Encrypt extends Transform {
    //we accepted filepath as an argument to help us calculate the file progress...
    constructor(filePath) {
        super()
        this.fileSize = require('fs').statSync(filePath).size
        this.chunkLength = 0
        this.progressCount = 0
    }
    _transform(chunk, encoding, callback) {

        this.chunkLength += chunk.length

        if (this.chunkLength !== this.fileSize) {
            console.log(`Encryption | ${Math.floor((this.chunkLength / this.fileSize).toFixed(2) * 100)}% complete.`)
            moveCursor(0, -1)
            clearLine(0)
        }


        for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] !== 255) {
                ++chunk[i]
            }
        }

        if (this.chunkLength === this.fileSize) {
            console.log(`Encryption | ${Math.floor((this.chunkLength / this.fileSize).toFixed(2) * 100)}% complete.`)
        }

        this.push(chunk)
        callback()
    }
}




(async () => {
    //NOTE: You can populate the "text-small.txt" with any custom ddta you deem fit.
    const encrypt = new Encrypt('./text-small.txt')
    const readFile = await fs.open('./text-small.txt', 'r')
    const writeFile = await fs.open('./encrypt.txt', 'w')
    const readStream = readFile.createReadStream()
    const writeStream = writeFile.createWriteStream()

    pipeline(readStream, encrypt, writeStream, (err) => {
        console.log('Done pipelining')
    })
})() 

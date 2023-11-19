const { Readable } = require('node:stream')
const fs = require('node:fs')
const { read } = require('node:fs')

class FileReadStream extends Readable {
    constructor({ filename, highWaterMark }) {
        super({ highWaterMark })
        this.filename = filename
        this.fd = null
    }

    _construct(callback) {
        fs.open(this.filename, 'r', (err, fd) => {
            if (err) return callback(err)
            this.fd = fd
            callback()
        })
    }
    _read(size) {
        const buff = Buffer.alloc(size)
        fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err)
            //push buffer to an internal buffer. If push is passed null, it indicates end of read stream
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null)
        })
    }
    _destroy(error,callback){
        if(this.fd){
            fs.close(this.fd, err => callback(err || error))
        }
        else callback(error)
    }
}

const readStream = new FileReadStream({ filename: './text.txt' })
readStream.on('data', (chunk) => {
    console.log(chunk.toString())
})

readStream.on('end', () => {
    console.log(`Read stream ended`)
})
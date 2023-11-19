const { Duplex } = require('node:stream')
const fs = require('node:fs')

class DuplexStream extends Duplex {
    constructor({ readableHighWaterMark, writableHighWaterMark, readFilename, writeFilename }) {
        super({ readableHighWaterMark, writableHighWaterMark })
        this.readFilename = readFilename
        this.writeFilename = writeFilename
        this.writefd = null
        this.readfd = null
        this.bytesArr = []
        this.bytesArrSize = 0
        this.byteSize = 0
    }

    _construct(callback) {
        fs.open(this.readFilename, 'r', (err, fd) => {
            if (err) return callback(err)
            this.readfd = fd

            fs.open(this.writeFilename, 'w', (err, fd) => {
                if (err) return callback(err)
                this.writefd = fd
                callback()
            })
        })

    }

    _read(size) {
        const buffer = Buffer.alloc(size)
        fs.read(this.readfd, buffer, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err)
            this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null)
        })
    }

    // _read() {
    //     fs.readFile(this.readFilename, (err, data) => {
    //         const { byteLength } = data
    //         let beforeBytesAdded = this.byteSize
    //         this.byteSize += byteLength

    //         if (beforeBytesAdded !== this.byteSize) {
    //             this.push(data)
    //         }else{
    //             this.push(null)
    //         }
    //     })
    // }
    _write(chunk, encoding, callback) {
        this.bytesArr.push(chunk)
        this.bytesArrSize += chunk.length

        if (this.bytesArrSize >= this.writableHighWaterMark) {
            fs.write(this.writefd, Buffer.concat(this.bytesArr), err => {
                if (err) return callback(err)
                else {
                    this.reset()
                    callback()
                }
            })

        }
        else callback()
    }

    _final(callback) {
        if (this.bytesArr.length > 0) {
            fs.write(this.writefd, Buffer.concat(this.bytesArr), err => {
                if (err) callback(err)
                else {
                    this.reset()
                    callback()
                }
            })
        }
    }

    _destroy(error, callback) {
        if (this.readfd) {
            fs.close(this.readfd, err => {
                if (err) callback(err || error)
                else {
                    if (this.writefd) {
                        fs.close(this.writefd, err => {
                            if (err) return callback(err || error)
                            else callback(error)
                        })
                    }
                }
            })
        }


    }

    reset() {
        this.bytesArr = []
        this.bytesArrSize = 0
    }
}




const duplex = new DuplexStream({ readFilename: './even-write.txt', writeFilename: './even-write.txt' })
duplex.write(Buffer.from('I am awesome\n'))
duplex.write(Buffer.from('I love coding\n'))
duplex.end(`the end of the file.`)

duplex.on('data', chunk => {
    console.log(chunk.toString('utf-8'))
})
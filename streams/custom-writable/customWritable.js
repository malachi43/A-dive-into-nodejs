const { Writable } = require('node:stream')
const fs = require('node:fs')

class FileWriteStream extends Writable {
    constructor({ highWaterMark, filename }) {
        super({ highWaterMark })
        this.filename = filename
        this.fd = null
        this.bytesArr = []
        this.bytesLength = 0
    }

    //This will run after the constructor, and it will put off calling the other methods until we call the callback function.
    _construct(callback) {
        fs.open(this.filename, 'w', (err, fd) => {
            //If an err argument is passed, it means an error was encountered. The program does not proceed.
            if (err) callback(err)
            else {
                this.fd = fd
                //no argument means it was successful.
                callback()
            }
        })
    }

    _write(chunk, encoding, callback) {
        this.bytesArr.push(chunk)
        this.bytesLength += chunk.length
        if (this.bytesLength >= this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.bytesArr), (err) => {
                if (err) return callback(err)
                this.reset()
                callback()
            })
        }
        else callback()
    }

    _final(callback) {
        if (this.bytesArr.length > 0) {
            fs.write(this.fd, Buffer.concat(this.bytesArr), (err) => {
                if (err) return callback(err)
                else {
                    this.reset()
                    callback()
                }
            })
        }
    }

    _destroy(error, callback) {
        if (this.fd) {
            fs.close(this.fd, err => {
                callback(err || error)
            })
        } else callback(error)
    }

    reset() {
        this.bytesArr = []
        this.bytesLength = 0
    }
}

(async () => {

    console.time('writeBig')
    const stream = new FileWriteStream({ filename: './text.txt' })


    //counter
    let i = 0
    //I initially performed 100million writes, but had to change it to a few writes for easy upload to github.
    const numberOfWrites = 100
    function writeData() {
        while (i <= numberOfWrites) {
            let buffer = Buffer.from(`${i} `)

            //Last write to file
            if (i === (numberOfWrites - 1)) {
                buffer = Buffer.from(`${i++}`)
                stream.end(buffer)
                return
            }
            //If stream return false i.e the internal buffer is full, then we break out of the loop and allow the internal buffer to drain(wait till the buffer is empty)

            i++
            if (!stream.write(buffer)) break

        }
    }

    writeData()
    let count = 0
    //emitted when internal buffer is empty, loop resumes
    stream.on('drain', () => {
        console.log(`number of drains: `, ++count)

        writeData()
    })

    //Emitted when the stream.end() method is invoked
    stream.on('finish', () => {
        console.timeEnd('writeBig')
    })

    //We drained 420 times

})()
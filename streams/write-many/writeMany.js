//Working with streams in Nodejs
const fs = require('fs/promises');
//CPU usage: 29% 
//Execution time:  1min to run and and uses 18mb of storage
// (async () => {
//     const file = await fs.open('./writeMany.txt', 'w')

//     console.time('writeMany')
//     for (let i = 0; i < 1000000; ++i) {
//         await file.write(`${i} `)
//     }
//     console.timeEnd('writeMany')
//     await file.close()
// })();

// (() => {
//     console.time('benchmark')
//     fs.open('./writeMany.txt', 'w', (err, fd) => {

//         for (let i = 0; i < 1000000; ++i) {
//             let buffer = Buffer.from(`${i} `)

//             fs.write(fd, buffer,()=>{})
//         }
//         console.timeEnd('benchmark')
//     })
// })()

//DON'T DO IT THIS WAY.HIGH!!! MEMORY USAGE
(async () => {

    console.time('writeBig')
    const filepath = './text-small.txt'
    const fileHandle = await fs.open(filepath, 'w')
    const stream = fileHandle.createWriteStream()

    //counter
    let i = 0
    //I initially performed 100million writes, but had to change it to a few writes for easy upload to github.
    const numberOfWrites = 100
    function writeData() {
        while (i < numberOfWrites) {
            const buffer = Buffer.from(`${i} `)

            //Last write to file
            if (i === (numberOfWrites - 1)) {
                return stream.end(buffer.toString('utf-8'))
            }
            //If stream return false i.e the internal buffer is full, then we break out of the loop and allow the internal buffer to drain(wait till the buffer is empty)
            if (!stream.write(buffer.toString('utf-8'))) break
            ++i
        }
    }

    writeData()
    let count = 0
    //emitted when internal buffer is empty, loop resumes
    stream.on('drain', () => {
        writeData()
    })

    //Emitted when the stream.end() method is invoked
    stream.on('finish', () => {
        console.timeEnd('writeBig')
    })

    //We drained 420 times

})()
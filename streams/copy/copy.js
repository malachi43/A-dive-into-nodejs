const fs = require('fs/promises');

///////////////////////////////
///// READING FILE AT ONCE ////
// (async () => {
//     console.time('read')
//     const fileHandle = await fs.open('./text-gigantic.txt', 'r')
//     const writeTo = await fs.open("./text-gigantic-copy.txt", 'w')
//     //All contents of the file are returned in one buffer
//     const content = await fileHandle.readFile()

//     await writeTo.write(content)
//     console.timeEnd('read')
// })()

/////////////////////////
/// CUSTOM STREAM ///////
// (async () => {
//     console.time('read')
//    const srcFile = await fs.open('./text-small.txt', 'r')
//    const destFile = await fs.open('./text-small-copy.txt', 'w')

  
//    let byteLength = -1

//    while(byteLength !== 0){
//      //chunk(buffer) read from srcFile
//      let readChunk = await srcFile.read()
//     //No of bytesRead from the chunk(16384 bytes)
//      byteLength = readChunk.bytesRead
//     if(byteLength !== 16_384){
//         //Get the first index of zero in the buffer
//         const indexOfFirstZero = readChunk.buffer.indexOf(0)
//         //create a new buffer of length "indexOfFirstZero" length having indexes from 0-(indexOfFirstZero - 1). Remember buffer are array-like
//         //The buffer.copy() has the following parameters buffer.copy(arrayToBeCopiedTo, targetStart,sourceStart, sourceEnd(length of the new-array))
//         const newBuffer = Buffer.alloc(indexOfFirstZero)
//         readChunk.buffer.copy(newBuffer, 0, 0, indexOfFirstZero)
//         destFile.write(newBuffer)
//     } 
//     else destFile.write(readChunk.buffer)
    
//    }
//     console.timeEnd('read')
// })()


// (async ()=>{
//     console.time('stream-copy-using-pipe')
//     const srcFile = await fs.open('./text-gigantic.txt', 'r')
//     const destFile = await fs.open('./text-stream-pipe-gigantic-copy.txt', 'w')

//     const readStream = srcFile.createReadStream()
//     const writeStream = destFile.createWriteStream()

//     readStream.pipe(writeStream)
    
//     readStream.on('end', ()=>{
//         console.timeEnd('stream-copy-using-pipe')
//     })

// })()

const {pipeline} = require('node:stream');

(async ()=>{
    console.time('stream-copy-using-pipeline')
    const srcFile = await fs.open('./text-gigantic.txt', 'r')
    const destFile = await fs.open('./text-stream-pipe-gigantic-copy.txt', 'w')

    const readStream = srcFile.createReadStream()
    const writeStream = destFile.createWriteStream()

    pipeline(readStream, writeStream, function(err) {
        if(err) return console.log(`Error: `, err)
        console.timeEnd('stream-copy-using-pipe')        
    })

})()

const fs = require('fs/promises');
const { join } = require('path');

(async () => {
    console.time('readBig')

    //file to read from
    const inputFile = './text.txt'

    //file to write to.
    const outputFile = './evenNum.txt'

    const fileHandler = await fs.open(join(__dirname, inputFile), 'r')
    const fileHandleWrite = await fs.open(join(__dirname, outputFile), 'w')
    //create a read-stream from the file
    const readStream = fileHandler.createReadStream()
    //create a write-stream from the file
    const writeStream = fileHandleWrite.createWriteStream()
    let split = ''

    //listening for data
    readStream.on('data', chunk => {
        let numbers = chunk.toString('utf-8').split(' ')


        if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
            if (split) {
                numbers[0] = split + numbers[0]
                // numbers[0] = numbers[0].trim()
            }
        }

        if (Number(numbers[numbers.length - 1]) - 1 !== Number(numbers[numbers.length - 2])) {
            split = numbers.pop()
        }


        numbers.forEach(number => {
            let num = Number(number)
            //write even numbers to the file.
            if (num % 2 === 0) {
                if (!writeStream.write(Buffer.from(`${num} `))) readStream.pause()
            }
        })



    })

    readStream.on('end', () => {
        console.timeEnd('readBig')
    })

    writeStream.on('drain', () => {
        readStream.resume()
    })
})()
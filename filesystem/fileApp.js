const fs = require('fs/promises');
const { join } = require('path')
const CREATE_FILE = 'create file'
const DELETE_FILE = 'delete file'
const RENAME_FILE = 'rename file'
const APPEND_TO_FILE = 'append to file'

let count = 0;
(async () => {


    async function createFile(path) {
        try {
            //Check if file exists
            const existingFile = await fs.open(join(__dirname, path), 'r')
            existingFile.close()
            console.log(`The file ${path} already exist`)
        } catch (error) {
            //Create file since it  doesn't exist
            const newFile = await fs.open(join(__dirname, path), 'w')
            console.log(`File: created ${path}`)
            newFile.close()
        }
    }

    async function deleteFile(path) {
        try {
            await fs.unlink(join(__dirname, path))
            console.log(`Deleting file ${path}...`)
            console.log(`File: ${path} deleted.`)
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`File ${path} does not exist`)
            }
            else {
                console.log(`Error occured while deleting file`)
                console.log(error)
            }
        }
    }

    async function renameFile(oldFilePath, newFilePath) {
        try {
            await fs.rename(join(__dirname, oldFilePath), join(__dirname, newFilePath))
            console.log(`Rename  file ${oldFilePath} to ${newFilePath}`)
        } catch (error) {

            if (error.code === 'ENOENT') {
                console.log(`File ${oldFilePath} does not exist or destination does not exist`)
            }
            console.log(`Error renaming file: `)
            console.log(error)
        }
    }

    async function appendToFile(fileToAddTo, newData) {
        try {
            const fileToAddContent = await fs.appendFile(join(__dirname, fileToAddTo), newData)
        } catch (error) {
            console.log(`File ${fileToAddTo} does not exist`)
        }
    }

    //Open the file
    const commandFile = await fs.open('./command.txt', 'r')

    //Listening for change events
    commandFile.on('change', async function () {
        //Get the commandFile size in bytes
        const fileSize = (await commandFile.stat()).size
        //Allocate buffer to the size of the commandFile
        const buffer = Buffer.alloc(fileSize)
        //location to start filling the buffer
        const offset = 0
        //No of bytes we want to read
        const length = buffer.byteLength
        //position to start reading the commandFile from
        const position = 0
        //We always want to read the whole content (from position to length)
        await commandFile.read(buffer, offset, length, position)


        const fileContent = buffer.toString('utf-8')

        console.log(fileContent)


        if (fileContent.includes(CREATE_FILE)) {
            //Get the file name after the string "create file"
            const filename = fileContent.substring(CREATE_FILE.length + 1, fileContent.indexOf('txt') + 3).trim()

            createFile(filename)
                .catch(err => {
                    console.log('Error')
                    console.error(err.message)
                })
        }
        if (fileContent.includes(DELETE_FILE)) {
            //Get the file name after the string "delete file"
            const filename = fileContent.substring(DELETE_FILE.length + 1).trim()

            deleteFile(filename)
                .catch(err => {
                    console.log('Error')
                    console.error(err.message)
                })
        }

        if (fileContent.includes(RENAME_FILE)) {
            const index = fileContent.indexOf(` to `)
            //Get the file name after the string "rename file"
            const oldFilePath = fileContent.substring(RENAME_FILE.length + 1, index).trim()
            const newFilePath = fileContent.slice(index + 4).trim()

            renameFile(oldFilePath, newFilePath)
                .catch(err => {
                    console.log('Error')
                    console.error(err.message)
                })
        }

        if (fileContent.includes(APPEND_TO_FILE)) {
            //Get the file name after the string "append to file"
            const fileToAppendTo = fileContent.substring(APPEND_TO_FILE.length + 1, fileContent.indexOf(`this content`)).trim()
            //Get the index of the first chatacter "a"
            const startIndex = fileContent.indexOf('this content')
            //Get the text after the string "append"
            const newData = fileContent.slice(startIndex + 12)

            appendToFile(fileToAppendTo, newData)
                .catch(err => {
                    console.log('Error')
                    console.error(err.message)
                })
        }


    })

    watchFile('./command.txt', commandFile)
        .catch(err => {
            console.log('Error')
            console.error(err.message)
        })

})()


async function watchFile(fileToWatch, masterFile) {
    console.log("listening for file changes...")
    //Watching the commandFile for changes
    const watcher = fs.watch(fileToWatch)

    for await (const event of watcher) {
        //Listening for change events
        if (event.eventType === 'change') masterFile.emit('change')
    }
}

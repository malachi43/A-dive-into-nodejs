const net = require('net')
const readLine = require('readline/promises')
const rl = readLine.createInterface({ input: process.stdin, output: process.stdout })
let socketId = null


const clearLine = (direction) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(direction, () => { resolve() })
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve()
        })
    })
}


const getTimestamp = () => {

    const hours = new Date().getHours()
    const minutes = new Date().getMinutes() < 10 ? `0` + new Date().getMinutes() : new Date().getMinutes()
    const day = new Date().getHours() < 12 ? "AM" : "PM"

    return { hours, minutes, day }
}

const socket = net.createConnection({ host: "localhost", port: 4000 }, async () => {

    console.log(`Connected to the server!`)

    const ask = async () => {
        const answer = await rl.question(`Enter a message > `)
        // take the cursor to the line above note: y starts at zero(0)  -1,0 1
        await moveCursor(0, -1)
        //clears the current line the cursor is in
        await clearLine(0)
        socket.write(`${socketId}-message-${answer}`)
    }

    ask()

    socket.on('data', async (chunk) => {
        const { hours, minutes, day } = getTimestamp()
        //we check for the "id:" to know when the server sends an id to the client
        if (chunk.toString().slice(0, 3) === 'id:') {
            //logs an empty line
            console.log()
            //move the cursor one line up
            await moveCursor(0, -1)
            //clears the line the cursor moved into
            await clearLine(0)
            //grab everything from the third character up until the end
            socketId = chunk.toString().slice(3)
            console.log(`Your id: ${socketId}\n`)
        } else {
            //logs an empty line when we recieved a data 
            console.log()
            //move the cursor one line up
            await moveCursor(0, -1)
            //clears the line the cursor moved into
            await clearLine(0)
    
            console.log(`@${hours}:${minutes}${day} ${chunk.toString('utf-8')}`)
        }
    
        ask()
    
    })

    socket.on('error', (err) => {
        console.log(`Error: `, err.message)
    })

})

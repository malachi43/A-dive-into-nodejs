// const http = require('http')
// const fs = require('fs/promises')
// const PORT = 3000

// const server = http.createServer(async (req, res) => {
//     const contentBuffer = await fs.readFile(__dirname + '/text.txt')
//     res.statusCode = 200
//     res.setHeader('Content-Type', 'text/plain')
//     res.end(contentBuffer.toString('utf-8'))
// })

// server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

const EventEmitter = require('events')
const { pipeline } = require('stream')

class myEvents extends EventEmitter {
    constructor() {
        super()
    }
}


const customEvent = new myEvents()

//You listen for the events first
customEvent.on('payload', (data) => {
    const { name, country } = data
    console.log(`I'm ${name} from ${country}`);
})

//Emit the events after listening for the event using the "on" method
customEvent.emit('payload', { name: 'Uko Chibuike Malachi', country: 'Nigeria' })
customEvent.emit('payload', { name: 'Uko Chibuike Malachi', country: 'Nigeria' })
customEvent.emit('payload', { name: 'Uko Chibuike Malachi', country: 'Nigeria' })
customEvent.emit('payload', { name: 'Uko Chibuike Malachi', country: 'Nigeria' })
customEvent.emit('payload', { name: 'Uko Chibuike Malachi', country: 'Nigeria' })

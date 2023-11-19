//Buffer: Used to temporarily hold fixed length sequence of bytes.
const { Buffer } = require('buffer')

const buff = Buffer.alloc(8)
// const buff3 = Buffer.from('string')
const buff3 = Buffer.from([115, 116, 114, 105, 110, 103])
console.log(buff3.toString('utf16le'))
console.log(buff3.toJSON())
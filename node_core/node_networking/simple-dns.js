const dns = require('node:dns/promises');


(async ()=>{
    const result = await dns.lookup('localhost')
    console.log(result)
})()

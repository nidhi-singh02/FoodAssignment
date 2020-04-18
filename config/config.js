const fs = require('fs')
const path = require('path')
const NODE_ENV = process.env.NODE_ENV
let configBuffer = null

// Init config_buffer according to the NODE_ENV
switch (NODE_ENV) {
 case 'dev':
        configBuffer = fs.readFileSync(
            path.resolve(__dirname, 'development.json'),
            'utf-8'
        )
        break
    case 'local':
        configBuffer = fs.readFileSync(
            path.resolve(__dirname, 'local.json'),
            'utf-8'
        )
        
}

let config = JSON.parse(configBuffer)
module.exports = config
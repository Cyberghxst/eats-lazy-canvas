const { EATSLazyCanvas } = require('../dist')
const { API } = require('easy-api.ts')

const api = new API({
    addons: [new EATSLazyCanvas()],
    dots: false,
    reverse: false
})

api.connect({
    port: 3000,
    host: 'localhost',
})
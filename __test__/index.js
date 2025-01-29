const { EATSLazyCanvas } = require('../dist')
const { API } = require('easy-api.ts')

const api = new API({
    addons: [new EATSLazyCanvas()],
    dots: false,
    reverse: false
})

api.event({
    name: 'ready',
    code: `
        $createCanvas[600;200;
            $loadFont[JoeKubert;./fonts/v_CCJoeKubert-Doubled_v1.3.ttf;regular]
            $addEllipseImageLayer[300;100;600;200;50;https://images.wallpapersden.com/image/download/amazing-desert-hd-cool-aesthetic_bWpoammUmZqaraWkpJRmZ2VlrWllZQ.jpg]

            $createOutline[u;inner;#fff;1;1]
            $addEllipseLayer[300;100;598;198;50;#000;]
        ]
    `
})

api.connect({
    port: 3000,
    host: 'localhost',
})
import type { CompiledFunction } from 'easy-api.ts/lib/classes/internal/CompiledFunction'
import { APIFunction, Data, Errors, ParamType, Util } from 'easy-api.ts'
import { LazyCanvas, EllipseImageLayer } from '@hitomihiumi/lazy-canvas'
import { makeId, makeUsage } from '@structures/EATSLazyCanvas'
import CreateCanvas from '@functions/createCanvas'

/**
 * Function that creates a new ellipse image layer.
 */
export default class AddEllipseImageLayer extends APIFunction {
    name = '$addEllipseImageLayer'
    description = 'Adds an ellipse image layer to the canvas.'
    parameters = [
        {
            name: 'X',
            description: 'The X coordinate of the layer.',
            type: ParamType.Number,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Y',
            description: 'The Y coordinate of the layer.',
            type: ParamType.Number,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Width',
            description: 'The image width.',
            type: ParamType.Number,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Height',
            description: 'The image height.',
            type: ParamType.Number,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Radius',
            description: 'The radius of the arc.',
            type: ParamType.Number,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'URL',
            description: 'The URL of the image.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'ID',
            description: 'The ID of the layer.',
            type: ParamType.String,
            required: false,
            rest: false,
            defaultValue: null
        }
    ]
    usage = makeUsage(this.name, this.parameters)
    returns = ParamType.Unknown
    compile = true
    aliases = []
    parent = new CreateCanvas()
    run = async function(this: CompiledFunction, d: Data, [x, y, width, height, radius, url, id]: string[]) {
        // Checking the types.
        if (!Util.isNumber(x)) throw new Errors.InvalidType(this.name, 'x number', x);
        if (!Util.isNumber(y)) throw new Errors.InvalidType(this.name, 'y number', y);
        if (!Util.isNumber(width)) throw new Errors.InvalidType(this.name, 'width number', width);
        if (!Util.isNumber(height)) throw new Errors.InvalidType(this.name, 'height number', height);
        if (!Util.isNumber(radius)) throw new Errors.InvalidType(this.name, 'radius number', radius);

        // Getting the lazy canvas.
        const canvas = d.getInternalVar<LazyCanvas>('eats.lazycanvas')

        // Creating the arc layer.
        const layer = new EllipseImageLayer()
        .setX(parseInt(x))
        .setY(parseInt(y))
        .setWidth(parseInt(width))
        .setHeight(parseInt(height))
        .setRadius(parseInt(radius))
        .setImage(url)
        .setID(id ?? makeId(5))
        
        // Adding the layer.
        canvas.addLayers(layer)
    }
}
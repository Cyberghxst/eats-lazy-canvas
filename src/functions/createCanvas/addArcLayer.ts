import type { CompiledFunction } from 'easy-api.ts/lib/classes/internal/CompiledFunction'
import { APIFunction, Data, Errors, ParamType, Util } from 'easy-api.ts'
import { LazyCanvas, ArcLayer } from '@hitomihiumi/lazy-canvas'
import { makeId, makeUsage } from '@structures/EATSLazyCanvas'
import CreateCanvas from '@functions/createCanvas'

/**
 * Function that creates a new arc layer.
 */
export default class AddArcLayer extends APIFunction {
    name = '$addArcLayer'
    description = 'Adds an arc layer to the canvas.'
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
            name: 'Radius',
            description: 'The radius of the arc.',
            type: ParamType.Number,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Color',
            description: 'The color of the arc.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Filled',
            description: 'Whether the arc should be filled.',
            type: ParamType.Boolean,
            required: false,
            rest: false,
            defaultValue: 'true'
        },
        {
            name: 'Stroke',
            description: 'The stroke of the arc.',
            type: ParamType.Number,
            required: false,
            rest: false,
            defaultValue: '1'
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
    run = async function(this: CompiledFunction, d: Data, [x, y, radius, color, filled, stroke, id]: string[]) {
        // Checking the types.
        if (!Util.isNumber(x)) throw new Errors.InvalidType(this.name, 'x number', x);
        if (!Util.isNumber(y)) throw new Errors.InvalidType(this.name, 'y number', y);
        if (!Util.isNumber(radius)) throw new Errors.InvalidType(this.name, 'radius number', radius);
        if (!Util.isValidHex(color)) throw new Errors.InvalidType(this.name, 'color string', color);

        // Getting the lazy canvas.
        const canvas = d.getInternalVar<LazyCanvas>('eats.lazycanvas')

        // Creating the arc layer.
        const layer = new ArcLayer()
        .setX(parseInt(x))
        .setY(parseInt(y))
        .setRadius(parseInt(radius))
        .setColor(color)
        .setFilled(Boolean(filled ?? 'true'))
        .setStroke(parseFloat(stroke ?? '1'))
        .setID(id ?? makeId(5))
        
        // Adding the layer.
        canvas.addLayers(layer)
    }
}
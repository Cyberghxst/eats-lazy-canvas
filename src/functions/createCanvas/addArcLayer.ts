import type { CompiledFunction } from 'easy-api.ts/lib/classes/internal/CompiledFunction'
import { APIFunction, Data, Errors, ParamType, Util } from 'easy-api.ts'
import { LazyCanvas, ArcLayer } from '@hitomihiumi/lazy-canvas'
import { makeId, makeUsage } from '@structures/EATSLazyCanvas'
import { join } from 'path'

/**
 * The directory where the functions are stored.
 */
export const CANVAS_FUNCTIONS_DIR = join(__dirname, 'createCanvas')

/**
 * Function that creates a new lazy canvas.
 */
export default class CreateCanvas extends APIFunction {
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
    compile = false
    aliases = []
    run = async function(this: CompiledFunction, d: Data, [x, y, radius, color, filled, stroke, id]: string[]) {
        // Resolving required parameters.
        x = await Util.resolveCode(d, x)
        y = await Util.resolveCode(d, y)
        radius = await Util.resolveCode(d, radius)
        color = await Util.resolveCode(d, color)

        // Resolving optional parameters.
        if (filled) {
            filled = await Util.resolveCode(d, filled)
        }
        if (stroke) {
            stroke = await Util.resolveCode(d, stroke)
        }
        if (id) {
            id = await Util.resolveCode(d, id)
        }

        // Checking the types.
        if (!Util.isNumber(x)) throw new Errors.InvalidType(this.name, 'x number', x);
        if (!Util.isNumber(y)) throw new Errors.InvalidType(this.name, 'y number', y);
        if (!Util.isNumber(radius)) throw new Errors.InvalidType(this.name, 'radius number', radius);
        if (!Util.isValidHex(color)) throw new Errors.InvalidType(this.name, 'color string', color);

        // Creating the child data object to run the scoped functions.
        const data = d.extend(d._, d.__)
        // Loading each scoped function.
        data.functions.load(
            CANVAS_FUNCTIONS_DIR,
            fn => fn.parent !== undefined && fn.parent.name === '$createCanvas'
        )

        // Getting the lazy canvas.
        const canvas = data.getInternalVar<LazyCanvas>('eats.lazycanvas')

        // Creating the arc layer.
        const layer = new ArcLayer()
        .setX(parseInt(x))
        .setY(parseInt(y))
        .setRadius(parseInt(radius))
        .setColor(color)
        .setFilled(Boolean(filled ?? 'true'))
        .setStroke(parseInt(stroke ?? '1'))
        .setID(id ?? makeId(5))
        
        // Adding the layer.
        canvas.addLayers(layer)
    }
}
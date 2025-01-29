import type { CompiledFunction } from 'easy-api.ts/lib/classes/internal/CompiledFunction'
import { APIFunction, Data, Errors, ParamType, Util } from 'easy-api.ts'
import { makeUsage } from '@structures/EATSLazyCanvas'
import { LazyCanvas } from '@hitomihiumi/lazy-canvas'
import { join } from 'path'

/**
 * The directory where the functions are stored.
 */
export const CANVAS_FUNCTIONS_DIR = join(__dirname, 'createCanvas')

/**
 * Function that creates a new lazy canvas.
 */
export default class CreateCanvas extends APIFunction {
    name = '$createCanvas'
    description = 'Creates a new lazy canvas.'
    parameters = [
        {
            name: 'Width',
            description: 'The width of the canvas.',
            type: ParamType.Number,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Height',
            description: 'The height of the canvas.',
            type: ParamType.Number,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Code',
            description: 'The code to run.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        }
    ]
    usage = makeUsage(this.name, this.parameters)
    returns = ParamType.Unknown
    compile = false
    aliases = []
    run = async function(this: CompiledFunction, d: Data, [width, height, code]: string[]) {
        width = await Util.resolveCode(d, width)
        height = await Util.resolveCode(d, height)

        if (!Util.isNumber(width)) throw new Errors.InvalidType(this.name, 'width number', width);
        if (!Util.isNumber(height)) throw new Errors.InvalidType(this.name, 'height number', height);

        // Creating the child data object to run the scoped functions.
        const data = d.extend(d._, d.__)
        // Loading each scoped function.
        data.functions.load(
            CANVAS_FUNCTIONS_DIR,
            fn => fn.parent !== undefined && fn.parent.name === '$createCanvas'
        )

        // Creating the lazy canvas.
        const canvas = new LazyCanvas()
        .createNewCanvas(Number(width), Number(height))
        
        // Creating the variable to save the lazy canvas for the children to access to it.
        data.setInternalVar('eats.lazycanvas', canvas)

        // Running the code.
        await Util.resolveCode(data, code)
    }
}
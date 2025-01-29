import type { CompiledFunction } from 'easy-api.ts/lib/classes/internal/CompiledFunction'
import { type LazyCanvas, saveFile } from '@hitomihiumi/lazy-canvas'
import { APIFunction, Data, ParamType } from 'easy-api.ts'
import { makeUsage } from '@structures/EATSLazyCanvas'
import CreateCanvas from '@functions/createCanvas'

/**
 * Function that loads a font into the canvas.
 */
export default class RenderCanvas extends APIFunction {
    name = '$renderCanvas'
    description = 'Renders the canvas.'
    parameters = [
        {
            name: 'Path',
            description: 'The path to save the canvas.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        }
    ]
    usage = makeUsage(this.name, this.parameters)
    returns = ParamType.Unknown
    compile = true
    aliases = []
    parent = new CreateCanvas()
    run = async function(this: CompiledFunction, d: Data, [path]: string[]) {
        // Getting the lazy canvas.
        const canvas = d.getInternalVar<LazyCanvas>('eats.lazycanvas')

        const image = await canvas.renderImage()
        await saveFile(image, 'png', path)
    }
}
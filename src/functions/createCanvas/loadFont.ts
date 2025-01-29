import type { CompiledFunction } from 'easy-api.ts/lib/classes/internal/CompiledFunction'
import { LazyCanvas, FontWeight, Font, StringFontWeight } from '@hitomihiumi/lazy-canvas'
import { APIFunction, Data, ParamType } from 'easy-api.ts'
import { makeUsage } from '@structures/EATSLazyCanvas'
import CreateCanvas from '@functions/createCanvas'

/**
 * Function that loads a font into the canvas.
 */
export default class LoadFont extends APIFunction {
    name = '$loadFont'
    description = 'Loads a font to the canvas.'
    parameters = [
        {
            name: 'Family',
            description: 'The font family.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Path',
            description: 'The path to the font file.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Weight',
            description: 'The font weight.',
            type: ParamType.String,
            required: false,
            rest: false,
            defaultValue: 'regular',
            allowedValues: Object.keys(FontWeight)
        }
    ]
    usage = makeUsage(this.name, this.parameters)
    returns = ParamType.Unknown
    compile = true
    aliases = []
    parent = new CreateCanvas()
    run = async function(this: CompiledFunction, d: Data, [family, path, weight]: string[]) {
        // Getting the lazy canvas.
        const canvas = d.getInternalVar<LazyCanvas>('eats.lazycanvas')

        // Loading the font.
        const font = new Font()
        .setFamily(family)
        .setPath(path)
        .setWeight(weight ? <StringFontWeight>weight : FontWeight.regular)

        canvas.loadFonts(font)
    }
}
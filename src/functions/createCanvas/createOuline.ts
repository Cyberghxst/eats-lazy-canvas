import type { CompiledFunction } from 'easy-api.ts/lib/classes/internal/CompiledFunction'
import { Outline, OutlineType, StringOutlineType } from '@hitomihiumi/lazy-canvas'
import { APIFunction, Data, Errors, ParamType, Util } from 'easy-api.ts'
import { makeUsage } from '@structures/EATSLazyCanvas'
import CreateCanvas from '@functions/createCanvas'

/**
 * Function that creates an outline.
 */
export default class CreateOutline extends APIFunction {
    name = '$createOutline'
    description = 'Creates an outline.'
    parameters = [
        {
            name: 'ID',
            description: 'The ID of the outline.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Type',
            description: 'The type of the outline.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Color',
            description: 'The color of the outline.',
            type: ParamType.String,
            required: false,
            rest: false,
            defaultValue: '#FFFFFF'
        },
        {
            name: 'Alpha',
            description: 'The alpha of the outline.',
            type: ParamType.Number,
            required: false,
            rest: false,
            defaultValue: '100'
        },
        {
            name: 'Stroke',
            description: 'The stroke of the outline.',
            type: ParamType.Number,
            required: false,
            rest: false,
            defaultValue: '1'
        }
    ]
    usage = makeUsage(this.name, this.parameters)
    returns = ParamType.Unknown
    compile = true
    aliases = []
    parent = new CreateCanvas()
    run = async function(this: CompiledFunction, d: Data, [id, type, color, alpha, stroke]: string[]) {
        if (!Util.isValidHex(color)) throw new Errors.InvalidType(this.name, 'color string', color);
        if (alpha !== undefined && !Util.isNumber(alpha)) throw new Errors.InvalidType(this.name, 'alpha number', alpha);
        if (stroke !== undefined && !Util.isNumber(stroke)) throw new Errors.InvalidType(this.name, 'stroke number', stroke);

        // Loading the font.
        const outline = new Outline()
        .setAlpha(parseInt(alpha ?? '100'))
        .setColor(color ?? '#FFFFFF')
        .setStroke(parseInt(stroke ?? '1'))
        .setType(<StringOutlineType>type ?? OutlineType.center)

        // Create the outline.
        d.setInternalVar(`outline.${id}`, outline)
    }
}
import { LazyCanvas, TextLayer, StringTextAlign, TextAlign } from '@hitomihiumi/lazy-canvas'
import type { CompiledFunction } from 'easy-api.ts/lib/classes/internal/CompiledFunction'
import { APIFunction, Data, Errors, ParamType, Util } from 'easy-api.ts'
import { makeId, makeUsage } from '@structures/EATSLazyCanvas'
import CreateCanvas from '@functions/createCanvas'

/**
 * Function that creates a new text layer.
 */
export default class AddTextLayer extends APIFunction {
    name = '$addTextLayer'
    description = 'Adds a text layer to the canvas.'
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
            name: 'Font Name',
            description: 'The font name of the text.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Font Size',
            description: 'The font size of the text.',
            type: ParamType.Number,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Color',
            description: 'The color of the text.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Text',
            description: 'The text to display.',
            type: ParamType.String,
            required: true,
            rest: false,
            defaultValue: null
        },
        {
            name: 'Align',
            description: 'The alignment of the text.',
            type: ParamType.String,
            required: false,
            rest: false,
            defaultValue: 'left',
            allowedValues: Object.values(TextAlign)
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
    run = async function(this: CompiledFunction, d: Data, [x, y, fontName, fontSize, color, text, align, id]: string[]) {
        // Checking the types.
        if (!Util.isNumber(x)) throw new Errors.InvalidType(this.name, 'x number', x);
        if (!Util.isNumber(y)) throw new Errors.InvalidType(this.name, 'y number', y);
        if (!Util.isValidHex(color)) throw new Errors.InvalidType(this.name, 'color string', color);

        // Getting the lazy canvas.
        const canvas = d.getInternalVar<LazyCanvas>('eats.lazycanvas')

        // Creating the arc layer.
        const layer = new TextLayer()
        .setX(parseInt(x))
        .setY(parseInt(y))
        .setColor(color)
        .setFont(fontName)
        .setFontSize(parseFloat(fontSize))
        .setText(text)
        .setAlign(<StringTextAlign>align ?? TextAlign.left)
        .setID(id ?? makeId(5))
        
        // Adding the layer.
        canvas.addLayers(layer)
    }
}
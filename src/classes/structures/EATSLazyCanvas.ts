import type { ParameterDefinition } from 'easy-api.ts/lib/classes/structures/APIFunction'
import { Addon, ParamType, type API } from 'easy-api.ts'
import { join } from 'path'

/**
 * The directory where the functions are stored.
 */
export const FUNCTIONS_DIR = join(__dirname, '..', '..', 'functions')

/**
 * Generates a random ID.
 * @param fresh - The length of the random ID.
 * @returns {string}
 */
export const makeId = (fresh = 8): string => {
    const now = Date.now().toString(16)
    const rand = Math.random().toString(16).slice(2, fresh + 2)

    return `${now}-${rand}`
}

/**
 * Converts a text to formal case.
 * @param text - The text to convert.
 * @returns {string}
 */
export const toCamelCase = (text: string): string => {
    return text.split(' ')
    .map((part, i) => i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

/**
 * The string parameter types from eats.
 */
const stringParamTypes = Object.keys(ParamType).filter(x => isNaN(Number(x)))

/**
 * Makes the usage for a function.
 * @param name - The name of the function.
 * @param params - The parameters for the function.
 * @returns {string}
 */
export const makeUsage = (name: string, params: ParameterDefinition[]): string => {
    const usage = params.map(
        p => `${
            p.rest ? '...' : ''
        }${toCamelCase(p.name)}${
            p.required ? '' : '?'
        }: ${
            stringParamTypes[p.type].toLowerCase()
        }`
    )
    .join(', ')

    return `${name}[${usage}]`
}

/**
 * easy-api.ts addon for lazy canvas.
 */
export class EATSLazyCanvas extends Addon {
    /**
     * Initializes the addon.
     * @param api - The easy-api.ts API.
     * @returns {void}
     */
    public init(api: API): void {
        // Remove the default canvas functions.
        const all = api.functions.toArray()
        const fns = all.filter(t => t.name === '$createCanvas' || t.parent && t.parent.name === '$createCanvas')
        for (const fn of fns) {
            api.functions.delete(fn.name.toLowerCase())
        }

        if (fns[0].name === '$createCanvas' && !api.functions.has(fns[0].name)) {
            console.info('Successfully removed the default canvas functions.')
        }

        // Load the functions.
        api.functions.load(FUNCTIONS_DIR)
    }
}
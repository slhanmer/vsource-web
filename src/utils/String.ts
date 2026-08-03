/**
 * Capitalises the first character of a string, leaving the rest unchanged.
 *
 * @param str - Input string
 * @returns The string with its first character uppercased
 *
 * @example
 * capitalizeFirst('hello world') // → 'Hello world'
 */
export function capitalizeFirst(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Capitalises the first character of every space-separated word.
 *
 * @param str - Input string
 * @returns Title-cased string
 *
 * @example
 * capitalizeWords('hello world') // → 'Hello World'
 */
export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Inserts spaces before uppercase letters that follow a lowercase letter or digit,
 * then title-cases the result. Useful for rendering camelCase identifiers as display labels.
 *
 * @param str - camelCase or PascalCase string
 * @returns Space-separated title-cased string
 *
 * @example
 * splitCamelCaseWords('firstName') // → 'First Name'
 * splitCamelCaseWords('myHTTPRequest') // → 'My HTTP Request'
 */
export function splitCamelCaseWords(str: string): string {
  if (!str) return ''
  // Insert a space before any uppercase letter that follows a lowercase or digit
  const withSpaces = str.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  return capitalizeWords(withSpaces)
}

/**
 * Replaces legacy `#. ` bullet point markers with the `<<BP>>` token used by
 * `processTokens`. Normalises content migrated from the old PHP site format.
 *
 * @param str - Raw content string, potentially containing `#. ` markers
 * @returns String with `#. ` replaced by `<<BP>>`, or the original value if falsy
 */
export const normaliseBulletPoints = (str: string | null | undefined) => {
  if (!str) return str
  return str.replace(/#\.\s*/gm, '<<BP>>')
}

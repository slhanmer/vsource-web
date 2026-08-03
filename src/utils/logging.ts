/**
 * Logs the contents of a `FormData` object to the console as a formatted table.
 * File entries are shown with their name and size rather than raw binary data.
 * Intended for development debugging only — do not leave calls in production code.
 *
 * @param fd - The `FormData` instance to inspect
 */
export const debugFormData = (fd: FormData) => {
  const output: Record<string, any> = {}

  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
      output[key] = `[FILE: ${value.name} | ${value.size} bytes]`
    } else {
      output[key] = value
    }
  }

  console.table(output)
}

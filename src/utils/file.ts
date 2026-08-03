/**
 * Extracts a display-friendly filename by stripping the storage prefix added by the upload pipeline.
 * Files stored with the `__ORIG__` prefix convention have the prefix removed for UI display.
 *
 * @param fileName - Raw filename from the server (e.g. `'uuid__ORIG__my-document.pdf'`)
 * @returns The user-visible filename (e.g. `'my-document.pdf'`), or the original if no prefix is found
 */
export const getDisplayFileName = (fileName: string) => {
  const parts = fileName.split('__ORIG__')
  return parts.length > 1 ? parts[1] : fileName
}

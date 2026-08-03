/**
 * Converts a legacy numeric state ID to its Australian state/territory acronym.
 * IDs are hard-coded to match the legacy PHP site's state enumeration.
 *
 * Mapping: 0=QLD, 1=WA, 2=NT, 3=NSW, 4=VIC, 5=SA, 6=ACT, 7=TAS
 *
 * @param stateId - Numeric state ID (0–7), as a number or numeric string
 * @returns The two- or three-letter state acronym, or `''` for unknown IDs
 */
// These values are hard coded in the legacy PHP site also
export const convertStateIdToAcronym = (stateId: number | string | undefined): string => {
  switch (Number(stateId)) {
    case 0:
      return 'QLD'
    case 1:
      return 'WA'
    case 2:
      return 'NT'
    case 3:
      return 'NSW'
    case 4:
      return 'VIC'
    case 5:
      return 'SA'
    case 6:
      return 'ACT'
    case 7:
      return 'TAS'
    default:
      return ''
  }
}

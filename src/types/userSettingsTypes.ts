/**
 * The context in which a user settings item applies.
 * Determines which toolbox or editor panel the item is rendered in.
 */
export type SettingsType =
  'FORM_EDITOR' | 'ASSESSMENT_EDITOR' | 'FORM_VIEWER' | 'ASSESSMENT_VIEWER' | 'USER' | 'CHAT'

/** Category of a pinned or personalised item in a toolbox or editor sidebar. */
export type ItemType = 'WIDGET' | 'TOOL' | 'PRESET'

/**
 * A single user preference entry — a pinned widget, tool, or preset in a specific editor context.
 * `settings` holds free-form per-item configuration (e.g. default values, display options).
 */
export type UserSettingsItem = {
  id: string
  type: SettingsType
  itemType: ItemType
  /** Key or identifier of the widget, tool, or preset this setting refers to */
  itemRef: string
  /** Display/sort order within the toolbox panel */
  index: number
  settings: Record<string, any> | null
}

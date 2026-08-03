import { FormQuestionMeta } from '@types'

/**
 * Shared metadata that describes how a question widget is rendered, categorised,
 * and stored. Extended by `FormQuestionMeta` and `AssessmentQuestionMeta` for
 * context-specific fields.
 */
export interface BaseQuestionMeta {
  /** Short display name shown in toolbox panels */
  label: string
  /** Override label for display contexts where `label` is too brief */
  displayLabel?: string
  /** Internal grouping key used for toolbox filtering */
  category: string
  /** Human-readable category label shown in the UI */
  displayCategory?: string
  /** React component name used to look up the renderer in the question registry */
  component: string
  /** Optional style variant passed to the component */
  variant?: string
  layout?: 'horizontal' | 'vertical' | 'stacked' | 'default'
  /** Whether the question text stem is rendered above the input widget */
  showQuestionText?: boolean
  /** Which toolbox panel this widget appears in */
  toolboxGroup: 'widget' | 'smart' | 'assessment' | 'report'
  /** How the response value is stored/typed (e.g. `'string'`, `'date'`, `'file'`) */
  dataType?: string
  /** PDF rendering strategy for this question type */
  pdfType?: string
  config?: Record<string, any>
  maxLength?: number
  /** Optional function to determine whether the question has a complete response */
  isComplete?: (question: any) => boolean
  /** When true the widget is hidden from the toolbox but still usable programmatically */
  hidden?: boolean
}

/** Union of all concrete question meta shapes — useful for generic meta-handling code. */
export type AnyQuestionMeta = FormQuestionMeta

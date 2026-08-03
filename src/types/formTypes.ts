import { BaseQuestionMeta, NotificationDetails } from '@types'

/** Quality-assurance lifecycle status for a form document. */
export type QAStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

/** A single selectable option for a choice/radio/checkbox question. */
export type OptionData = {
  oId: string | null
  clientId?: string
  key?: string
  oIndex: number
  optionText: string
  dataLinks?: any
  mappings?: any
}

/** An external reference link attached to a question (e.g. legislation, resource). */
export type QuestionLink = {
  linkId: string
  linkText: string
  linkURL?: string | null
  linkType?: number
}

/**
 * A conditional visibility rule — the question is shown only when ALL rules evaluate true.
 * Evaluated by `evaluateShowIf` in `ClassEdit.ts`.
 */
export interface ShowIfRule {
  /** The question whose answer this rule checks */
  questionId: string
  operator: 'equals' | 'notEquals' | 'contains' | 'in'
  value: string | number | string[] | number[]
}

/** Links a supplementary question back to the theory question it supports for review. */
export interface SupplementaryLink {
  supportsQuestionId?: string | null
  supportsQuestionPublicId?: string
}

/** String-matching strategy for answer validation or search. */
export type MatchType = 'exact' | 'regex' | 'contains'

/** Canonical data type for a question's stored answer value. */
export type DataType =
  'STRING' | 'NUMBER' | 'STRING_ARRAY' | 'NUMBER_ARRAY' | 'DATE_TIME' | 'BOOLEAN' | 'FILE'

/**
 * The full definition of a single question as stored and served by the API.
 * `qType` is a numeric code looked up in `FORM_QUESTION_META` / `ASSESSMENT_QUESTION_META`
 * to determine which React component renders it.
 * Boolean-ish fields (`compulsory`, `readOnly`, `isTemplate`) use `0 | 1` for legacy compatibility.
 */
export type QuestionData = {
  qId: string | null
  clientId?: string
  name?: string
  /** 1 = this question is a reusable template; 0 = instance */
  isTemplate?: 0 | 1
  templateId?: string | null
  qIndex?: number
  /** Numeric question type code mapped to a renderer via the question meta registry */
  qType: number
  questionText: string
  placeholderText?: string | null
  tooltipText?: string | null
  /** 1 = answer is required before the form can be submitted */
  compulsory: 0 | 1
  readOnly?: 0 | 1
  options?: OptionData[]
  /** IDs of questions whose visibility this question controls */
  targets?: any[]
  links?: QuestionLink[]
  dataLink?: string[] | null
  meta?: FormQuestionMeta
  /** Fill-in-the-blank row definitions for gap-fill question types */
  blanks?: any
  value?: string | number | any[] | null
  /** Tokenised question text (used for `<<BP>>` and `<<IL:>>` tokens) */
  textTemplate?: any
  showIf?: ShowIfRule[]
  /** Ordered items for sequencing/ranking question types */
  items?: any
  correctAnswers?: string[] | null
  mappings?: any
  config?: any
  supplementaryLink?: SupplementaryLink
  defaultValue?: string | number | boolean | string[] | null
  dataType?: DataType
}

/** A named group of questions within a form, rendered as a visual section. */
export type GroupData = {
  gId: string | null
  clientId?: string
  isTemplate?: 0 | 1
  templateId?: string | null
  gIndex?: number
  targets?: any[]
  groupName: string
  /** 1 = render the group name as a visible heading */
  showGroupName?: 0 | 1 | boolean
  questions: QuestionData[]
}

/** The top-level form document structure as returned by the form API. */
export type FormData = {
  formCode: string
  formVersion: string
  formMinorVersion?: string
  approvedDate?: string
  formName: string
  isTemplate?: 0 | 1
  templateId?: string | null
  showFormName?: 0 | 1 | boolean
  showProgressBar?: 0 | 1 | boolean
  groups: GroupData[]
}

/**
 * A question in the form viewer's runtime state — extends `QuestionData` with
 * live response tracking and display overrides.
 */
export interface QuestionState extends QuestionData {
  /** The student's current answer for this question */
  response?: string | string[] | number | null
  /** Question text after token substitution (e.g. user's name injected) */
  resolvedQuestionText?: string
  /** Formatted value for read-only display (e.g. formatted date) */
  displayValue?: string
}

/**
 * Runtime state for a single form group — maps question IDs to their `QuestionState`.
 * `_sameAsResidential` is a special synthetic field for address copy-across logic.
 */
export type GroupDataState = {
  [qId: string]: QuestionState
} & {
  _sameAsResidential?: QuestionState
}

/** A single field within a composite address question. */
export type AddressField = {
  key: string
  label: string
  type?: 'text' | 'dropdown'
  options?: { label: string; value: string }[]
}

/** Question category tags used to group widgets in the form builder toolbox. */
export type FormQuestionCategory =
  | 'text'
  | 'contact'
  | 'name'
  | 'address(simple)'
  | 'address(residential)'
  | 'address(postal)'
  | 'date'
  | 'scale'
  | 'upload'
  | 'signature'
  | 'consent'
  | 'leadIn'
  | 'info'
  | 'number'
  | 'other'

/** How the response for a form question is typed and stored. */
export type FormDataType =
  'string' | 'date' | 'multi' | 'number' | 'object' | 'signature' | 'displayOnly' | 'file'

/** Extends `BaseQuestionMeta` with form-specific rendering and validation config. */
export interface FormQuestionMeta extends BaseQuestionMeta {
  inputType?: string
  validations?: string[]
  /** Roles that can see/interact with this question */
  userRoles?: string[]
  /** Field definitions for composite address questions */
  fields?: AddressField[]
  format?: string
  /** When true, the field is auto-populated from user profile data */
  autoFill?: boolean
  respectCompulsory?: boolean
  /** MIME type filter for file upload questions */
  accept?: string
  field?: string
  allowedDbTypes?: any
  /** True when this question renders multiple sub-inputs (e.g. full name) */
  composite?: boolean
  compositeTypes?: number[]
}

/**
 * The API payload shape used when creating or updating a form document.
 * `groups`, `questions`, and `options` are flattened lists — the builder normalises
 * the nested `FormData` tree before submitting.
 */
export type FormPayload = {
  code: string | null
  version: number | null
  minorVersion: number | null
  approvedDate: string | null
  name: string
  status: QAStatus
  showName?: 0 | 1 | boolean
  showProgress?: 0 | 1 | boolean
  groups: GroupData[]
  questions: QuestionData[]
  options: OptionData[]
  notification: boolean
  recipients: NotificationDetails[] | null
  qaRequired: boolean
  /** Percentage of submissions sampled for QA review (0–100) */
  qaSample: number
}

/** A node in the legislation reference tree (acts, parts, sections). */
export interface LegislationNode {
  id: number | string
  label: string
  /** Present only on leaf nodes — the data key stored when selected */
  key?: string
  children?: LegislationNode[]
  name?: string
}

/** The root entry in a legislation tree, grouping nodes under a named act or regulation. */
export interface LegislationRoot {
  id: number | string
  title: string
  children: LegislationNode[]
}

/** A flattened legislation reference for display in mapping panels. */
export interface UIMapping {
  id: number | string
  prettyId: string
  name: string
  legislationId?: string
  legislationTitle?: string
}

/** Raw legislation node as returned by the API before being shaped into `LegislationNode`. */
export interface RawLegislationNode {
  id: number
  uuid: string
  legislationId: string
  parentId: string | null
  type: string
  label: string
  name: string | null
  provision: string
}

/** A single option in a reusable preset option set, shared across multiple questions. */
export type PresetOption = {
  id: string
  presetId: string
  /** Display order within the preset set */
  index: number
  optionText: string
  dataLinks: any | null
  config: any | null
  /** Soft-delete flag; 1 = deleted */
  deleted: number
}

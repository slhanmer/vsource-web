/** Lifecycle state of a workflow instance. `STALE` indicates it was interrupted or abandoned. */
export type WorkflowStatus = 'CREATED' | 'STARTED' | 'COMPLETED' | 'STALE'

/**
 * An individual step within a classroom workflow, shown to trainers as an action item.
 * Steps are ordered by `priority` and resolved by the `eventTargets` list.
 */
export type WorkflowStep = {
  id: number
  classId: number
  /** Reference to the step definition in the workflow template */
  stepId?: number
  /** Named event that triggers this step (e.g. `'ENROLMENT_SIGNED'`) */
  eventName: string
  /** Human-readable instructions displayed to the trainer */
  instructions: string
  /** Relative path the trainer should navigate to in order to complete this step */
  link: string
  /** Lower value = higher priority in the display queue */
  priority: number
  /** User IDs or role keys that must act to resolve this step */
  eventTargets: string[]
  status: WorkflowStatus | null
  /** Optional JSON string with step-specific metadata */
  metaData?: string | null
}

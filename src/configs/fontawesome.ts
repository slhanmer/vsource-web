import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

// Import this module rather than the CSS directly. Without the static import the
// core injects its stylesheet from JS after first paint, and every icon renders
// at intrinsic size for a beat before snapping to 16px.
config.autoAddCss = false

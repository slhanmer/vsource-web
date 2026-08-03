import React, { useEffect } from 'react'
import type { Preview } from '@storybook/nextjs'

const preview: Preview = {
  decorators: [
    (Story) => {
      useEffect(() => {
        document.body.style.setProperty('--primary', '#533178')
        document.body.style.setProperty('--secondary', '#3d2460')
        document.body.style.setProperty('--highlight', '#6ab2e2')
        document.body.style.setProperty('--background', '#ffffff')
        document.body.style.setProperty('--backgroundDark', '#1a0f2e')
        document.body.style.setProperty('--font', '#1a0f2e')
        document.body.style.setProperty('--fontSecondary', '#533178')
        document.body.style.setProperty('--fontPlaceholder', '#9b89b0')
        document.body.style.setProperty('--highlightSubtle', '#bfdbfe')
        document.body.style.setProperty('--fontSubtle', '#94a3b8')
      }, [])
      return <Story />
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview

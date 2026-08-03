import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PDFViewer } from './PdfViewer'

const meta: Meta<typeof PDFViewer> = {
  title: 'ui-kit/PdfViewer',
  component: PDFViewer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'PDF viewer powered by pdf.js. Renders each page as a canvas with zoom, ' +
          'page navigation, optional magnifier, print, and download controls.',
      },
    },
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PDFViewer>

// Public domain sample PDF served from the Storybook static dir or a well-known URL
const SAMPLE_PDF = 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf'

export const Default: Story = {
  args: {
    file: SAMPLE_PDF,
  },
}

export const WithAllControls: Story = {
  args: {
    file: SAMPLE_PDF,
    showMagnify: true,
    showPrint: true,
    showDownload: true,
    downloadFileName: 'sample.pdf',
  },
}

export const WithMagnifier: Story = {
  args: {
    file: SAMPLE_PDF,
    showMagnify: true,
  },
}

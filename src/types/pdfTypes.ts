/**
 * Complete layout configuration for the PDF generation engine.
 * All numeric values are in the unit specified by `pdfSettings.measurementUnit`.
 * Colour tuples are RGB arrays in the range [0, 255].
 * This config is passed in full to the PDF renderer — adjust with care on a regulated product.
 */
export interface LayoutType {
  pdfSettings: {
    pageSize: string
    measurementUnit: 'mm' | 'pt' | 'px' | 'in' | 'cm' | 'ex' | 'em' | 'pc'
  }
  backgroundColour: [number, number, number]
  boxBackgroundColour: [number, number, number]
  pagePadding: number
  topOffset: number
  formNameBottomMargin: number
  headerMargin: number
  footerMargin: number
  footerHeight: number
  font: string
  marginX: number
  labelHeight: number
  lineHeight: number
  fallbackHeight: number
  weight: number
  offsetLabelY: number
  group: {
    borderColour: [number, number, number]
    headerBackgroundColour: [number, number, number]
    borderWidth: number
  }
  question: {
    leftOffset: number
    borderWidth: number
    borderRadius: number
    borderColour: [number, number, number]
    labelWidthFloor: number
  }
  textBox: {
    borderRadius: number
    shadowOffset: number
    shadowColour: [number, number, number]
  }
  requiredMark: {
    offsetX: number
    offsetY: number
    scale: number
    weight: number
    colour: [number, number, number]
  }
  images: {
    width: number
    height: number
    fallbackHeight: number
    margin: number
    aspectRatio: number
    signatureOffset: number
    signatureSize: number
    signaturePadding: number
    compressedImageWidth: number
    compressedImageHeight: number
  }
  scaleQuestion: {
    inputBox: {
      size: number
      marginY: number
      borderWidth: number
      borderRadius: number
      borderColour: [number, number, number]
    }
    checkMark: {
      offsetX: number
      offsetY: number
      scale: number
      weight: number
      colour: [number, number, number]
    }
    groupPadding: number
  }
  fontSize: {
    title: number
    group: number
    label: number
    text: number
    answer: number
    footer: number
  }
  spacing: {
    betweenGroups: number
    betweenFieldsX: number
    betweenFieldsY: number
    afterGroupHeader: number
    betweenLines: number
    groupTitle: number
    groupPaddingTop: number
  }
  box: {
    height: number
    padding: number
  }
  colour: {
    primary: [number, number, number]
    border: [number, number, number]
    divider: [number, number, number]
    secondaryBorder: [number, number, number]
    ocrMarks: [number, number, number]
    answer: [number, number, number]
  }
  minBoxWidth: number
  maxBoxWidth: number
}

export const theme = {
  colors: {
    primary: '#007bff',
    primaryHover: '#0056b3',
    text: '#23272f',
    textMuted: '#444',
    border: '#e1e4e8',
    surface: '#f8f9fbf7',
    background: '#23272f',
    backgroundDark: '#181c23',
    white: '#fff',
  },
  breakpoints: {
    mobile: 768,
    panelHidden: 900,
  },
  zIndex: {
    topBar: 10,
    overlay: 10,
    toolbar: 1200,
    toolbarToggle: 1201,
    popup: 2000,
  },
} as const;

export const TOOLTIP_LEAVE_DELAY_MS = 80;

export const DEFAULT_SAMPLE_ESSAY = `# Sample Essay

This is a sample essay that demonstrates the document viewer functionality. You can click the "Add Annotation" button in the toolbar and then click anywhere in the document to add annotations.

The document viewer supports:
- Adding annotations at specific points
- Editing annotation text
- Viewing all annotations
- Clean and modern UI

Feel free to experiment with the annotation features!`;

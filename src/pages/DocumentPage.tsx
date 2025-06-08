import React from 'react';
import DocumentViewer from '../components/DocumentViewer';

const DocumentPage: React.FC = () => {
  const sampleContent = `# Sample Essay

This is a sample essay that demonstrates the document viewer functionality. You can click the "Add Annotation" button in the toolbar and then click anywhere in the document to add annotations.

The document viewer supports:
- Adding annotations at specific points
- Editing annotation text
- Viewing all annotations
- Clean and modern UI

Feel free to experiment with the annotation features!`;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DocumentViewer content={sampleContent} />
    </div>
  );
};

export default DocumentPage; 
import React, { useState } from 'react';
import CodeCell from '../src/components/CodeCell';
import MarkdownCell from '../src/components/MarkdownCell';
import CopilotCell from './components/CopilotCell';
import FileUpload from './components/FileUpLoad';
import { KernelManager } from './components/KernelManager';

function App() {
  const [cells, setCells] = useState([]);

  const addCell = (type) => {
    setCells([...cells, { type, id: Math.random() }]);
  };

  return (
    <div>
      <FileUpload />
      <button onClick={() => addCell('code')}>Add Code Cell</button>
      <button onClick={() => addCell('markdown')}>Add Markdown Cell</button>
      <button onClick={() => addCell('ner')}>Add NER Cell</button>
      <KernelManager>
        {cells.map((cell) =>
          cell.type === 'code' ? (
            <CodeCell key={cell.id} />
          ) : cell.type === 'markdown' ? (
            <MarkdownCell key={cell.id} />
          ) : (
            <CopilotCell key={cell.id} />
          )
        )}
      </KernelManager>
      
    </div>
  );
}

export default App;
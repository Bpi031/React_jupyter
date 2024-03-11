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

  const deleteCell = (id) => {
    setCells(cells.filter(cell => cell.id !== id));
  };

  return (
    <div className="flex">
      <div className="flex-grow">
        <KernelManager>
          {cells.map((cell) =>
            <div key={cell.id}>
              {cell.type === 'code' ? (
                <CodeCell key={cell.id} />
              ) : cell.type === 'markdown' ? (
                <MarkdownCell key={cell.id} />
              ) : (
                <CopilotCell key={cell.id} />
              ) 
            }
            </div>
          )}
        </KernelManager>
      </div>
      <div className="fixed right-0 top-0 h-screen overflow-auto space-y-4 p-4 flex flex-col">
        <FileUpload />
        <button onClick={() => addCell('code')} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md">Add Code Cell</button>
        <button onClick={() => addCell('markdown')} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md">Add Markdown Cell</button>
        <button onClick={() => addCell('copilot')} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-md">Add NER Cell</button>
        {cells.map((cell) =>
          <button key={cell.id} onClick={() => deleteCell(cell.id)} className="w-full py-2 px-4 bg-red-500 text-white rounded-md">Delete</button>
        )}
      </div>
    </div>
  );
}

export default App;
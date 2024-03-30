import React, { useState, useContext} from 'react';
import AceEditor from 'react-ace';
import { KernelContext } from './KernelManager';
import CellOutput from './CellOutput';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-chrome';

function CodeCell() {
  const [code, setCode] = useState('');
  const socket = useContext(KernelContext);

  const handleExecute = () => {
    if (socket && socket.readyState === 1) {
      const executeMessage = {
        header: {
          msg_id: `execute_${Date.now()}`,
          msg_type: 'execute_request',
          username: '',
          session: '',
        },
        parent_header: {},
        metadata: {},  
        content: {
          code,
          silent: false,
          store_history: true,
          user_expressions: {},
          allow_stdin: false,
        },
      };
      socket.send(JSON.stringify(executeMessage));
    } else {
      console.error('WebSocket is not open: readyState ', socket.readyState);
    }
  };

  return (
    <div>
      
      <AceEditor
        mode="python"
        theme="chrome"
        onChange={setCode}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        width='100%'
        minLines={5}
        maxLines={Infinity}
      />
      <button 
        type="button" 
        className="text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-400"
        onClick={handleExecute} 
        disabled={!socket}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 2L6 22 18 12 6 2Z" />
        </svg>
      </button>
      {socket && <CellOutput socket={socket} />}
    </div>
  );
}

export default CodeCell;
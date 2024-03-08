import React, { useState, useContext } from 'react';
import AceEditor from 'react-ace';
import { KernelContext } from './KernelManager';
import CellOutput from './CellOutput';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

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
        theme="monokai"
        onChange={setCode}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />
      <button onClick={handleExecute} disabled={!socket}>
        Run
      </button>
      {socket && <CellOutput socket={socket} />}
    </div>
  );
}

export default CodeCell;
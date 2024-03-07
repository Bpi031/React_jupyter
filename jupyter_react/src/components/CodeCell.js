import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

function CodeCell() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [kernelId, setKernelId] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const createKernel = async () => {
      try {
        const response = await axios.post('http://localhost:8888/api/kernels?token=123456');
        setKernelId(response.data.id);
      } catch (error) {
        console.error('Failed to create kernel:', error);
      }
    };

    createKernel();
  }, []);

  useEffect(() => {
    if (kernelId) {
      const socket = new W3CWebSocket(`ws://localhost:8888/api/kernels/${kernelId}/channels?token=123456`);
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.header.msg_type === 'execute_result' || data.header.msg_type === 'stream') {
          setOutput(data.content.text);
        }
      };
      setSocket(socket);
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [kernelId]);

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
      <pre>{output}</pre>
    </div>
  );
}

export default CodeCell;
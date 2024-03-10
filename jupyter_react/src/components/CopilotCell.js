import React, { useState, useEffect, useContext } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import { marked } from 'marked';
import { KernelContext } from './KernelManager';
import CellOutput from './CellOutput';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

function CopilotCell() {
  const [file, setFile] = useState('')
  const [markdowncontent, setMarkdownContent] = useState('');
  const [codecontent, setCodeContent] = useState('');
  const [masked, setMasked] = useState('');
  const [html, setHtml] = useState('');
  const socket = useContext(KernelContext);

  const handleConvert = () => {
    const convertedHtml = marked(markdowncontent);
    setHtml(convertedHtml);
  };

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
              code: codecontent,
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleGenerateCode = async () => {
    try {
      const formData = new FormData();
      formData.append('sentence', markdowncontent);
      formData.append('file', file);

      console.log(markdowncontent, file);
      const response = await axios.post(`http://localhost:8000/request`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const generatedCode = response.data.content;
      const maskedCode = response.data.masked;
      setCodeContent(generatedCode);
      setMasked(maskedCode);
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  return (
    <div>
      <AceEditor
        mode="markdown"
        theme="monokai"
        onChange={setMarkdownContent}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        minLines={5}
        maxLines={Infinity}
      />
      <button onClick={handleConvert}>
        Convert
      </button>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleGenerateCode}>Generate Code</button>
      <pre>{masked}</pre>
      <AceEditor
        mode="python"
        theme="monokai"
        value={codecontent}
        onChange={setCodeContent}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        minLines={5}
        maxLines={Infinity}
      />
      <button onClick={handleExecute} disabled={!socket}>
        Run
      </button>
      {socket && <CellOutput socket={socket} />}
    </div>
  );
}

export default CopilotCell;
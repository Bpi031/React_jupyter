import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { marked } from 'marked';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

function CopilotCell() {
  const [file, setFile] = useState('')
  const [output, setOutput] = useState('');
  const [image, setImage] = useState(null);
  const [kernelId, setKernelId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [markdowncontent, setMarkdownContent] = useState('');
  const [codecontent, setCodeContent] = useState('');
  const [masked, setMasked] = useState('');
  const [html, setHtml] = useState('');

  const handleConvert = () => {
    const convertedHtml = marked(markdowncontent);
    setHtml(convertedHtml);
  };

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
      console.log(kernelId)
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.header.msg_type === 'execute_result' || data.header.msg_type === 'stream') {
          setOutput(data.content.text);
        } else if (data.header.msg_type === 'display_data') {
          setImage(data.content.data['image/png']);
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
      />
      <button onClick={handleExecute} disabled={!socket}>
        Run
      </button>
      <pre>{output}</pre>
      {image && <img src={`data:image/png;base64,${image}`} alt="plot" />}
    </div>
  );
}

export default CopilotCell;
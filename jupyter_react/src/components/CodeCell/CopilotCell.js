import React, { useState, useContext } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import { marked } from 'marked';
import { KernelContext } from './KernelManager';
import CellOutput from './CellOutput';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-chrome';

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
        theme="chrome"
        onChange={setMarkdownContent}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        width='100%'
        minLines={5}
        maxLines={Infinity}
      />
      <button 
        type="button" 
        className="text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-400"
        onClick={handleConvert}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 2L6 22 18 12 6 2Z" />
        </svg>
      </button>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <label 
        className="cursor-pointer text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-400"
      >
        <input type='file' onChange={handleFileChange} className="hidden" />
        Upload File
      </label>
      <button 
       type="button" 
       className="text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-400"
       onClick={handleGenerateCode}
       >Generate Code</button>
      <pre>{masked}</pre>
      <AceEditor
        mode="python"
        theme="chrome"
        value={codecontent}
        onChange={setCodeContent}
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

export default CopilotCell;
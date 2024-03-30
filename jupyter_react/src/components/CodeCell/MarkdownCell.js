import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { marked } from 'marked';

import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-chrome';

function MarkdownCell() {
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');

    const handleConvert = () => {
        const convertedHtml = marked(markdown);
        setHtml(convertedHtml);
    };

    return (
        <div>
            <AceEditor
                mode="markdown"
                theme="chrome"
                onChange={setMarkdown}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokwidth="2" d="M6 2L6 22 18 12 6 2Z" />
            </svg>
            </button>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}

export default MarkdownCell;
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { marked } from 'marked';

import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-monokai';

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
                theme="monokai"
                onChange={setMarkdown}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
            />
            <button onClick={handleConvert}>
                Convert
            </button>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}

export default MarkdownCell;
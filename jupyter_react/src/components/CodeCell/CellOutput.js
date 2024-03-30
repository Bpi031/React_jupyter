import React, { useState, useEffect } from 'react';

function CellOutput({ socket }) {
  const [output, setOutput] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        console.log('Server response:', message.data);
        const data = JSON.parse(message.data);
        if (data.header.msg_type === 'execute_result' || data.header.msg_type === 'stream') {
          console.log('Text output:', data.content.text);
          setOutput(prevOutput => prevOutput + '\n' + data.content.text);
        } else if (data.header.msg_type === 'display_data' && data.content.data['image/png']) {
          console.log('Image output:', data.content.data['image/png']);
          setImage(`data:image/png;base64,${data.content.data['image/png']}`);
        }
      };
    }
  }, [socket]);

  return (
    <div>
      <pre>{output}</pre>
      {image && <img src={image} alt="plot" />}
    </div>
  );
}

export default CellOutput;
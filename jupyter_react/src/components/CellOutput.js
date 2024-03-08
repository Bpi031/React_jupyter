import React, { useState, useEffect } from 'react';

function CellOutput({ socket }) {
  const [output, setOutput] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.header.msg_type === 'execute_result' || data.header.msg_type === 'stream') {
          setOutput(prevOutput => prevOutput + '\n' + data.content.text);
        } else if (data.header.msg_type === 'display_data') {
          setImage(data.content.data['image/png']);
        }
      };
    }
  }, [socket]);

  return (
    <div>
      <pre>{output}</pre>
      {image && <img src={`data:image/png;base64,${image}`} alt="plot" />}
    </div>
  );
}

export default CellOutput;
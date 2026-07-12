import { useState, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const MessageInput = ({ onSend, onTyping, onStopTyping }) => {
  const [text, setText] = useState('');
  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping?.();
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => onStopTyping?.(), 1500);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    onStopTyping?.();
  };

  return (
    <div style={{ padding:'16px', borderTop:'1px solid #e5e7eb', background:'#fff', display:'flex', gap:'8px', alignItems:'flex-end' }}>
      <textarea value={text} onChange={handleChange}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
        rows={1} placeholder="Type a message... (Enter to send)"
        className="input" style={{ flex:1, resize:'none', maxHeight:'128px' }} />
      <button onClick={handleSend} disabled={!text.trim()} className="btn btn-primary"
        style={{ flexShrink:0, display:'flex', alignItems:'center', gap:'6px' }}>
        <FaPaperPlane /> Send
      </button>
    </div>
  );
};

export default MessageInput;
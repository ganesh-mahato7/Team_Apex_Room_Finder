import { useState, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const COLORS = { primary: '#C9662D', text: '#3D2B1F', muted: '#8A7B6C', border: '#E8DCC8', bg: '#FAF3E7', white: '#FFFFFF' };

const MessageInput = ({ onSend, onTyping, onStopTyping }) => {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
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
    <div style={{ padding: '14px 16px', borderTop: `1px solid ${COLORS.border}`, background: COLORS.white, display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
      <div
        style={{
          flex: 1,
          background: COLORS.bg,
          border: `1.5px solid ${focused ? COLORS.primary : COLORS.border}`,
          borderRadius: '20px',
          padding: '4px 16px',
          transition: 'border-color 0.15s',
        }}
      >
        <textarea
          value={text}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          rows={1}
          placeholder="Type a message..."
          style={{ width: '100%', resize: 'none', maxHeight: '128px', border: 'none', outline: 'none', background: 'transparent', padding: '10px 0', fontSize: '14px', color: COLORS.text, fontFamily: 'inherit' }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        style={{
          flexShrink: 0,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: 'none',
          background: text.trim() ? COLORS.primary : COLORS.border,
          color: COLORS.white,
          cursor: text.trim() ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s',
        }}
      >
        <FaPaperPlane style={{ fontSize: '14px' }} />
      </button>
    </div>
  );
};

export default MessageInput;
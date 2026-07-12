import { formatTime } from '../../utils/helpers.js';

const COLORS = { primary: '#C9662D', text: '#3D2B1F', muted: '#8A7B6C', border: '#E8DCC8', bg: '#FAF3E7', white: '#FFFFFF' };

const MessageList = ({ messages, currentUserId, typingUsers }) => (
  <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: COLORS.bg }}>
    {messages.length === 0 && (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: COLORS.muted, fontSize: '13px' }}>Say hello 👋</p>
      </div>
    )}
    {messages.map((msg) => {
      const isMe = msg.sender_id === currentUserId;
      return (
        <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
          <div
            style={{
              maxWidth: '72%',
              padding: '10px 14px',
              borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              fontSize: '14px',
              lineHeight: 1.4,
              background: isMe ? COLORS.primary : COLORS.white,
              color: isMe ? COLORS.white : COLORS.text,
              border: isMe ? 'none' : `1px solid ${COLORS.border}`,
              boxShadow: '0 1px 2px rgba(61,43,31,0.05)',
            }}
          >
            {!isMe && (
              <p style={{ fontSize: '11px', fontWeight: 700, color: COLORS.primary, margin: '0 0 3px' }}>
                {msg.sender_name}
              </p>
            )}
            <p style={{ margin: 0, wordBreak: 'break-word' }}>{msg.content}</p>
            <p style={{ fontSize: '10px', margin: '4px 0 0', textAlign: 'right', color: isMe ? 'rgba(255,255,255,0.75)' : COLORS.muted }}>
              {formatTime(msg.created_at)}
            </p>
          </div>
        </div>
      );
    })}
    {typingUsers.length > 0 && (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: '16px 16px 16px 4px', padding: '10px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: '6px', height: '6px', borderRadius: '50%', background: COLORS.muted,
                animation: `roomfinder-bounce 1s ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
        <style>{`@keyframes roomfinder-bounce { 0%,60%,100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-4px); opacity: 1; } }`}</style>
      </div>
    )}
  </div>
);

export default MessageList;
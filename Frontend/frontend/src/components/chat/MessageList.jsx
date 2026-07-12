import { formatTime } from '../../utils/helpers.js';

const MessageList = ({ messages, currentUserId, typingUsers }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
    {messages.map((msg) => {
      const isMe = msg.sender_id === currentUserId;
      return (
        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'}`}>
            {!isMe && <p className="text-xs font-medium text-blue-600 mb-1">{msg.sender_name}</p>}
            <p>{msg.content}</p>
            <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>{formatTime(msg.created_at)}</p>
          </div>
        </div>
      );
    })}
    {typingUsers.length > 0 && (
      <div className="flex justify-start">
        <div className="bg-white border rounded-2xl rounded-bl-none px-4 py-2 text-sm text-gray-400 shadow-sm">typing...</div>
      </div>
    )}
  </div>
);

export default MessageList;
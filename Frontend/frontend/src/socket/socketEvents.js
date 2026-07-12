// Central place for socket.io event names.
// Keep this in sync with backend/sockets/chatSocket.js (or wherever initChatSocket lives).
// Importing these instead of typing raw strings prevents silent mismatches
// like 'send_message' vs 'send-message'.

export const SOCKET_EVENTS = {
  // client -> server
  JOIN_CHAT: 'join_chat',
  SEND_MESSAGE: 'send_message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',

  // server -> client
  JOINED_CHAT: 'joined_chat',
  RECEIVE_MESSAGE: 'receive_message',
  USER_TYPING: 'user_typing',
  USER_STOP_TYPING: 'user_stop_typing',
  ERROR: 'error',

  // connection lifecycle (built into socket.io, listed here for reference)
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
};
export const ROLES = { USER: 'user', LANDLORD: 'landlord', ADMIN: 'admin' };
export const ROOM_TYPES = ['single', 'shared', 'apartment', 'studio', 'house'];
export const VERIFICATION_STATUS = { NONE: 'none', PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' };
export const STATUS_COLORS = {
  pending:  'bg-yellow-100 text-yellow-800',
  active:   'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  removed:  'bg-gray-100 text-gray-800',
  approved: 'bg-green-100 text-green-800',
  open:     'bg-blue-100 text-blue-800',
  resolved: 'bg-gray-100 text-gray-800',
};
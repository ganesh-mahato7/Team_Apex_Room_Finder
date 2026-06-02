export const refreshSidebar = () => {
  window.dispatchEvent(new CustomEvent('sidebar-refresh'));
};
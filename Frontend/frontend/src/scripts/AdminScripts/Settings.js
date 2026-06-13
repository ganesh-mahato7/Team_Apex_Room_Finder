export const handleLogoChange = (e, setLogoPreview, setLogoName, setErrorMsg, setSuccessMsg) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    setErrorMsg('Only PNG, JPG, and SVG files are allowed.');
    setSuccessMsg('');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    setErrorMsg('File size must be under 2MB.');
    setSuccessMsg('');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setLogoPreview(reader.result);
    setLogoName(file.name);
    setErrorMsg('');
    setSuccessMsg('');
  };
  reader.readAsDataURL(file);
};

const broadcastLogo = () => {
  window.dispatchEvent(new Event('logo-updated'));
  // Also trigger storage event for cross-component sync
  window.dispatchEvent(new StorageEvent('storage', { key: 'adminLogo' }));
};

export const handleSaveLogo = (logoPreview, setErrorMsg, setSuccessMsg) => {
  if (!logoPreview) {
    setErrorMsg('Please select a logo first.');
    return;
  }
  localStorage.setItem('adminLogo', logoPreview);
  broadcastLogo();
  setSuccessMsg('Logo updated successfully!');
  setErrorMsg('');
};

export const handleRemoveLogo = (setLogoPreview, setLogoName, setSuccessMsg, setErrorMsg) => {
  localStorage.removeItem('adminLogo');
  broadcastLogo();
  setLogoPreview(null);
  setLogoName('');
  setSuccessMsg('Logo removed. Default logo restored.');
  setErrorMsg('');
};
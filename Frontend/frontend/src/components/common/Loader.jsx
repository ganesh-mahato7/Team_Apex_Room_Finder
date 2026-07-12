const SIZES = { sm: 20, md: 32, lg: 48 };

const Loader = ({ size = 'md', text = '' }) => {
  const px = SIZES[size] || SIZES.md;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
      <div
        style={{
          width: `${px}px`,
          height: `${px}px`,
          borderRadius: '50%',
          border: '3px solid #F3DDC9',
          borderBottomColor: '#C9662D',
          animation: 'roomfinder-spin 0.7s linear infinite',
        }}
      />
      {text && <p style={{ fontSize: '13px', color: '#8A7B6C', margin: 0 }}>{text}</p>}
      <style>{`@keyframes roomfinder-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loader;
const Logo = ({ size = 36, showText = true, className = '' }) => (
  <div className={className} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#C9662D" />
      <path d="M20 7L32 17.5H28V31H12V17.5H8L20 7Z" fill="#FAF3E7" />
      <circle cx="20" cy="22.5" r="2.4" fill="#C9662D" />
      <rect x="19.2" y="22.5" width="1.6" height="5" fill="#C9662D" />
    </svg>
    {showText && (
      <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: size * 0.5, color: '#3D2B1F', letterSpacing: '-0.01em' }}>
        Room<span style={{ color: '#C9662D', fontStyle: 'italic' }}>Finder</span>
      </span>
    )}
  </div>
);

export default Logo;
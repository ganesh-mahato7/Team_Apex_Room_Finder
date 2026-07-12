import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCamera, FaFileAlt, FaBuilding, FaLock, FaEye, FaEyeSlash,
         FaCheckCircle, FaClock, FaTimesCircle, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { STATUS_COLORS, VERIFICATION_STATUS } from '../../utils/constants.js';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPw, setChangingPw] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const [landlordDocs, setLandlordDocs] = useState({
    idType: 'citizenship', idImage: null, selfie: null,
    landDocument: null, buildingImage: null,
  });
  const [verifying, setVerifying] = useState(false);

  const [userDocs, setUserDocs] = useState({ idType: 'citizenship', idImage: null });
  const [verifyingUser, setVerifyingUser] = useState(false);

  // Always pull the real record from the server when this page loads —
  // avoids showing a stale local status (e.g. "pending" long after an
  // admin has already approved/rejected it elsewhere).
  useEffect(() => {
    api.get('/users/profile')
      .then(res => setUser(prev => ({ ...prev, ...res.data.data.user })))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', form);
      setUser({ ...user, ...res.data.data.user });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    if (pwForm.newPassword.length < 8) {
      return toast.error('New password must be at least 8 characters');
    }
    setChangingPw(true);
    try {
      // ⚠️ adjust '/auth/change-password' if your auth routes are mounted under a different prefix
      await api.post('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed. Please log in again on other devices.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPw({ current: false, next: false, confirm: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setChangingPw(false); }
  };

  const handleLandlordVerify = async (e) => {
    e.preventDefault();
    const { idImage, selfie, landDocument, buildingImage, idType } = landlordDocs;
    if (!idImage)       return toast.error('Please upload your ID image');
    if (!selfie)        return toast.error('Please upload a selfie with your ID');
    if (!landDocument)  return toast.error('Please upload your land document');
    if (!buildingImage) return toast.error('Please upload a building image');

    setVerifying(true);
    try {
      const fd = new FormData();
      fd.append('idType', idType);
      fd.append('idImage', idImage);
      fd.append('selfie', selfie);
      fd.append('landDocument', landDocument);
      fd.append('buildingImage', buildingImage);

      // ⚠️ DO NOT set Content-Type manually — let axios set it with the boundary
      await api.post('/users/verify', fd);

      toast.success('Documents submitted! Admin will review within 24-48 hours.');
      setUser({ ...user, verification_status: 'pending' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setVerifying(false); }
  };

  const handleUserVerify = async (e) => {
    e.preventDefault();
    if (!userDocs.idImage) return toast.error('Please upload your ID image');
    setVerifyingUser(true);
    try {
      const fd = new FormData();
      fd.append('idType', userDocs.idType);
      fd.append('idImage', userDocs.idImage);

      // ⚠️ DO NOT set Content-Type manually
      await api.post('/users/verify-identity', fd);

      toast.success('Identity submitted successfully.');
      setUser({ ...user, verification_status: 'pending' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setVerifyingUser(false); }
  };

  const verificationInfo = {
    approved: { icon: <FaCheckCircle style={{ color: '#566B4A' }} />, text: 'Verified — you can post rooms', bg: '#E5EADF', color: '#566B4A' },
    pending:  { icon: <FaClock style={{ color: '#B45309' }} />,       text: 'Under review — please wait 24-48 hours', bg: '#FEF3D9', color: '#B45309' },
    rejected: { icon: <FaTimesCircle style={{ color: '#C1442E' }} />, text: 'Rejected — please resubmit with valid documents', bg: '#FBE9E5', color: '#C1442E' },
    none:     { icon: <FaShieldAlt style={{ color: '#8A7B6C' }} />,   text: 'Not submitted yet', bg: '#F3E9D8', color: '#3D2B1F' },
  };
  const vInfo = verificationInfo[user?.verification_status] || verificationInfo.none;

  const FileInput = ({ label, icon, onChange, accept = 'image/*,application/pdf', file }) => (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: '#3D2B1F', marginBottom: '4px' }}>
        {icon} {label}
      </label>
      <input type="file" accept={accept} onChange={onChange}
        style={{ display: 'block', width: '100%', padding: '8px', border: '1px solid #E8DCC8', borderRadius: '10px', fontSize: '13px', color: '#3D2B1F', cursor: 'pointer', background: '#fff' }} />
      {file && (
        <p style={{ fontSize: '12px', color: '#566B4A', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FaCheckCircle /> {file.name}
        </p>
      )}
    </div>
  );

  // Password input with an eye toggle button to show/hide the value
  const PasswordInput = ({ label, value, onChange, visible, onToggle }) => (
    <div>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#3D2B1F', marginBottom: '4px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="input"
          required
          minLength={8}
          style={{ paddingRight: '40px' }}
        />
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: '#8A7B6C',
            display: 'flex', alignItems: 'center', padding: 0,
          }}
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '672px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#3D2B1F', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaUser style={{ color: '#C9662D' }} /> My Profile
      </h1>

      {/* Personal Info */}
      <div className="card">
        <h2 style={{ fontWeight: 600, color: '#3D2B1F', marginBottom: '16px' }}>Personal Info</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#3D2B1F', marginBottom: '4px' }}>Name</label>
            <div style={{ position: 'relative' }}>
              <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7B6C' }} />
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input" required style={{ paddingLeft: '36px' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#3D2B1F', marginBottom: '4px' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7B6C' }} />
              <input value={user?.email} disabled className="input"
                style={{ paddingLeft: '36px', background: '#FAF3E7', color: '#8A7B6C' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#3D2B1F', marginBottom: '4px' }}>Phone</label>
            <div style={{ position: 'relative' }}>
              <FaPhone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7B6C' }} />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="input" style={{ paddingLeft: '36px' }} placeholder="+977 98XXXXXXXX" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="card">
        <h2 style={{ fontWeight: 600, color: '#3D2B1F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaLock style={{ color: '#C9662D' }} /> Change Password
        </h2>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PasswordInput
            label="Current Password"
            value={pwForm.currentPassword}
            onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            visible={showPw.current}
            onToggle={() => setShowPw({ ...showPw, current: !showPw.current })}
          />
          <PasswordInput
            label="New Password"
            value={pwForm.newPassword}
            onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
            visible={showPw.next}
            onToggle={() => setShowPw({ ...showPw, next: !showPw.next })}
          />
          <PasswordInput
            label="Confirm New Password"
            value={pwForm.confirmPassword}
            onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
            visible={showPw.confirm}
            onToggle={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}
          />
          <button type="submit" disabled={changingPw} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            {changingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* LANDLORD VERIFICATION */}
      {user?.role === 'landlord' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: 600, color: '#3D2B1F', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaShieldAlt style={{ color: '#C9662D' }} /> Landlord Verification
            </h2>
            <span className={`badge ${STATUS_COLORS[user.verification_status] || 'bg-gray-100 text-gray-600'}`}
              style={{ textTransform: 'capitalize' }}>
              {user.verification_status}
            </span>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '10px', background: vInfo.bg, color: vInfo.color,
            fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            {vInfo.icon} {vInfo.text}
          </div>

          {user.verification_status === VERIFICATION_STATUS.PENDING && (
            <p style={{ fontSize: '13px', color: '#8A7B6C' }}>
              Your documents are under review. You'll receive an email once the admin decides.
            </p>
          )}

          {[VERIFICATION_STATUS.NONE, VERIFICATION_STATUS.REJECTED].includes(user.verification_status) && (
            <>
              <div style={{ background: '#FBF0E8', border: '1px solid #F3DDC9', borderRadius: '10px',
                padding: '14px 16px', marginBottom: '20px' }}>
                <p style={{ fontWeight: 600, color: '#A8511F', margin: '0 0 8px', fontSize: '14px' }}>
                  Required Documents (all 4 are mandatory)
                </p>
                <ul style={{ margin: 0, padding: '0 0 0 18px', color: '#3D2B1F', fontSize: '13px', lineHeight: '2' }}>
                  <li><strong>ID Image</strong> — Citizenship card, Passport, or Driving License</li>
                  <li><strong>Selfie with ID</strong> — Photo of you holding your ID document</li>
                  <li><strong>Land Document</strong> — Lalpurja or ownership certificate</li>
                  <li><strong>Building Image</strong> — Clear exterior photo of the property</li>
                </ul>
              </div>

              <form onSubmit={handleLandlordVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#3D2B1F', marginBottom: '4px' }}>
                    ID Type
                  </label>
                  <select value={landlordDocs.idType}
                    onChange={e => setLandlordDocs({ ...landlordDocs, idType: e.target.value })}
                    className="input">
                    <option value="citizenship">Citizenship Card</option>
                    <option value="passport">Passport</option>
                    <option value="license">Driving License</option>
                  </select>
                </div>

                <FileInput label="ID Image *" icon={<FaIdCard />}
                  file={landlordDocs.idImage}
                  onChange={e => setLandlordDocs({ ...landlordDocs, idImage: e.target.files[0] || null })} />

                <FileInput label="Selfie with ID *" icon={<FaCamera />}
                  accept="image/*"
                  file={landlordDocs.selfie}
                  onChange={e => setLandlordDocs({ ...landlordDocs, selfie: e.target.files[0] || null })} />

                <FileInput label="Land Document (Lalpurja) *" icon={<FaFileAlt />}
                  file={landlordDocs.landDocument}
                  onChange={e => setLandlordDocs({ ...landlordDocs, landDocument: e.target.files[0] || null })} />

                <FileInput label="Building / Property Image *" icon={<FaBuilding />}
                  accept="image/*"
                  file={landlordDocs.buildingImage}
                  onChange={e => setLandlordDocs({ ...landlordDocs, buildingImage: e.target.files[0] || null })} />

                <button type="submit" disabled={verifying} className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaShieldAlt /> {verifying ? 'Uploading documents...' : 'Submit for Verification'}
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* USER IDENTITY VERIFICATION */}
      {user?.role === 'user' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: 600, color: '#3D2B1F', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaIdCard style={{ color: '#C9662D' }} /> Identity Verification
              <span style={{ fontSize: '12px', fontWeight: 400, color: '#8A7B6C' }}>(Optional)</span>
            </h2>
            {user.verification_status !== 'none' && (
              <span className={`badge ${STATUS_COLORS[user.verification_status] || 'bg-gray-100 text-gray-600'}`}>
                {user.verification_status}
              </span>
            )}
          </div>

          <p style={{ fontSize: '13px', color: '#8A7B6C', marginBottom: '16px' }}>
            Verifying your identity builds trust with landlords. Upload any government-issued ID.
          </p>

          {user.verification_status === 'approved' ? (
            <p style={{ color: '#566B4A', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaCheckCircle /> Identity verified
            </p>
          ) : user.verification_status === 'pending' ? (
            <p style={{ color: '#B45309', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaClock /> Under review
            </p>
          ) : (
            <form onSubmit={handleUserVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#3D2B1F', marginBottom: '4px' }}>
                  ID Type
                </label>
                <select value={userDocs.idType}
                  onChange={e => setUserDocs({ ...userDocs, idType: e.target.value })}
                  className="input">
                  <option value="citizenship">Citizenship Card</option>
                  <option value="passport">Passport</option>
                  <option value="license">Driving License</option>
                </select>
              </div>
              <FileInput label="ID Image" icon={<FaIdCard />}
                accept="image/*,application/pdf"
                file={userDocs.idImage}
                onChange={e => setUserDocs({ ...userDocs, idImage: e.target.files[0] || null })} />
              <button type="submit" disabled={verifyingUser} className="btn btn-primary"
                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaIdCard /> {verifyingUser ? 'Submitting...' : 'Verify My Identity'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
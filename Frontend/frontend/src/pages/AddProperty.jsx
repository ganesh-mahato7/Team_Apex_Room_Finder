import "../css/AddProperty.css";

import {
  FiHome, FiMapPin, FiPhone, FiMail, FiDollarSign,
  FiUpload, FiX, FiCheck, FiArrowLeft, FiPlus
} from "react-icons/fi";
import {
  MdApartment, MdOtherHouses, MdWifi,
  MdLocalParking, MdWater, MdKitchen
} from "react-icons/md";
import { BiBuildingHouse } from "react-icons/bi";

import {
  useAddPropertyLogic,
  propertyTypes,
  facilityOptions,
} from "../scripts/AddProperty";    

const typeIcons = {
  room:      <BiBuildingHouse size={22} />,
  apartment: <MdApartment size={22} />,
  flat:      <MdOtherHouses size={22} />,
};

const facilityIcons = {
  wifi:    <MdWifi size={18} />,
  parking: <MdLocalParking size={18} />,
  water:   <MdWater size={18} />,
  kitchen: <MdKitchen size={18} />,
};

function AddProperty() {
  const {
    form,
    images,
    errors,
    submitted,
    handleChange,
    toggleFacility,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,
    goHome,
    goBack,
    goSignIn,
    goRooms,
  } = useAddPropertyLogic();

  //  Success Screen 
  if (submitted) {
    return (
      <div className="success-screen">
        <div className="success-card">
          <div className="success-icon"><FiCheck size={36} /></div>
          <h2>Property Listed!</h2>
          <p>Your property <strong>"{form.title}"</strong> has been submitted successfully.</p>
          <p className="success-note">We will contact you at <strong>{form.email}</strong> soon.</p>
          <div className="success-actions">
            <button className="btn-primary" onClick={goHome}>Back to Home</button>
            <button className="btn-outline" onClick={resetForm}>Add Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-container">

      {/* NAVBAR */}
      <header className="add-navbar">
        <div className="add-logo" onClick={goHome}>
          <span className="logo-dot"></span>
          RoomFinder
        </div>
        <nav className="add-nav-links">
          <button onClick={goHome}>Home</button>
          <button onClick={goRooms}>Rooms</button>
        </nav>
        <button className="signin-link" onClick={goSignIn}>Sign In</button>
      </header>

      {/* PAGE HEADER */}
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FiArrowLeft size={16} /> Back
        </button>
        <div className="page-header-text">
          <h1>List Your Property</h1>
          <p>Fill in the details below to list your property on RoomFinder</p>
        </div>
      </div>

      {/* FORM */}
      <div className="form-container">

        {/* STEP 1 — Property Type */}
        <div className="card">
          <div className="card-header">
            <span className="step-badge">1</span>
            <h3>Property Type</h3>
          </div>
          <p className="card-desc">What kind of property are you listing?</p>
          <div className="type-options">
            {propertyTypes.map((t) => (
              <button
                key={t.value}
                className={`type-btn ${form.type === t.value ? "active" : ""}`}
                onClick={() => handleChange("type", t.value)}
              >
                {typeIcons[t.value]} {t.label}
              </button>
            ))}
          </div>
          {errors.type && <p className="error">{errors.type}</p>}
        </div>

        {/* STEP 2 — Facilities */}
        <div className="card">
          <div className="card-header">
            <span className="step-badge">2</span>
            <h3>Facilities</h3>
          </div>
          <p className="card-desc">Select all available facilities</p>
          <div className="facilities-grid">
            {facilityOptions.map((f) => (
              <button
                key={f.value}
                className={`facility-btn ${form.facilities.includes(f.value) ? "active" : ""}`}
                onClick={() => toggleFacility(f.value)}
              >
                {facilityIcons[f.value]} {f.label}
                {form.facilities.includes(f.value) && (
                  <FiCheck size={14} className="facility-check" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 3 — Location */}
        <div className="card">
          <div className="card-header">
            <span className="step-badge">3</span>
            <h3>Location</h3>
          </div>
          <p className="card-desc">Where is the property located?</p>
          <div className={`input-wrap ${errors.location ? "error-border" : ""}`}>
            <FiMapPin className="input-icon" />
            <input
              type="text"
              placeholder="e.g. Kathmandu, Baneshwor"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
          {errors.location && <p className="error">{errors.location}</p>}
        </div>

        {/* STEP 4 — Title & Description */}
        <div className="card">
          <div className="card-header">
            <span className="step-badge">4</span>
            <h3>Property Details</h3>
          </div>

          <label className="field-label">Property Title</label>
          <div className={`input-wrap ${errors.title ? "error-border" : ""}`}>
            <FiHome className="input-icon" />
            <input
              type="text"
              placeholder="e.g. Cozy Room in Thamel"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          {errors.title && <p className="error">{errors.title}</p>}

          <label className="field-label" style={{ marginTop: 16 }}>Description</label>
          <textarea
            className={`textarea ${errors.description ? "error-border" : ""}`}
            placeholder="Describe your property — size, nearby landmarks, rules, etc."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        {/* STEP 5 — Images */}
        <div className="card">
          <div className="card-header">
            <span className="step-badge">5</span>
            <h3>Property Images</h3>
          </div>
          <p className="card-desc">Upload up to 5 clear photos of your property</p>

          <input
            id="property-images"
            type="file"
            accept="image/jpeg, image/png, image/jpg, image/webp"
            multiple
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <label htmlFor="property-images" className="upload-box">
            <FiUpload size={28} />
            <p>Click to upload images</p>
            <span>JPG, PNG — max 5 images</span>
          </label>

          {errors.images && <p className="error">{errors.images}</p>}

          {images.length > 0 && (
            <div className="image-previews">
              {images.map((img, i) => (
                <div className="preview-item" key={i}>
                  <img src={img.url} alt={img.name} />
                  <button
                    type="button"
                    className="remove-img"
                    onClick={() => removeImage(i)}
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label htmlFor="property-images" className="preview-add">
                  <FiPlus size={22} />
                </label>
              )}
            </div>
          )}
        </div>

        {/* STEP 6 — Contact & Rent */}
        <div className="card">
          <div className="card-header">
            <span className="step-badge">6</span>
            <h3>Contact & Pricing</h3>
          </div>

          <div className="two-col">
            <div>
              <label className="field-label">Mobile Number</label>
              <div className={`input-wrap ${errors.mobile ? "error-border" : ""}`}>
                <FiPhone className="input-icon" />
                <input
                  type="text"
                  placeholder="98XXXXXXXX"
                  value={form.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                />
              </div>
              {errors.mobile && <p className="error">{errors.mobile}</p>}
            </div>

            <div>
              <label className="field-label">Rent Amount (NPR/month)</label>
              <div className={`input-wrap ${errors.rent ? "error-border" : ""}`}>
                <FiDollarSign className="input-icon" />
                <input
                  type="number"
                  placeholder="e.g. 8000"
                  value={form.rent}
                  onChange={(e) => handleChange("rent", e.target.value)}
                />
              </div>
              {errors.rent && <p className="error">{errors.rent}</p>}
            </div>
          </div>

          <label className="field-label" style={{ marginTop: 16 }}>Email Address</label>
          <div className={`input-wrap ${errors.email ? "error-border" : ""}`}>
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {/* ACTION BUTTONS */}
        <div className="form-actions">
          <button className="cancel-btn" onClick={goBack}>Cancel</button>
          <button className="submit-btn" onClick={handleSubmit}>
            <FiCheck size={16} style={{ marginRight: 6 }} />
            Submit Property
          </button>
        </div>

      </div>
    </div>
  );
}

export default AddProperty;
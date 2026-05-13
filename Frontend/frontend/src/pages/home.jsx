import "./Home.css";

const Home = ({
  properties,
  showForm,
  setShowForm,
  formData,
  setFormData,
  handleAddProperty,
}) => {
  return (
    <div className="home">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo-section">
          <div className="logo-box"></div>
          <h1>Nepal Rental App</h1>
        </div>

        <button className="signin-btn">
          Sign In
        </button>

      </nav>

      {/* Categories */}
      <section className="category-section">

        <div className="categories">

          <div className="category-card">
            <span>🛏️</span>
            <p>Room</p>
          </div>

          <div className="category-card">
            <span>🏢</span>
            <p>Apartment</p>
          </div>

          <div className="category-card">
            <span>🏠</span>
            <p>Flat</p>
          </div>

        </div>

        <button
          className="add-property-btn"
          onClick={() => setShowForm(!showForm)}
        >
          Add Property +
        </button>

      </section>

      {/* Add Property Form */}
      {showForm && (

        <section className="form-wrapper">

          <h2>Add New Property</h2>

          <div className="form-grid">

            <input
              type="text"
              placeholder="Property Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: e.target.value,
                })
              }
            />

            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value,
                })
              }
            >
              <option>Apartment</option>
              <option>Room</option>
              <option>Flat</option>
            </select>

            <input
              type="text"
              placeholder="Optional Image URL"
              value={formData.image}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.value,
                })
              }
            />

          </div>

          <button
            className="save-btn"
            onClick={handleAddProperty}
          >
            Save Property
          </button>

        </section>

      )}

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-background">

          <div className="search-box">

            <div className="search-content">

              <p>What are you looking for?</p>

              <div className="search-input">

                <input
                  type="text"
                  placeholder="Search for Places, Property Types..."
                />

                <button>🔍</button>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Explore Section */}
      <section className="explore-section">

        <h2>Explore Properties</h2>

        {properties.length === 0 ? (

          <div className="empty-properties">
            <p>No Properties Added Yet</p>
          </div>

        ) : (

          <div className="property-grid">

            {properties.map((property) => (

              <div
                className="property-card"
                key={property.id}
              >

                {property.image ? (

                  <img
                    src={property.image}
                    alt={property.title}
                    className="property-image"
                  />

                ) : (

                  <div className="property-image-placeholder">
                    <span>Property Image</span>
                  </div>

                )}

                <div className="property-content">

                  <h3>{property.title}</h3>

                  <p>📍 {property.location}</p>

                  <span>{property.type}</span>

                  <button>
                    View Details
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default Home;
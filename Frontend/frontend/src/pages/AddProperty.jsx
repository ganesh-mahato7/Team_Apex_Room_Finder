import React from "react";
import "./AddProperty.css";

function AddProperty() {
  return (
    <div className="add-container">

      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <div className="diamond"></div>
          <h2>Nepal Rental App</h2>
        </div>

        <a href="#" className="signin">Sign In</a>
      </header>


      <div className="form-container">

        {/* Property Type */}
        <div className="card">
          <h4>List Your Property</h4>
          <p className="label">Select Property Type</p>

          <div className="type-options">
            <label><input type="radio" name="type"/> Room</label>
            <label><input type="radio" name="type"/> Apartment</label>
            <label><input type="radio" name="type"/> Flat</label>
          </div>
        </div>


        {/* Facilities */}
        <div className="card">
          <p className="label">Select Facilities</p>

          <div className="facilities">
            <label><input type="checkbox"/> Wifi</label>
            <label><input type="checkbox"/> Parking</label>
            <label><input type="checkbox"/> Water</label>
            <label><input type="checkbox"/> Kitchen</label>
          </div>
        </div>


        {/* Location */}
        <div className="card">
          <p className="label">Property Location</p>
          <input type="text" placeholder="Enter Location" className="input"/>
        </div>


        {/* Title + Description */}
        <div className="card">
          <p className="label">Property Title</p>
          <input type="text" placeholder="Enter Property Title" className="input"/>

          <p className="label">Description</p>
          <textarea className="textarea"></textarea>
        </div>


        {/* Image Upload */}
        <div className="card">
          <p className="label">Property Image</p>

          <div className="upload-box">
            Click to Upload Property Image
          </div>
        </div>


        {/* Guidelines */}
        <div className="card">
          <p className="label">Image Guidelines</p>
          <p className="guide">
            Upload clear images of your property. Maximum 5 images allowed.
          </p>
        </div>


        {/* Contact Details */}
        <div className="card">
          <div className="row">
            <div className="col">
              <p className="label">Mobile Number</p>
              <input type="text" className="input"/>
            </div>

            <div className="col">
              <p className="label">Rent Amount</p>
              <input type="text" className="input"/>
            </div>
          </div>

          <p className="label">Email</p>
          <input type="text" className="input"/>
        </div>

      </div>

    </div>
  );
}

export default AddProperty;
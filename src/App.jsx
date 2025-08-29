import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    dob: "",
    password: "",
    confirmPassword: "",
    passkey: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);

  // Live update + validate single field
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = validateField(name, newValue, {
      ...formData,
      [name]: newValue,
    });
    setErrors((prev) => ({ ...prev, [name]: fieldError }));

    // if password changed, re-check confirmPassword
    if (name === "password" && touched.confirmPassword) {
      const confirmErr = validateField(
        "confirmPassword",
        formData.confirmPassword,
        { ...formData, password: newValue }
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, newValue, formData);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateField = (name, value, allValues) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email (e.g., you@site.com)";
        return "";
      case "phone":
        if (!value) return "Phone is required";
        if (!/^\d{10}$/.test(value)) return "Phone must be 10 digits";
        return "";
      case "country":
        if (!value) return "Please select a country";
        return "";
      case "dob":
        if (!value) return "Date of birth is required";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Confirm password is required";
        if (value !== (allValues.password ?? formData.password))
          return "Passwords do not match";
        return "";
      case "passkey":
        // passkey is optional unless user forgot password — but validate if entered
        if (value && value.length < 6) return "Passkey should be 6+ characters";
        return "";
      case "terms":
        if (!value) return "You must accept the terms";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key], formData);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // mark all touched so errors appear
    const allTouched = {};
    Object.keys(formData).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);

    if (validateAll()) {
      // submit action here
      alert("🎉 Form submitted successfully");
      // optionally reset form
      // setFormData({ firstName: "", lastName: "", ... });
    }
  };

  const showErrorFor = (name) => !!errors[name] && (touched[name] || submitAttempted);

  return (
    <div className="form-container soft-mint">
      <h2 className="form-title">Create Account</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Row 1 */}
        <div className="row">
          <div className="input-group">
            <label>First Name *</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showErrorFor("firstName") ? "error-input" : ""}
              placeholder=""
            />
            {showErrorFor("firstName") && <p className="error">{errors.firstName}</p>}
          </div>

          <div className="input-group">
            <label>Last Name *</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showErrorFor("lastName") ? "error-input" : ""}
              placeholder=""
            />
            {showErrorFor("lastName") && <p className="error">{errors.lastName}</p>}
          </div>
        </div>

        {/* Row 2 */}
        <div className="row">
          <div className="input-group">
            <label>Email *</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showErrorFor("email") ? "error-input" : ""}
              placeholder="Email address"
            />
            {showErrorFor("email") && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Phone *</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showErrorFor("phone") ? "error-input" : ""}
              placeholder=""
            />
            {showErrorFor("phone") && <p className="error">{errors.phone}</p>}
          </div>
        </div>

        {/* Row 3 */}
        <div className="row">
          <div className="input-group">
            <label>Country *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showErrorFor("country") ? "error-input" : ""}
            >
              <option value="">Select…</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
            {showErrorFor("country") && <p className="error">{errors.country}</p>}
          </div>

          <div className="input-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showErrorFor("dob") ? "error-input" : ""}
            />
            {showErrorFor("dob") && <p className="error">{errors.dob}</p>}
          </div>
        </div>

        {/* Row 4 */}
        <div className="row">
          <div className="input-group">
            <label>Password *</label>
            <div className="password-row">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={showErrorFor("password") ? "error-input" : ""}
                placeholder="Password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="toggle password"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {showErrorFor("password") && <p className="error">{errors.password}</p>}
          </div>

          <div className="input-group">
            <label>Confirm Password *</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={showErrorFor("confirmPassword") ? "error-input" : ""}
              placeholder="Confirm password"
            />
            {showErrorFor("confirmPassword") && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Row 5 */}
        <div className="row">
          <div className="input-group">
            <label>
              Passkey (for password recovery) — <small className="small-muted">Just enter</small>
            </label>
            <div className="password-row">
              <input
                name="passkey"
                type={showPasskey ? "text" : "password"}
                value={formData.passkey}
                onChange={handleChange}
                onBlur={handleBlur}
                className={showErrorFor("passkey") ? "error-input" : ""}
                placeholder="Passkey (if applicable)"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPasskey((s) => !s)}
                aria-label="toggle passkey"
              >
                {showPasskey ? "Hide" : "Show"}
              </button>
            </div>
            {showErrorFor("passkey") && <p className="error">{errors.passkey}</p>}
          </div>

          <div className="input-group checkbox-wrap">
            <label style={{ marginBottom: 8 }}>Agreement</label>
            <div className="checkbox-group">
              <input
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="small-muted">I agree to Terms & Conditions</span>
            </div>
            {showErrorFor("terms") && <p className="error">{errors.terms}</p>}
          </div>
        </div>

        <div className="submit-row">
          <button className="submit-btn" type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;

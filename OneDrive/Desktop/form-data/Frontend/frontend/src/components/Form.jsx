import React, { useState } from 'react';
import axios from 'axios';
import './form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    year: '',
    goal: '',
    message: ''
  });
  const [responseMsg, setResponseMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMsg('');
    
    try {
      const res = await axios.post('http://localhost:5000/form', formData);
      if (res.data.success) {
        setResponseMsg(`🎉 Thank you, ${formData.name}! Your response has been recorded.`);
        setFormData({ name: '', email: '', college: '', year: '', goal: '', message: '' });
      } else {
        setResponseMsg('❌ Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setResponseMsg(`❌ Error: ${err.response?.data?.error || 'Failed to submit form'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>📋 Quick Survey</h2>
          <p>Hey! Please fill this quick survey. We'd love to know more about you.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="survey-form">
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="college">College Name *</label>
            <input
              type="text"
              id="college"
              name="college"
              placeholder="Enter your college name"
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Year of Study *</label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              <option value="">Select your year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduate">Graduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="goal">What is your goal? *</label>
            <textarea
              id="goal"
              name="goal"
              placeholder="Tell us about your goals and aspirations..."
              value={formData.goal}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Additional Message *</label>
            <textarea
              id="message"
              name="message"
              placeholder="Any additional thoughts or feedback..."
              value={formData.message}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? '⏳ Submitting...' : 'Submit Survey'}
          </button>
        </form>

        {responseMsg && (
          <div className={`response-message ${responseMsg.includes('🎉') ? 'success' : 'error'}`}>
            {responseMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  ChevronLeft, ChevronRight, Loader2, Sparkles, Send, CheckCircle2, AlertCircle, ChevronDown, 
  Globe, Brain, Smartphone, Cloud, Shield, Link2, Gamepad2, Palette, BarChart3, TrendingUp, GraduationCap 
} from 'lucide-react';
import { supabase } from '../lib/supabase-browser';

const FORM_STEPS = [
  { id: 0, title: 'Who are you?' },
  { id: 1, title: 'Academic Info' },
  { id: 2, title: 'Links' },
  { id: 3, title: 'Technical Info' },
  { id: 4, title: 'Motivation' }
];

const CustomSelect = ({ options, value, onChange, placeholder, error, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="custom-select-container" ref={containerRef}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''} ${error ? 'error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="trigger-content">
          {selectedOption ? (
            <>
              {selectedOption.icon && <selectedOption.icon size={18} className="option-icon-active" />}
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={18} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="custom-select-menu"
            onWheel={(e) => e.stopPropagation()}
          >
            {options.map((opt) => (
              <div 
                key={opt.value}
                className={`custom-select-option ${value === opt.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange({ target: { name: containerRef.current.parentElement.getAttribute('data-name') || 'select', value: opt.value } });
                  setIsOpen(false);
                }}
              >
                {opt.icon && <opt.icon size={16} className="option-icon" />}
                <span>{opt.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const ApplyPage = () => {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' }); // 'success', 'error'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    year: '',
    linkedin: '',
    github: '',
    portfolio: '',
    domain: '',
    tech_stack: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validateStep = (step) => {
    let newErrors = {};
    
    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    if (step === 1) {
      if (!formData.college.trim()) newErrors.college = 'College name is required';
      if (!formData.year) newErrors.year = 'Please select your year';
    }
    
    if (step === 2) {
      const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

      if (!formData.linkedin.trim()) {
        newErrors.linkedin = 'LinkedIn profile is required';
      } else if (!urlRegex.test(formData.linkedin)) {
        newErrors.linkedin = 'Please enter a valid LinkedIn URL';
      }
      
      if (!formData.github.trim()) {
        newErrors.github = 'GitHub profile is required';
      } else if (!urlRegex.test(formData.github)) {
        newErrors.github = 'Please enter a valid GitHub URL';
      }

      if (formData.portfolio.trim() && !urlRegex.test(formData.portfolio)) {
        newErrors.portfolio = 'Please enter a valid URL';
      }
    }
    
    if (step === 3) {
      if (!formData.domain) newErrors.domain = 'Please select a domain';
      if (!formData.tech_stack.trim()) newErrors.tech_stack = 'Tech stack is required';
    }
    
    if (step === 4) {
      if (!formData.reason.trim()) newErrors.reason = 'Please tell us why you want to join';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const { error } = await supabase
        .from('applications')
        .insert([formData]);

      if (error) throw error;

      setStatus({ type: 'success', message: 'Application submitted successfully 🚀' });
      // Reset after success
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => router.push('/'), 400);
      }, 3000);
      
    } catch (error) {
      console.error('Submission Error:', error);
      setStatus({ type: 'error', message: 'Submission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (status.type === 'success') {
    return (
      <motion.div 
        className="apply-container"
        animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? 20 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          className="success-overlay"
          style={{ maxWidth: '600px', width: '90%', padding: '5rem 3rem' }}
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="success-icon-wrapper"
            style={{ marginBottom: '3rem' }}
          >
            <CheckCircle2 size={100} color="#7B61FF" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 20px rgba(123,97,255,0.4))' }} />
          </motion.div>
          
          <h2 style={{ fontSize: '4.5rem', fontWeight: 950, marginBottom: '1.5rem', letterSpacing: '-0.05em', background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SUCCESS
          </h2>
          
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '3.5rem' }}>
            Your spark has been received. Our catalysts will <br />
            analyze your data and reach out via the void soon.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => router.push('/'), 400);
            }}
            className="nav-btn-submit"
            style={{ width: 'auto', padding: '1.2rem 3rem' }}
          >
            RETURN_TO_BASE
          </motion.button>
          
          <div className="auto-redirect" style={{ marginTop: '2.5rem', opacity: 0.3, letterSpacing: '0.1em' }}>
            AUTO_SIGNAL_IN 3S
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="apply-container"
      animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? 20 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="apply-content">
        {/* Back to Main Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -2 }}
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => router.push('/'), 400);
          }}
          className="global-back-btn"
        >
          <ChevronLeft size={20} />
          <span>Exit Application</span>
        </motion.button>

        {/* Header Section */}
        <header className="form-header">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>Join Code Catalysts</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            You don’t need to be the best. Just someone who starts.
          </motion.p>
        </header>

        {/* Multi-step Form Card */}
        <div className="glass-card-wrapper max-w-xl">
          <div className="progress-top">
            <div className="progress-bar-bg">
              <motion.div 
                className="progress-fill" 
                animate={{ width: `${((currentStep + 1) / 5) * 100}%` }}
              />
            </div>
            <span className="step-count">Step {currentStep + 1} of 5</span>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="step-container"
              >
                {currentStep === 0 && (
                  <div className="step-fields">
                    <h3>Who are you?</h3>
                    <div className="field-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Satoshi Nakamoto" 
                        value={formData.name} 
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                      />
                      {errors.name && <span className="error-msg"><AlertCircle size={12}/> {errors.name}</span>}
                    </div>
                    <div className="field-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="spark.ignite@gmail.com" 
                        value={formData.email} 
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-msg"><AlertCircle size={12}/> {errors.email}</span>}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="step-fields">
                    <h3>Academic Info</h3>
                    <div className="field-group">
                      <label>College Name</label>
                      <input 
                        type="text" 
                        name="college" 
                        placeholder="University Name" 
                        value={formData.college} 
                        onChange={handleChange}
                        className={errors.college ? 'error' : ''}
                      />
                      {errors.college && <span className="error-msg"><AlertCircle size={12}/> {errors.college}</span>}
                    </div>
                    <div className="field-group" data-name="year">
                      <label>Year of Study</label>
                      <CustomSelect 
                        options={[
                          { label: '1st Year', value: '1st', icon: GraduationCap },
                          { label: '2nd Year', value: '2nd', icon: GraduationCap },
                          { label: '3rd Year', value: '3rd', icon: GraduationCap },
                          { label: '4th Year', value: '4th', icon: GraduationCap },
                          { label: 'Graduate', value: 'Graduate', icon: GraduationCap }
                        ]}
                        value={formData.year}
                        onChange={handleChange}
                        placeholder="Select Year"
                        error={errors.year}
                      />
                      {errors.year && <span className="error-msg"><AlertCircle size={12}/> {errors.year}</span>}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="step-fields">
                    <h3>Digital Links</h3>
                    <div className="field-group">
                      <label>LinkedIn Profile</label>
                      <input 
                        type="text" 
                        name="linkedin" 
                        placeholder="linkedin.com/in/..." 
                        value={formData.linkedin} 
                        onChange={handleChange}
                        className={errors.linkedin ? 'error' : ''}
                      />
                      {errors.linkedin && <span className="error-msg"><AlertCircle size={12}/> {errors.linkedin}</span>}
                    </div>
                    <div className="field-group">
                      <label>GitHub Profile</label>
                      <input 
                        type="text" 
                        name="github" 
                        placeholder="github.com/..." 
                        value={formData.github} 
                        onChange={handleChange}
                        className={errors.github ? 'error' : ''}
                      />
                      {errors.github && <span className="error-msg"><AlertCircle size={12}/> {errors.github}</span>}
                    </div>
                    <div className="field-group">
                      <label>Portfolio Link (Optional)</label>
                      <input 
                        type="text" 
                        name="portfolio" 
                        placeholder="https://yourportfolio.com" 
                        value={formData.portfolio} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="step-fields">
                    <h3>Technical Intel</h3>
                    <div className="field-group" data-name="domain">
                      <label>Domain of Interest</label>
                      <CustomSelect 
                        options={[
                          { label: 'Web Development', value: 'Web Development', icon: Globe },
                          { label: 'AI / ML', value: 'AI / ML', icon: Brain },
                          { label: 'App Development', value: 'App Development', icon: Smartphone },
                          { label: 'Cloud / DevOps', value: 'Cloud / DevOps', icon: Cloud },
                          { label: 'Cybersecurity', value: 'Cybersecurity', icon: Shield },
                          { label: 'Blockchain', value: 'Blockchain', icon: Link2 },
                          { label: 'Game Development', value: 'Game Development', icon: Gamepad2 },
                          { label: 'Design', value: 'Design', icon: Palette },
                          { label: 'Data Science', value: 'Data Science', icon: BarChart3 },
                          { label: 'Marketing / Growth', value: 'Marketing / Growth', icon: TrendingUp },
                          { label: 'Other', value: 'Other', icon: Sparkles }
                        ]}
                        value={formData.domain}
                        onChange={handleChange}
                        placeholder="Select Domain"
                        error={errors.domain}
                      />
                      {errors.domain && <span className="error-msg"><AlertCircle size={12}/> {errors.domain}</span>}
                    </div>
                    <div className="field-group">
                      <label>Tech Stack</label>
                      <input 
                        type="text" 
                        name="tech_stack" 
                        placeholder="React, Node, Python..." 
                        value={formData.tech_stack} 
                        onChange={handleChange}
                        className={errors.tech_stack ? 'error' : ''}
                      />
                      {errors.tech_stack && <span className="error-msg"><AlertCircle size={12}/> {errors.tech_stack}</span>}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="step-fields">
                    <h3>Why do you want to join Code Catalysts?</h3>
                    <div className="field-group">
                      <textarea 
                        name="reason" 
                        value={formData.reason} 
                        onChange={handleChange} 
                        placeholder="Share your spark..." 
                        rows={8}
                        className={errors.reason ? 'error' : ''}
                      />
                      {errors.reason && <span className="error-msg"><AlertCircle size={12}/> {errors.reason}</span>}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="form-navigation">
              {currentStep > 0 && (
                <button type="button" onClick={handleBack} className="nav-btn-back">
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              
              {currentStep < 4 ? (
                <button 
                  type="button" 
                  onClick={handleNext} 
                  className="nav-btn-next"
                  style={{ marginLeft: currentStep === 0 ? 'auto' : '0' }}
                >
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="nav-btn-submit"
                >
                  {isSubmitting ? <Loader2 className="spinning" size={18} /> : 'Submit Application'} 
                  {!isSubmitting && <Send size={18} />}
                </button>
              )}
            </div>
            
            {status.type === 'error' && (
              <div className="form-status-error">{status.message}</div>
            )}
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .apply-container {
          min-height: 100vh;
          width: 100vw;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          overflow-y: auto;
          overflow-x: hidden;
        }
        

        .apply-content {
          position: relative;
          z-index: 5;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem 2rem 10rem 2rem; /* Increased bottom padding for menu space */
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .form-header h1 {
          font-size: 3rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #fff, rgba(255,255,255,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .form-header p {
          color: rgba(255,255,255,0.5);
          font-size: 1.1rem;
        }
        
        .max-w-xl {
          max-width: 576px;
        }
        
        .glass-card-wrapper {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: visible !important;
        }
        
        form {
          overflow: visible !important;
        }
        
        .step-container {
          overflow: visible !important;
        }
        
        .progress-top {
          margin-bottom: 2.5rem;
        }
        
        .progress-bar-bg {
          height: 4px;
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4F46E5, #7B61FF);
          box-shadow: 0 0 15px rgba(123, 97, 255, 0.5);
        }
        
        .step-count {
          font-size: 0.8rem;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .step-fields h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: #fff;
        }
        
        .field-group {
          margin-bottom: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        
        .field-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
        }
        
        input, select, textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.9rem 1.2rem;
          color: #fff;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }
        
        input:focus, select:focus, textarea:focus {
          border-color: #4F46E5;
          background: rgba(79, 70, 229, 0.05);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }
        
        input.error, select.error, textarea.error {
          border-color: #ef4444;
        }
        
        .error-msg {
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        
        .form-navigation {
          margin-top: 3rem;
          display: flex;
          gap: 1.5rem;
        }
        
        .nav-btn-next, .nav-btn-submit {
          flex: 1;
          padding: 1rem 2rem;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #4F46E5, #7B61FF);
          color: #fff;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        
        .nav-btn-next:hover, .nav-btn-submit:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
        }
        
        .global-back-btn {
          position: fixed;
          top: 2.5rem;
          left: 2.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.8rem 1.2rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          transition: all 0.3s ease;
          z-index: 100;
          backdrop-filter: blur(10px);
        }
        
        .global-back-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: #fff;
          transform: translateX(-4px);
        }
        
        @media (max-width: 768px) {
          .global-back-btn {
            top: 1.5rem;
            left: 1.5rem;
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }
        }
        
        .nav-btn-back {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .nav-btn-back:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        
        .success-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1.5rem;
          padding: 4rem;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(20px);
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .success-overlay h2 {
          font-size: 3.5rem;
          font-weight: 950;
          letter-spacing: -0.05em;
        }
        
        .auto-redirect {
          font-size: 0.8rem;
          opacity: 0.4;
          margin-top: 1rem;
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .form-status-error {
          margin-top: 1.5rem;
          color: #ef4444;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        /* Custom Select Styles */
        .custom-select-container {
          position: relative;
          width: 100%;
        }
        
        .custom-select-trigger {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.9rem 1.2rem;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
        }
        
        .custom-select-trigger:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .custom-select-trigger.open {
          border-color: #4F46E5;
          background: rgba(79, 70, 229, 0.05);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }
        
        .custom-select-trigger.error {
          border-color: #ef4444;
        }
        
        .trigger-content {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        
        .option-icon-active {
          color: #7B61FF;
        }
        
        .placeholder {
          color: rgba(255,255,255,0.3);
        }
        
        .chevron-icon {
          color: rgba(255,255,255,0.3);
          transition: transform 0.3s ease;
        }
        
        .chevron-icon.rotate {
          transform: rotate(180deg);
          color: #fff;
        }
        
        .custom-select-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          width: 100%;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          z-index: 1000;
          box-shadow: 0 20px 40px rgba(0,0,0,0.8);
          max-height: 250px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          overscroll-behavior: contain;
        }
        
        .custom-select-menu::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-select-menu::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        
        .custom-select-menu::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          border: 1px solid rgba(10,10,10,0.5);
        }
        
        .custom-select-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(123, 97, 255, 0.5);
        }
        
        .custom-select-option {
          padding: 0.9rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255,255,255,0.7);
        }
        
        .custom-select-option:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        
        .custom-select-option.selected {
          background: rgba(79, 70, 229, 0.1);
          color: #7B61FF;
          font-weight: 700;
        }
        
        .option-icon {
          opacity: 0.4;
          transition: opacity 0.2s ease;
        }
        
        .custom-select-option:hover .option-icon {
          opacity: 1;
          color: #7B61FF;
        }

      `}} />
    </motion.div>
  );
};

export default ApplyPage;

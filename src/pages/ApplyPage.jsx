import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Using keys provided)
const supabaseUrl = 'https://ebyimwixrytwgvdvgmmz.supabase.co';
const supabaseKey = 'sb_publishable_eu5e4DIZf8t3XwV1lJp9rQ_JNsF5k3N';
const supabase = createClient(supabaseUrl, supabaseKey);

const FORM_STEPS = [
  { id: 'basic', title: 'Basic Info' },
  { id: 'academic', title: 'Academic Info' },
  { id: 'links', title: 'Presence' },
  { id: 'technical', title: 'Technical' },
  { id: 'final', title: 'The Why' }
];

const ApplyPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    year: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    domain: '',
    tech_stack: '',
    why_join: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const currentFields = getFieldsForStep(currentStep);
    const isValid = currentFields.every(field => field === 'portfolio_url' || (formData[field] && formData[field].trim() !== ''));
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    } else {
      alert('Please fill out all required fields.');
    }
  };

  const getFieldsForStep = (step) => {
    switch(step) {
      case 0: return ['name', 'email'];
      case 1: return ['college', 'year'];
      case 2: return ['linkedin_url', 'github_url', 'portfolio_url'];
      case 3: return ['domain', 'tech_stack'];
      case 4: return ['why_join'];
      default: return [];
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('applicants')
        .insert([formData]);

      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 4000);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  if (isSuccess) {
    return (
      <div className="chapter-section" style={{ textAlign: 'center' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card"
          style={{ padding: '5rem', border: '1px solid var(--primary)' }}
        >
          <CheckCircle2 color="var(--primary)" size={80} style={{ marginBottom: '2rem' }} />
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Application Sent</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>
            The catalysts are reviewing your spark. <br />
            Returning you to the universe shortly.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="apply-page chapter-section">
      <div className="container" style={{ maxWidth: '700px' }}>
        
        {/* Progress System */}
        <div style={{ marginBottom: '5rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
             {FORM_STEPS.map((step, idx) => (
               <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                 <div style={{ 
                   width: '32px', 
                   height: '32px', 
                   borderRadius: '50%', 
                   border: `2px solid ${idx <= currentStep ? 'var(--primary)' : 'var(--glass-border)'}`,
                   background: idx === currentStep ? 'var(--primary)' : 'transparent',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   color: idx === currentStep ? '#000' : 'var(--text-muted)',
                   fontWeight: '800',
                   fontSize: '0.8rem',
                   transition: 'all 0.3s ease'
                 }}>
                   {idx + 1}
                 </div>
                 <span style={{ 
                   fontSize: '0.65rem', 
                   fontWeight: '800', 
                   color: idx <= currentStep ? 'var(--primary)' : 'var(--text-muted)',
                   textTransform: 'uppercase',
                   letterSpacing: '0.05em'
                 }}>
                   {step.title}
                 </span>
               </div>
             ))}
           </div>
           <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%` }}
               style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}
             />
           </div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="glass-card" style={{ padding: '3rem' }}>
                {currentStep === 0 && (
                  <div className="form-step">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Connection Details</h2>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>What should we call you?</label>
                      <input name="name" value={formData.name} onChange={handleChange} placeholder="Identity name" required />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>Transmission Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="address@protocol.com" required />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="form-step">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Origin</h2>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>Educational Institution</label>
                      <input name="college" value={formData.college} onChange={handleChange} placeholder="University / Hub" required />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>Cycle Year</label>
                      <select name="year" value={formData.year} onChange={handleChange} required>
                        <option value="">Status Select</option>
                        <option value="1">Year 01</option>
                        <option value="2">Year 02</option>
                        <option value="3">Year 03</option>
                        <option value="4">Year 04+</option>
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="form-step">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Digital Presence</h2>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>LinkedIn Protocol</label>
                      <input name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="linkedin.com/in/..." required />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>GitHub Repository</label>
                      <input name="github_url" value={formData.github_url} onChange={handleChange} placeholder="github.com/..." required />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>External Interface (Optional)</label>
                      <input name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} placeholder="https://..." />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="form-step">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Specialization</h2>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>Active Domain</label>
                      <select name="domain" value={formData.domain} onChange={handleChange} required>
                        <option value="">Core Select</option>
                        <option value="Web">Web Engineering</option>
                        <option value="AI">Intelligence / ML</option>
                        <option value="App">Mobile Systems</option>
                        <option value="Design">Visual Experience</option>
                        <option value="Other">Other Protocol</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>Tech Arsenal</label>
                      <input name="tech_stack" value={formData.tech_stack} onChange={handleChange} placeholder="Languages, Frameworks, Tools" required />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="form-step">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>The Why</h2>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label>Why choose the Catalyst path?</label>
                      <textarea 
                        name="why_join" 
                        value={formData.why_join} 
                        onChange={handleChange} 
                        placeholder="Define your drive and mission..." 
                        rows={6}
                        required 
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
            {currentStep > 0 && (
              <button type="button" onClick={handleBack} className="btn-outline">
                <ArrowLeft size={20} /> Previous
              </button>
            )}
            
            {currentStep < FORM_STEPS.length - 1 ? (
              <button type="button" onClick={handleNext} className="btn-catalyst" style={{ marginLeft: 'auto' }}>
                Continue <ArrowRight size={20} />
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="btn-catalyst" style={{ marginLeft: 'auto' }}>
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Initialize Membership'} 
                {!isSubmitting && <Sparkles size={20} />}
              </button>
            )}
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .apply-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
};

export default ApplyPage;

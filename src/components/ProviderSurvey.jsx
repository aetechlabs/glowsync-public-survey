import React, { useState } from 'react';

const getQuestions = (formData) => {
  const q = [
    { id: 'businessName', type: 'text', label: 'What is your business name?', required: true, placeholder: 'Glow Studio' },
    { id: 'fullName', type: 'text', label: 'Owner/Manager Name?', required: true, placeholder: 'John Doe' },
    { id: 'phone', type: 'tel', label: 'Business Phone Number?', required: true, placeholder: '+234 ...' },
    { id: 'email', type: 'email', label: 'Business Email?', required: true, placeholder: 'hello@glowstudio.com' },
    { id: 'category', type: 'select', label: 'What is your primary provider category?', required: true, options: [
      { value: 'gym', label: 'Gym/Fitness Center' },
      { value: 'barbershop', label: 'Barbershop' },
      { value: 'salon', label: 'Hair/Beauty Salon' },
      { value: 'spa', label: 'Wellness/Spa' },
      { value: 'mobile', label: 'Independent Mobile Stylist/Trainer' }
    ]},
    { id: 'primaryAddress', type: 'text', label: 'Primary Address', placeholder: 'Main Street, Wuse 2' },
    { id: 'branches', type: 'text', label: 'Branch Locations (if any)', placeholder: 'e.g., Maitama, Gwarinpa' },
    { id: 'targetCities', type: 'text', label: 'Target Cities of Operation', placeholder: 'e.g., Abuja, Lagos' },
  ];

  const cat = formData.category;
  if (cat === 'gym') {
    q.push({ id: 'capacityGym', type: 'number', label: 'Gym Capacity (Max People)', placeholder: 'e.g., 50' });
  } else if (cat === 'barbershop' || cat === 'salon') {
    q.push({ id: 'capacityChairs', type: 'number', label: cat === 'barbershop' ? 'Number of Barber Chairs' : 'Number of Salon Stations', placeholder: 'e.g., 5' });
  } else if (cat === 'spa') {
    q.push({ id: 'capacityChairs', type: 'number', label: 'Number of Treatment Rooms', placeholder: 'e.g., 3' });
  }
  
  if (cat && cat !== '') {
    q.push({ id: 'capacityStaff', type: 'number', label: 'Active Staff / Providers', placeholder: 'e.g., 10' });
  }

  q.push(
    { id: 'format', type: 'radio', label: 'Service Formats', options: ['In-facility only', 'Home/mobile service only', 'Both'] },
    { id: 'operatingHours', type: 'text', label: 'Operating Hours', placeholder: 'e.g., Mon-Sat 8am-8pm' },
    { id: 'peakTimes', type: 'text', label: 'Peak Times', placeholder: 'e.g., 5pm-8pm' },
    { id: 'tools', type: 'multiselect_with_other', label: 'Current Management Tools', options: ['Pen & paper', 'WhatsApp', 'POS software', 'Existing booking software'] },
    { id: 'walkInRatio', type: 'text', label: 'Walk-in vs. Appointment Ratio (%)', placeholder: 'e.g., 80% walk-in vs. 20% appointment' },
    { id: 'challenges', type: 'multiselect', label: 'Business Challenges', options: [
      'Off-peak empty slots or underutilized gym capacity.',
      'Customer no-shows and last-minute cancellations.',
      'Managing customer queues during peak hours.',
      'Handling payment collection, reconciliation, or tracking daily income.'
    ]},
    { id: 'network', type: 'radio', label: 'Willingness to Accept Network Members (GlowSync subscribers)', options: ['Yes, very open', 'Need more details', 'No'] },
    { id: 'dispatch', type: 'radio', label: 'Home Care Dispatch (Interest in sending staff for home appointments)', options: ['Yes', 'No'] },
    { id: 'pricingSheet', type: 'textarea', label: 'Standard Pricing Sheet (Base rates for core services)', placeholder: 'e.g., standard gym day pass/monthly fee, standard haircut, washing & styling' },
    { id: 'payoutCycle', type: 'select', label: 'Preferred Payout Cycle', options: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'biweekly', label: 'Bi-weekly' },
      { value: 'monthly', label: 'Monthly' }
    ]},
    { id: 'payoutChannel', type: 'select', label: 'Preferred Payout Channel', options: [
      { value: 'bank', label: 'Direct bank transfer' },
      { value: 'virtual', label: 'Virtual settlement account' }
    ]},
    { id: 'discount', type: 'radio', label: 'Discounting for Guaranteed Volume (Offer discounted rates to GlowSync for guaranteed foot traffic?)', options: ['Yes', 'No'] },
    { id: 'recommendation', type: 'text', label: 'Recommend another Provider (Optional)', placeholder: 'Provider Name & Location/Contact' },
    { id: 'getInvolved', type: 'multiselect_checkboxes', label: 'Get Involved', options: [
      { value: 'joinWaitlist', label: 'Join the GlowSync Provider Waitlist!', desc: 'Secure your spot for early onboarding, waived early fees, and priority placement in your city when we launch.' },
      { value: 'consentContact', label: 'Let\'s partner up.', desc: 'I consent to being contacted via email or phone for onboarding, partnership opportunities, and beta testing feedback.' }
    ]}
  );

  return q;
};

export default function ProviderSurvey() {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [otherToolText, setOtherToolText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messageModal, setMessageModal] = useState({ show: false, type: 'error', message: '' });

  const questions = getQuestions(formData);
  const currentQ = questions[currentStep];

  const handleNext = () => {
    if (currentQ.required && !formData[currentQ.id]) {
      setMessageModal({ show: true, type: 'error', message: 'This field is required.' });
      return;
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      submitForm();
    }
  };

  const handlePrev = () => {
    setCurrentStep(s => Math.max(0, s - 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentQ.type !== 'multiselect' && currentQ.type !== 'multiselect_with_other' && currentQ.type !== 'textarea') {
      handleNext();
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    
    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      const val = formData[key];
      if (Array.isArray(val)) {
        val.forEach(v => payload.append(key, v));
      } else {
        payload.append(key, val);
      }
    });

    if (otherToolText) {
      payload.append('otherTool', otherToolText);
    }
    
    if (formData.getInvolved?.includes('joinWaitlist')) payload.append('joinWaitlist', 'on');
    if (formData.getInvolved?.includes('consentContact')) payload.append('consentContact', 'on');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/public/surveys/provider`, {
        method: 'POST',
        body: payload
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      setShowModal(true);
    } catch (err) {
      console.error(err);
      setMessageModal({ show: true, type: 'error', message: "Failed to submit. Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'GlowSync Provider Survey',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setMessageModal({ show: true, type: 'success', message: "Link copied to clipboard!" });
    }
  };

  const handleValueChange = (val) => {
    setFormData(prev => ({ ...prev, [currentQ.id]: val }));
  };

  const toggleArrayValue = (val) => {
    setFormData(prev => {
      const arr = prev[currentQ.id] || [];
      if (arr.includes(val)) {
        return { ...prev, [currentQ.id]: arr.filter(item => item !== val) };
      } else {
        return { ...prev, [currentQ.id]: [...arr, val] };
      }
    });
  };

  if (!currentQ) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 w-full h-full flex flex-col justify-center animate-fade-in-up">
      <div className="mb-12">
        <div className="w-full bg-muted/10 rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentStep) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-[50vh]">
        <h2 className="text-3xl md:text-4xl font-heading text-text mb-2 leading-tight">
          {currentQ.label}
        </h2>
        
        {currentQ.type.startsWith('multiselect') ? (
          <p className="text-muted text-lg mb-8">Select all that apply</p>
        ) : (
          <div className="mb-8"></div>
        )}

        <div className="w-full max-w-xl animate-fade-in">
          {(currentQ.type === 'text' || currentQ.type === 'email' || currentQ.type === 'tel' || currentQ.type === 'number') && (
            <input 
              type={currentQ.type} 
              autoFocus
              className="w-full text-2xl p-4 border-b-2 border-muted/20 bg-transparent focus:outline-none focus:border-primary transition-colors placeholder:text-muted/30"
              placeholder={currentQ.placeholder}
              value={formData[currentQ.id] || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}

          {currentQ.type === 'textarea' && (
            <textarea 
              autoFocus
              rows="4"
              className="w-full text-xl p-4 border-2 border-muted/20 rounded-xl bg-transparent focus:outline-none focus:border-primary transition-colors placeholder:text-muted/30"
              placeholder={currentQ.placeholder}
              value={formData[currentQ.id] || ''}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          )}

          {currentQ.type === 'select' && (
            <select 
              className="w-full text-2xl p-4 border-b-2 border-muted/20 bg-transparent focus:outline-none focus:border-primary transition-colors cursor-pointer"
              value={formData[currentQ.id] || ''}
              onChange={(e) => {
                handleValueChange(e.target.value);
                setTimeout(handleNext, 300);
              }}
            >
              <option value="" disabled>Select an option...</option>
              {currentQ.options.map(opt => (
                <option key={opt.value} value={opt.value} className="text-base">{opt.label}</option>
              ))}
            </select>
          )}

          {currentQ.type === 'radio' && (
            <div className="flex flex-col gap-3">
              {currentQ.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    handleValueChange(opt);
                    setTimeout(handleNext, 300);
                  }}
                  className={`text-left p-4 rounded-xl border-2 transition-all text-lg ${formData[currentQ.id] === opt ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-muted/10 hover:border-primary/50'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'multiselect' && (
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {currentQ.options.map(opt => {
                const isSelected = (formData[currentQ.id] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleArrayValue(opt)}
                    className={`text-left p-4 rounded-xl border-2 transition-all text-lg ${isSelected ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-muted/10 hover:border-primary/50'}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {currentQ.type === 'multiselect_with_other' && (
            <div className="flex flex-col gap-3">
              {currentQ.options.map(opt => {
                const isSelected = (formData[currentQ.id] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleArrayValue(opt)}
                    className={`text-left p-4 rounded-xl border-2 transition-all text-lg ${isSelected ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-muted/10 hover:border-primary/50'}`}
                  >
                    {opt}
                  </button>
                )
              })}
              <button
                onClick={() => toggleArrayValue('Other')}
                className={`text-left p-4 rounded-xl border-2 transition-all text-lg ${(formData[currentQ.id] || []).includes('Other') ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-muted/10 hover:border-primary/50'}`}
              >
                Other
              </button>
              {(formData[currentQ.id] || []).includes('Other') && (
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Please specify..."
                  className="w-full text-xl p-4 border-b-2 border-muted/20 bg-transparent focus:outline-none focus:border-primary transition-colors mt-2"
                  value={otherToolText}
                  onChange={(e) => setOtherToolText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              )}
            </div>
          )}

          {currentQ.type === 'multiselect_checkboxes' && (
            <div className="flex flex-col gap-4">
              {currentQ.options.map(opt => {
                const isSelected = (formData[currentQ.id] || []).includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleArrayValue(opt.value)}
                    className={`text-left p-5 rounded-xl border-2 transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-muted/10 hover:border-primary/50'}`}
                  >
                    <div className={`text-lg font-medium mb-2 flex items-center gap-3 ${isSelected ? 'text-primary' : 'text-text'}`}>
                      <div className={`w-6 h-6 rounded flex items-center justify-center border-2 ${isSelected ? 'bg-primary border-primary text-white' : 'border-muted/30'}`}>
                        {isSelected && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        )}
                      </div>
                      {opt.label}
                    </div>
                    <div className="text-sm text-muted ml-9">{opt.desc}</div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center mt-12 pt-6 gap-4">
        {currentStep > 0 && (
          <button 
            onClick={handlePrev}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-muted/20 hover:bg-muted/5 transition-colors"
          >
            <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
        )}
        
        <button 
          onClick={handleNext}
          disabled={isSubmitting}
          className="ml-auto flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-heading text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : (currentStep === questions.length - 1 ? "Submit Survey" : "OK")}
          {!isSubmitting && currentStep < questions.length - 1 && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          )}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface p-8 rounded-lg max-w-md w-full shadow-xl text-center">
            <h3 className="text-3xl font-heading text-primary mb-4">Thank You!</h3>
            <p className="text-lg text-muted mb-8">Your responses have been recorded successfully. We'll be in touch soon!</p>
            <div className="space-y-4">
              <button onClick={handleShare} className="w-full bg-primary/10 text-primary font-medium py-4 px-6 rounded-xl hover:bg-primary/20 transition-colors">
                Share Survey Link
              </button>
              <button onClick={() => window.location.reload()} className="w-full border border-muted/20 text-text font-medium py-4 px-6 rounded-xl hover:bg-muted/10 transition-colors">
                Back to Start
              </button>
            </div>
          </div>
        </div>
      )}

      {messageModal.show && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-up">
          <div className={`p-4 rounded-md shadow-lg ${messageModal.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            <div className="flex justify-between items-center gap-4">
              <p>{messageModal.message}</p>
              <button onClick={() => setMessageModal({ show: false, type: '', message: '' })} className="opacity-80 hover:opacity-100">
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

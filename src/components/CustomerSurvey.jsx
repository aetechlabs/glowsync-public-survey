import React, { useState } from 'react';

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

const questions = [
  { id: 'fullName', type: 'text', label: 'What is your full name?', required: true, placeholder: 'Jane Doe' },
  { id: 'email', type: 'email', label: 'What is your email address?', required: true, placeholder: 'jane@example.com' },
  { id: 'phone', type: 'tel', label: 'What is your phone number?', required: true, placeholder: '+234 ...' },
  { id: 'ageBracket', type: 'radio', label: 'What is your age bracket?', options: ['18-24', '25-34', '35-44', '45-54', '55+'] },
  { id: 'state', type: 'select', label: 'What is your primary state / home city?', options: NIGERIAN_STATES },
  { id: 'neighborhood', type: 'text', label: 'Which neighborhood or area do you live in?', placeholder: 'e.g., Lekki, Wuse 2' },
  { id: 'travelFrequency', type: 'radio', label: 'How often do you travel between cities?', options: ['Weekly', 'Bi-weekly', 'Monthly', 'Occasionally', 'Never'] },
  { id: 'destinations', type: 'multiselect', label: 'Which cities do you travel to frequently?', options: NIGERIAN_STATES },
  { id: 'services', type: 'multiselect_with_other', label: 'Which services do you use regularly?', options: ['Gym/Fitness', 'Barbershop', 'Hair Salon', 'Nail Studio', 'Spa/Massage'] },
  { id: 'frequencyOfUse', type: 'text', label: 'How frequently do you use these services?', placeholder: 'e.g., Gym: 12x/month, Barbershop: 2x/month' },
  { id: 'serviceSetting', type: 'radio', label: 'What is your preferred service setting?', options: ['Physical location only', 'Home care/house calls only', 'Open to both'] },
  { id: 'bookingStyle', type: 'radio', label: 'How do you currently book appointments?', options: ['Pure walk-ins', 'Phone/WhatsApp bookings in advance', 'Existing apps'] },
  { id: 'frustrations', type: 'multiselect', label: 'What are your top frustrations?', options: ['Losing gym access or paying multiple fees when traveling.', 'Long wait times/queues at the salon or barbershop.', 'Difficulty finding reliable, clean, or vetted stylists/gyms in other cities.', 'Inconsistent pricing between visits or cities.'] },
  { id: 'queueValue', type: 'range', label: 'How valuable is skipping the queue to you? (1-5)', minLabel: 'Not important', maxLabel: 'Very important' },
  { id: 'crossCityValue', type: 'range', label: 'How valuable is cross-city access to you? (1-5)', minLabel: 'Unlikely', maxLabel: 'Very likely' },
  { id: 'monthlySpend', type: 'text', label: 'What is your current monthly spend on fitness & grooming?', placeholder: 'e.g., ₦50,000' },
  { id: 'paymentModel', type: 'radio_with_desc', label: 'What is your preferred payment model?', options: [
    { value: 'All-Access Subscription', desc: 'Flat monthly/annual fee for unlimited/quota-based access across all partner locations nationwide.' },
    { value: 'Pay-As-You-Go', desc: 'Book and pay per session via app without a recurring commitment.' },
    { value: 'Hybrid', desc: 'Basic base subscription with discounted per-visit add-ons.' }
  ]},
  { id: 'premium', type: 'radio', label: 'How much extra are you willing to pay for direct home delivery?', options: ['+20%', '+50%', '+100%'] },
  { id: 'recommendation', type: 'text', label: 'Know a great gym, salon, or barbershop we should partner with?', placeholder: 'Provider Name & Location/Contact' },
  { id: 'getInvolved', type: 'multiselect_checkboxes', label: 'Get Involved', options: [
    { value: 'joinWaitlist', label: 'Join the GlowSync Waitlist!', desc: 'Get early access, exclusive founding-member perks, and be the first to know when we launch in your city.' },
    { value: 'consentContact', label: 'Keep in touch.', desc: 'I consent to being contacted via email or phone for beta testing, product feedback, or exclusive updates.' }
  ]}
];

export default function CustomerSurvey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [otherServiceText, setOtherServiceText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messageModal, setMessageModal] = useState({ show: false, type: 'error', message: '' });

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
    if (e.key === 'Enter' && currentQ.type !== 'multiselect' && currentQ.type !== 'multiselect_with_other') {
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

    if (otherServiceText) {
      payload.append('otherService', otherServiceText);
    }
    
    if (formData.getInvolved?.includes('joinWaitlist')) payload.append('joinWaitlist', 'on');
    if (formData.getInvolved?.includes('consentContact')) payload.append('consentContact', 'on');

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/public/survey`, {
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
        title: 'GlowSync Customer Survey',
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
          {(currentQ.type === 'text' || currentQ.type === 'email' || currentQ.type === 'tel') && (
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
                <option key={opt} value={opt} className="text-base">{opt}</option>
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

          {currentQ.type === 'radio_with_desc' && (
            <div className="flex flex-col gap-3">
              {currentQ.options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    handleValueChange(opt.value);
                    setTimeout(handleNext, 300);
                  }}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${formData[currentQ.id] === opt.value ? 'border-primary bg-primary/5 text-primary' : 'border-muted/10 hover:border-primary/50'}`}
                >
                  <div className="text-lg font-medium mb-1">{opt.value}</div>
                  <div className={`text-sm ${formData[currentQ.id] === opt.value ? 'text-primary/80' : 'text-muted'}`}>{opt.desc}</div>
                </button>
              ))}
            </div>
          )}

          {currentQ.type === 'multiselect' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {currentQ.options.map(opt => {
                const isSelected = (formData[currentQ.id] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleArrayValue(opt)}
                    className={`text-left p-3 rounded-lg border-2 transition-all text-sm ${isSelected ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-muted/10 hover:border-primary/50'}`}
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
                  value={otherServiceText}
                  onChange={(e) => setOtherServiceText(e.target.value)}
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

          {currentQ.type === 'range' && (
            <div className="mt-8">
              <input 
                type="range" 
                min="1" 
                max="5" 
                className="w-full accent-primary h-2 bg-muted/20 rounded-lg appearance-none cursor-pointer"
                value={formData[currentQ.id] || 3}
                onChange={(e) => handleValueChange(e.target.value)}
              />
              <div className="flex justify-between text-sm text-muted mt-4 font-medium">
                <span>1 - {currentQ.minLabel}</span>
                <span className="text-primary font-bold text-xl">{formData[currentQ.id] || 3}</span>
                <span>5 - {currentQ.maxLabel}</span>
              </div>
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
            <p className="text-lg text-muted mb-8">Your responses have been recorded successfully. Help us grow the GlowSync network!</p>
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

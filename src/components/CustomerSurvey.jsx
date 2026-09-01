import React, { useState } from 'react';

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
];

export default function CustomerSurvey() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messageModal, setMessageModal] = useState({ show: false, type: 'error', message: '' });
  const [showOtherService, setShowOtherService] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep === 1) {
      const form = document.getElementById('customer-form');
      if (form) {
        const inputs = form.querySelectorAll('input[required]');
        let valid = true;
        inputs.forEach(input => {
          if (!input.checkValidity()) {
            input.reportValidity();
            valid = false;
          }
        });
        if (!valid) return;
      }
    }
    setCurrentStep(s => Math.min(6, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep(s => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      responses: {
        ageBracket: formData.get("ageBracket"),
        state: formData.get("state"),
        neighborhood: formData.get("neighborhood"),
        travelFrequency: formData.get("travelFrequency"),
        destinations: formData.getAll("destinations"),
        services: formData.getAll("services"),
        otherService: formData.get("otherService"),
        frequencyOfUse: formData.get("frequencyOfUse"),
        serviceSetting: formData.get("serviceSetting"),
        bookingStyle: formData.get("bookingStyle"),
        frustrations: formData.getAll("frustrations"),
        queueValue: formData.get("queueValue"),
        crossCityValue: formData.get("crossCityValue"),
        monthlySpend: formData.get("monthlySpend"),
        paymentModel: formData.get("paymentModel"),
        homePremium: formData.get("premium"),
        recommendation: formData.get("recommendation"),
        joinWaitlist: formData.get("joinWaitlist") === "on",
        consentContact: formData.get("consentContact") === "on",
      }
    };

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${apiUrl}/api/public/surveys/customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setShowModal(true);
        e.target.reset();
        setShowOtherService(false);
      } else {
        setMessageModal({ show: true, type: 'error', message: "Something went wrong. Please try again." });
      }
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

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-surface shadow-soft rounded-lg">
      <h2 className="text-2xl font-heading text-text mb-2">Customer Survey (Demand Side)</h2>
      <p className="text-muted mb-8">Help us shape the future of beauty and grooming in Abuja and beyond.</p>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted mb-2 font-medium">
          <span>Step {currentStep} of 6</span>
          <span>{Math.round((currentStep / 6) * 100)}%</span>
        </div>
        <div className="w-full bg-muted/10 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 6) * 100}%` }}></div>
        </div>
      </div>

      <form id="customer-form" className="space-y-10" onSubmit={handleSubmit}>
        
        {/* Section 1 */}
        <section className={currentStep === 1 ? 'block' : 'hidden'}>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">1. User Profile & Geographic Mobility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-text font-medium mb-1">Full Name</label>
              <input type="text" name="fullName" required className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Email Address</label>
              <input type="email" name="email" required className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="jane@example.com" />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Phone Number</label>
              <input type="tel" name="phone" required className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="+234 ..." />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Age Bracket</label>
              <select name="ageBracket" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Select age bracket</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">State / Home City</label>
              <select name="state" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Select state</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Neighborhood / Area</label>
              <input type="text" name="neighborhood" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Lekki, Wuse 2" />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-2">Travel Frequency (Between cities)</label>
              <select name="travelFrequency" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Select frequency</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="occasionally">Occasionally</option>
                <option value="never">Never</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-text font-medium mb-2">Frequent Destinations</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 max-h-48 overflow-y-auto p-4 bg-background border border-muted/20 rounded-md">
                {NIGERIAN_STATES.map(state => (
                  <label key={state} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="destinations" value={state} className="accent-primary w-4 h-4 rounded border-muted/20" /> {state}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className={currentStep === 2 ? 'block' : 'hidden'}>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">2. Service Consumption & Current Habits</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-text font-medium mb-2">Services Used Regularly</label>
              <div className="flex flex-wrap gap-4">
                {['Gym/Fitness', 'Barbershop', 'Hair Salon', 'Nail Studio', 'Spa/Massage'].map(svc => (
                  <label key={svc} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="services" value={svc} className="accent-primary w-4 h-4 rounded border-muted/20" /> {svc}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="services" value="Other" onChange={(e) => setShowOtherService(e.target.checked)} className="accent-primary w-4 h-4 rounded border-muted/20" /> Other
                </label>
              </div>
              {showOtherService && (
                <input type="text" name="otherService" className="mt-3 w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Please specify..." />
              )}
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Frequency of Use</label>
              <input type="text" name="frequencyOfUse" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Gym: 12x/month, Barbershop: 2x/month" />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-2">Service Setting Preference</label>
              <div className="flex flex-col gap-3">
                {['Physical location only', 'Home care/house calls only', 'Open to both'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="serviceSetting" value={opt} className="accent-primary w-4 h-4 border-muted/20" /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-2">Current Booking Style</label>
              <div className="flex flex-col gap-3">
                {['Pure walk-ins', 'Phone/WhatsApp bookings in advance', 'Existing apps'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="bookingStyle" value={opt} className="accent-primary w-4 h-4 border-muted/20" /> {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className={currentStep === 3 ? 'block' : 'hidden'}>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">3. Pain Points & Workflow Validation</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-text font-medium mb-2">Top Frustrations</label>
              <div className="flex flex-col gap-4">
                {[
                  'Losing gym access or paying multiple fees when traveling.',
                  'Long wait times/queues at the salon or barbershop.',
                  'Difficulty finding reliable, clean, or vetted stylists/gyms in other cities.',
                  'Inconsistent pricing between visits or cities.'
                ].map(opt => (
                  <label key={opt} className="flex items-start gap-3 text-sm">
                    <input type="checkbox" name="frustrations" value={opt} className="accent-primary w-4 h-4 rounded mt-1 border-muted/20" /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text font-medium mb-2">Value of Queue-Skipping (1-5)</label>
                <input type="range" min="1" max="5" name="queueValue" className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>1 (Not important)</span>
                  <span>5 (Very important)</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-text font-medium mb-2">Value of Cross-City Access (1-5)</label>
                <input type="range" min="1" max="5" name="crossCityValue" className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>1 (Unlikely)</span>
                  <span>5 (Very likely)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className={currentStep === 4 ? 'block' : 'hidden'}>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">4. Pricing & Subscription Preferences</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-text font-medium mb-1">Current Monthly Spend (Fitness & Grooming)</label>
              <input type="text" name="monthlySpend" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., ₦50,000" />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-2">Preferred Payment Model</label>
              <div className="flex flex-col gap-4">
                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input type="radio" name="paymentModel" value="All-Access Subscription" className="accent-primary w-4 h-4 mt-0.5 border-muted/20" />
                  <span><strong>All-Access Subscription:</strong> Flat monthly/annual fee for unlimited/quota-based access across all partner locations nationwide.</span>
                </label>
                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input type="radio" name="paymentModel" value="Pay-As-You-Go" className="accent-primary w-4 h-4 mt-0.5 border-muted/20" />
                  <span><strong>Pay-As-You-Go:</strong> Book and pay per session via app without a recurring commitment.</span>
                </label>
                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input type="radio" name="paymentModel" value="Hybrid" className="accent-primary w-4 h-4 mt-0.5 border-muted/20" />
                  <span><strong>Hybrid:</strong> Basic base subscription with discounted per-visit add-ons.</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-2">Home Care Premium (Extra % willing to pay for direct home delivery)</label>
              <div className="flex gap-6">
                {['+20%', '+50%', '+100%'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="premium" value={opt} className="accent-primary w-4 h-4 border-muted/20" /> {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className={currentStep === 5 ? 'block' : 'hidden'}>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">5. Recommendations</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-text font-medium mb-1">Recommend a Provider (Optional)</label>
              <p className="text-muted text-sm mb-3">Know a great gym, salon, or barbershop we should partner with? Let us know!</p>
              <input type="text" name="recommendation" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Provider Name & Location/Contact" />
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className={currentStep === 6 ? 'block' : 'hidden'}>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">6. Get Involved</h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3 text-sm cursor-pointer bg-primary/5 p-4 rounded-md border border-primary/20">
              <input type="checkbox" name="joinWaitlist" className="accent-primary w-5 h-5 mt-0.5 border-muted/20" />
              <span><strong>Join the GlowSync Waitlist!</strong> Get early access, exclusive founding-member perks, and be the first to know when we launch in your city.</span>
            </label>
            <label className="flex items-start gap-3 text-sm cursor-pointer bg-background p-4 rounded-md border border-muted/20">
              <input type="checkbox" name="consentContact" className="accent-primary w-5 h-5 mt-0.5 border-muted/20" />
              <span><strong>Keep in touch.</strong> I consent to being contacted via email or phone for beta testing, product feedback, or exclusive updates.</span>
            </label>
          </div>
        </section>

        {/* Navigation Footer */}
        <div className="flex justify-between gap-4 pt-6 mt-8 border-t border-muted/10">
          {currentStep > 1 && (
            <button type="button" onClick={handlePrev} className="px-6 py-3 rounded-full border border-muted/20 text-text font-medium hover:bg-muted/5 transition-colors">
              Back
            </button>
          )}
          
          {currentStep < 6 ? (
            <button type="button" onClick={handleNext} className="ml-auto px-8 py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-opacity shadow-soft">
              Next
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="ml-auto px-8 py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-opacity shadow-soft disabled:opacity-50">
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </button>
          )}
        </div>
      </form>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface p-8 rounded-lg max-w-md w-full shadow-xl text-center">
            <h3 className="text-2xl font-heading text-primary mb-2">Thank You!</h3>
            <p className="text-muted mb-6">Your responses have been recorded successfully. Help us grow the GlowSync network!</p>
            <div className="space-y-4">
              <button onClick={handleShare} className="w-full bg-primary/10 text-primary font-medium py-3 px-4 rounded-full hover:bg-primary/20 transition-colors">
                Share Survey Link
              </button>
              <button onClick={() => setShowModal(false)} className="w-full border border-muted/20 text-text font-medium py-3 px-4 rounded-full hover:bg-muted/10 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface p-8 rounded-lg max-w-md w-full shadow-xl text-center">
            <h3 className={`text-2xl font-heading mb-2 ${messageModal.type === 'error' ? 'text-red-600' : 'text-primary'}`}>
              {messageModal.type === 'error' ? 'Oops!' : 'Success!'}
            </h3>
            <p className="text-muted mb-6">{messageModal.message}</p>
            <div className="space-y-4">
              <button onClick={() => setMessageModal({ show: false, type: 'error', message: '' })} className={`w-full font-medium py-3 px-4 rounded-full transition-colors text-white ${messageModal.type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:opacity-90'}`}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';

export default function ProviderSurvey() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showOtherTool, setShowOtherTool] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = {
      businessName: formData.get("businessName"),
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      responses: {
        category: formData.get("category"),
        primaryAddress: formData.get("primaryAddress"),
        branches: formData.get("branches"),
        targetCities: formData.get("targetCities"),
        capacityChairs: formData.get("capacityChairs"),
        capacityGym: formData.get("capacityGym"),
        capacityStaff: formData.get("capacityStaff"),
        serviceFormats: formData.get("format"),
        operatingHours: formData.get("operatingHours"),
        peakTimes: formData.get("peakTimes"),
        tools: formData.getAll("tools"),
        otherTool: formData.get("otherTool"),
        walkInRatio: formData.get("walkInRatio"),
        challenges: formData.getAll("challenges"),
        acceptNetwork: formData.get("network"),
        homeDispatch: formData.get("dispatch"),
        pricingSheet: formData.get("pricingSheet"),
        payoutCycle: formData.get("payoutCycle"),
        payoutChannel: formData.get("payoutChannel"),
        discounting: formData.get("discount"),
        recommendation: formData.get("recommendation"),
      }
    };

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${apiUrl}/api/public/surveys/provider`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setShowModal(true);
        e.target.reset();
        setShowOtherTool(false);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please check your connection.");
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
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-surface shadow-soft rounded-lg">
      <h2 className="text-2xl font-heading text-text mb-2">Provider Survey (Supply Side)</h2>
      <p className="text-muted mb-8">Partner with GlowSync to grow your beauty or grooming business.</p>
      
      <form className="space-y-10" onSubmit={handleSubmit}>
        
        {/* Section 1 */}
        <section>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">1. Business Profile & Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-text font-medium mb-1">Business Name</label>
              <input type="text" name="businessName" required className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Glow Studio" />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Owner/Manager Name</label>
              <input type="text" name="fullName" required className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Business Phone Number</label>
              <input type="tel" name="phone" required className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="+234 ..." />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Email</label>
              <input type="email" name="email" required className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="hello@glowstudio.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-text font-medium mb-1">Provider Category</label>
              <select name="category" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Select a category</option>
                <option value="gym">Gym/Fitness Center</option>
                <option value="barbershop">Barbershop</option>
                <option value="salon">Hair/Beauty Salon</option>
                <option value="spa">Wellness/Spa</option>
                <option value="mobile">Independent Mobile Stylist/Trainer</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-text font-medium mb-1">Primary Address</label>
              <input type="text" name="primaryAddress" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Main Street, Wuse 2" />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Branch Locations (if any)</label>
              <input type="text" name="branches" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Maitama, Gwarinpa" />
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Target Cities of Operation</label>
              <input type="text" name="targetCities" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Abuja, Lagos" />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-text font-medium mb-2">Capacity & Scale</label>
              <div className="grid grid-cols-3 gap-4">
                <input type="number" name="capacityChairs" placeholder="Chairs/Stations" className="w-full p-3 rounded-md bg-background border border-muted/20 text-sm focus:ring-2 focus:ring-primary/50" />
                <input type="number" name="capacityGym" placeholder="Gym Capacity" className="w-full p-3 rounded-md bg-background border border-muted/20 text-sm focus:ring-2 focus:ring-primary/50" />
                <input type="number" name="capacityStaff" placeholder="Active Staff" className="w-full p-3 rounded-md bg-background border border-muted/20 text-sm focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">2. Service Delivery & Current Tech Stack</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-text font-medium mb-2">Service Formats</label>
              <div className="flex gap-4 flex-wrap">
                {['In-facility only', 'Home/mobile service only', 'Both'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="format" value={opt} className="accent-primary w-4 h-4 border-muted/20" /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text font-medium mb-1">Operating Hours</label>
                <input type="text" name="operatingHours" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., Mon-Sat 8am-8pm" />
              </div>
              <div>
                <label className="block text-sm text-text font-medium mb-1">Peak Times</label>
                <input type="text" name="peakTimes" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., 5pm-8pm" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-2">Current Management Tools</label>
              <div className="flex flex-col gap-3">
                {['Pen & paper', 'WhatsApp', 'POS software', 'Existing booking software'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="tools" value={opt} className="accent-primary w-4 h-4 border-muted/20" /> {opt}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="tools" value="Other" onChange={(e) => setShowOtherTool(e.target.checked)} className="accent-primary w-4 h-4 border-muted/20" /> Other
                </label>
              </div>
              {showOtherTool && (
                <input type="text" name="otherTool" className="mt-3 w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Please specify..." />
              )}
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-1">Walk-in vs. Appointment Ratio (%)</label>
              <input type="text" name="walkInRatio" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g., 80% walk-in vs. 20% appointment" />
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">3. Operational Pain Points & Marketplace Alignment</h3>
          <div className="space-y-6">
             <div>
              <label className="block text-sm text-text font-medium mb-2">Business Challenges</label>
              <div className="flex flex-col gap-4">
                {[
                  'Off-peak empty slots or underutilized gym capacity.',
                  'Customer no-shows and last-minute cancellations.',
                  'Managing customer queues during peak hours.',
                  'Handling payment collection, reconciliation, or tracking daily income.'
                ].map(opt => (
                  <label key={opt} className="flex items-start gap-3 text-sm cursor-pointer">
                    <input type="checkbox" name="challenges" value={opt} className="accent-primary w-4 h-4 rounded mt-1 border-muted/20" /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-2">Willingness to Accept Network Members (GlowSync subscribers)</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="network" value="Yes, very open" className="accent-primary w-4 h-4 border-muted/20" /> Yes, very open</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="network" value="Need more details" className="accent-primary w-4 h-4 border-muted/20" /> Need more details</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="network" value="No" className="accent-primary w-4 h-4 border-muted/20" /> No</label>
              </div>
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-2">Home Care Dispatch (Interest in sending staff for home appointments)</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="dispatch" value="Yes" className="accent-primary w-4 h-4 border-muted/20" /> Yes</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="dispatch" value="No" className="accent-primary w-4 h-4 border-muted/20" /> No</label>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">4. Financial Expectations & Commercial Terms</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-text font-medium mb-1">Standard Pricing Sheet (Base rates for core services)</label>
              <textarea name="pricingSheet" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" rows="3" placeholder="e.g., standard gym day pass/monthly fee, standard haircut, washing & styling"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text font-medium mb-1">Preferred Payout Cycle</label>
                <select name="payoutCycle" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Select cycle</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text font-medium mb-1">Preferred Payout Channel</label>
                <select name="payoutChannel" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Select channel</option>
                  <option value="bank">Direct bank transfer</option>
                  <option value="virtual">Virtual settlement account</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-text font-medium mb-2">Discounting for Guaranteed Volume (Offer discounted rates to GlowSync for guaranteed foot traffic?)</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="discount" value="Yes" className="accent-primary w-4 h-4 border-muted/20" /> Yes</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="discount" value="No" className="accent-primary w-4 h-4 border-muted/20" /> No</label>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h3 className="text-xl font-heading text-primary border-b border-muted/20 pb-2 mb-6">5. Recommendations</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-text font-medium mb-1">Recommend another Provider (Optional)</label>
              <p className="text-muted text-sm mb-3">Know another great gym, salon, or barbershop we should partner with?</p>
              <input type="text" name="recommendation" className="w-full p-3 rounded-md bg-background border border-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Provider Name & Location/Contact" />
            </div>
          </div>
        </section>

        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-heading py-4 px-6 rounded-full hover:opacity-90 transition-opacity shadow-soft text-lg disabled:opacity-50">
          {isSubmitting ? "Submitting..." : "Submit Provider Survey"}
        </button>
      </form>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface p-8 rounded-lg max-w-md w-full shadow-xl text-center">
            <h3 className="text-2xl font-heading text-primary mb-2">Thank You!</h3>
            <p className="text-muted mb-6">Your responses have been recorded successfully. We'll be in touch soon!</p>
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
    </div>
  );
}

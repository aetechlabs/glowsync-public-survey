import { useState } from 'react'
import CustomerSurvey from './components/CustomerSurvey'
import ProviderSurvey from './components/ProviderSurvey'

function App() {
  const [activeTab, setActiveTab] = useState('customer')

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-heading text-text mb-4">GlowSync</h1>
        <p className="text-muted">Help us build the perfect booking experience.</p>
        
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={() => setActiveTab('customer')}
            className={`px-6 py-2 rounded-full font-heading transition-colors ${activeTab === 'customer' ? 'bg-primary text-white shadow-soft' : 'bg-surface text-muted hover:bg-white'}`}
          >
            I'm a Client
          </button>
          <button 
            onClick={() => setActiveTab('provider')}
            className={`px-6 py-2 rounded-full font-heading transition-colors ${activeTab === 'provider' ? 'bg-primary text-white shadow-soft' : 'bg-surface text-muted hover:bg-white'}`}
          >
            I'm a Provider
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'customer' ? <CustomerSurvey /> : <ProviderSurvey />}
      </main>
    </div>
  )
}

export default App

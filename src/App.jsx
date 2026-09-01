import { useState } from 'react'
import CustomerSurvey from './components/CustomerSurvey'
import ProviderSurvey from './components/ProviderSurvey'

function App() {
  const [activeTab, setActiveTab] = useState(null)

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col justify-center">
      {!activeTab ? (
        <header className="max-w-2xl mx-auto text-center w-full animate-fade-in-up">
          <img src="/logo.png?v=2" alt="GlowSync Logo" className="w-28 h-28 mx-auto mb-6 object-contain drop-shadow-md" />
          <h1 className="text-5xl font-heading text-text mb-4 tracking-tight">GlowSync</h1>
          <p className="text-xl text-muted mb-12 font-light">Help us build the perfect booking experience.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <button 
              onClick={() => setActiveTab('customer')}
              className="px-10 py-5 rounded-xl font-heading text-xl transition-all bg-surface border-2 border-primary/20 text-text hover:border-primary hover:shadow-xl hover:-translate-y-1"
            >
              I'm a Client
            </button>
            <button 
              onClick={() => setActiveTab('provider')}
              className="px-10 py-5 rounded-xl font-heading text-xl transition-all bg-surface border-2 border-primary/20 text-text hover:border-primary hover:shadow-xl hover:-translate-y-1"
            >
              I'm a Provider
            </button>
          </div>
        </header>
      ) : (
        <main className="w-full flex-1 flex flex-col justify-center animate-fade-in">
          {activeTab === 'customer' ? <CustomerSurvey /> : <ProviderSurvey />}
        </main>
      )}

      <div className="fixed bottom-4 right-4 z-50">
        <a href="https://aetechlabs.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-border hover:shadow-xl transition-shadow">
          <span className="text-xs text-muted font-medium">Powered by</span>
          <img src="https://aetechlabs.com/logos/logo-dark.png" alt="Aetech Research Labs Limited" className="h-4" />
        </a>
      </div>
    </div>
  )
}

export default App

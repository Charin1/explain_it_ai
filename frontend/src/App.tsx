import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Sparkles, Atom, Settings2, ChevronDown, Search, Zap, Music, Pencil, Move, Hash, Moon } from 'lucide-react';
import { explainIt, getModels, getSurpriseQuestions, type ExplanationResponse, type ModelInfo } from './api';
import ExplanationResult from './components/ExplanationResult';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplanationResponse | null>(null);
  const [error, setError] = useState('');

  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  // Analogy Style State
  const [selectedStyle, setSelectedStyle] = useState<string>("General");
  const styles = [
    { id: "General", label: "General", icon: Zap },
    { id: "Music", label: "Music", icon: Music },
    { id: "Dance", label: "Dance", icon: Move },
    { id: "Drawing", label: "Drawing", icon: Pencil },
    { id: "Numerology", label: "Numerology", icon: Hash },
    { id: "Astrology", label: "Astrology", icon: Moon },
  ];

  // Suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([
    'Why is the sky blue?',
    'How do magnets work?',
    'Why does ice float?'
  ]);
  const [loadingSurprise, setLoadingSurprise] = useState(false);

  const modelMenuRef = useRef<HTMLDivElement>(null);
  const modelButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isModelMenuOpen &&
        modelMenuRef.current &&
        modelButtonRef.current &&
        !modelMenuRef.current.contains(event.target as Node) &&
        !modelButtonRef.current.contains(event.target as Node)
      ) {
        setIsModelMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModelMenuOpen]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const availableModels = await getModels();
        setModels(availableModels);
        if (availableModels.length > 0) {
          setSelectedModel(availableModels[0]);
        }
      } catch (err) {
        console.error("Failed to load models", err);
      }
    };
    fetchModels();
  }, []);

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const data = await explainIt(
        query,
        selectedModel?.provider,
        selectedModel?.name,
        selectedStyle
      );
      setResult(data);
    } catch (err) {
      setError('Failed to fetch explanation. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSurprise = async () => {
    if (loadingSurprise) return;
    setLoadingSurprise(true);
    try {
      const newQuestions = await getSurpriseQuestions(selectedModel?.provider, selectedModel?.name);
      if (newQuestions && newQuestions.length > 0) {
        setSuggestions(newQuestions);
      }
    } catch (err) {
      console.error("Failed to get surprise questions", err);
    } finally {
      setLoadingSurprise(false);
    }
  };



  return (
    <div className="relative min-h-screen text-slate-200">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full animate-pulse-glow"
          style={{
            top: '-10%',
            left: '-5%',
            background: 'radial-gradient(circle, hsla(217, 91%, 60%, 0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full animate-pulse-glow delay-500"
          style={{
            bottom: '0%',
            right: '-5%',
            background: 'radial-gradient(circle, hsla(265, 83%, 65%, 0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full animate-pulse-glow delay-300"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, hsla(173, 80%, 45%, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <header
          className="sticky top-0 z-50 w-full bg-slate-950/60 border-b border-white/[0.06]"
          style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">

              {/* Left - Logo & Branding */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                  <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
                    <Atom className="text-white w-5 h-5 animate-spin-slow" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight leading-none">
                    <span className="text-white">Everyday</span>
                    {' '}
                    <span className="gradient-text">Physics</span>
                  </h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mt-0.5">
                    Explainer
                  </p>
                </div>
              </div>

              {/* Right - Model Selector */}
              <div className="relative">
                <button
                  ref={modelButtonRef}
                  onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium text-slate-400 glass-button hover:text-white"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{selectedModel ? selectedModel.label : 'Select Model'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - Rendered in Portal to escape header context */}
                {isModelMenuOpen && createPortal(
                  <div
                    ref={modelMenuRef}
                    style={{
                      position: 'fixed',
                      top: modelButtonRef.current ? modelButtonRef.current.getBoundingClientRect().bottom + 8 : 0,
                      left: modelButtonRef.current ? modelButtonRef.current.getBoundingClientRect().right - 256 : 0, // 256px is w-64
                    }}
                    className="w-64 glass-panel-premium p-2 animate-scale-in z-[9999] shadow-2xl"
                  >
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">
                      Select AI Model
                    </div>
                    <div className="space-y-1 max-h-80 overflow-y-auto">
                      {models.map((model) => (
                        <button
                          key={`${model.provider}-${model.name}`}
                          onClick={() => {
                            setSelectedModel(model);
                            setIsModelMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${selectedModel?.name === model.name
                            ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                        >
                          <div className="font-semibold text-sm">{model.label}</div>
                          <div className="text-[11px] opacity-60 mt-0.5">{model.provider}</div>
                        </button>
                      ))}
                    </div>
                  </div>,
                  document.body
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col w-full max-w-5xl mx-auto px-6">

          {/* Hero Search Section */}
          <div className={`transition-all duration-700 ease-out w-full ${result ? 'pt-10' : 'flex-grow flex flex-col justify-center -mt-16'
            }`}>

            <div className="text-center w-full max-w-4xl mx-auto">

              {/* Hero Headline */}
              {!result && (
                <div className="mb-12 animate-fade-in-up">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-balance">
                    <span className="text-white">Explain the</span>
                    <br className="sm:hidden" />
                    {' '}
                    <span className="gradient-text text-glow">Unknown</span>
                  </h2>
                  <p className="text-slate-400 text-lg mt-4 max-w-lg mx-auto">
                    Ask any physics question and get a clear, visual explanation powered by AI
                  </p>
                </div>
              )}

              {/* Search Input */}
              <form onSubmit={handleExplain} className="relative max-w-3xl mx-auto group animate-fade-in-up delay-150">
                <div
                  className="absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, hsla(173, 80%, 45%, 0.2) 0%, hsla(217, 91%, 60%, 0.2) 50%, hsla(265, 83%, 65%, 0.2) 100%)'
                  }}
                />

                <div className="relative glass-panel-premium p-2 flex items-center gap-2">
                  <div className="pl-3 flex-shrink-0">
                    <Search className="w-5 h-5 text-slate-500" />
                  </div>

                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Why is it darker just before dawn?"
                    className="flex-grow bg-transparent text-white placeholder-slate-500 text-base sm:text-lg px-3 py-3 outline-none font-medium"
                    disabled={loading}
                  />

                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 sm:px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-blue-500/25 flex items-center gap-2 active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">{loading ? 'Analyzing...' : 'Explain'}</span>
                  </button>
                </div>
              </form>

              {/* Style Selector */}
              {!result && (
                <div className="mt-8 flex justify-center animate-fade-in-up delay-200">
                  <div className="inline-flex bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-full p-1 gap-1">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedStyle === style.id
                          ? 'bg-white/10 text-white shadow-lg'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                          }`}
                      >
                        <style.icon size={14} />
                        <span>{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestion Chips */}
              {!result && !loading && (
                <div className="mt-8 flex flex-col items-center animate-fade-in-up delay-300">
                  <div className="flex flex-wrap justify-center gap-3">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="glass-button px-5 py-2.5 text-sm text-slate-400 hover:text-cyan-300 flex items-center gap-2 group"
                        style={{ animationDelay: `${300 + index * 75}ms` }}
                      >
                        <Zap className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSurprise}
                    disabled={loadingSurprise}
                    className="mt-6 text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {loadingSurprise ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Surprise Me
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="glass-panel-premium border-red-500/30 text-red-200 p-6 rounded-2xl mb-8 text-center animate-fade-in-up flex items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative w-16 h-16 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              </div>
              <p className="text-slate-400 mt-6 text-sm">Analyzing your question...</p>
              <div className="flex gap-1.5 mt-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500/50 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-blue-500/50 animate-pulse delay-150" />
                <div className="w-2 h-2 rounded-full bg-purple-500/50 animate-pulse delay-300" />
              </div>
            </div>
          )}

          {/* Result View */}
          {result && !loading && (
            <div className="animate-fade-in-up delay-100 pb-16 mt-8">
              <ExplanationResult data={result} />
            </div>
          )}
        </main>

        {/* Footer */}
        {!result && !loading && (
          <footer className="py-8 text-center">
            <p className="text-slate-600 text-xs">
              Powered by AI • Built with curiosity
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;

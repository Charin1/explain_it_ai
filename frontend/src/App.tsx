import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Atom, Settings2, ChevronDown } from 'lucide-react';
import { explainIt, getModels, type ExplanationResponse, type ModelInfo } from './api';
import ExplanationResult from './components/ExplanationResult';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplanationResponse | null>(null);
  const [error, setError] = useState('');

  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const availableModels = await getModels();
        setModels(availableModels);
        if (availableModels.length > 0) {
          // Default to the first one or specific favorite if present
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

    try {
      const data = await explainIt(
        query,
        selectedModel?.provider,
        selectedModel?.name
      );
      setResult(data);
    } catch (err) {
      setError('Failed to fetch explanation. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="py-6 border-b border-white/10 glass-panel rounded-none mb-10 sticky top-0 z-50">
        <div className="container flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
              <Atom className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Everyday Physics Bot
              </h1>
              <p className="text-sm text-gray-400">Understand the magic behind the mundane</p>
            </div>
          </div>

          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
              className="flex items-center gap-2 bg-[#1e293b] border border-gray-700 hover:border-blue-500 text-sm text-gray-300 px-4 py-2 rounded-lg transition-colors"
            >
              <Settings2 className="w-4 h-4" />
              <span>{selectedModel ? selectedModel.label : 'Select Model'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isModelMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-2 py-1 uppercase tracking-wider">Available Models</div>
                  {models.map((model) => (
                    <button
                      key={`${model.provider}-${model.name}`}
                      onClick={() => {
                        setSelectedModel(model);
                        setIsModelMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedModel?.name === model.name
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                      <div className="font-medium">{model.label}</div>
                      <div className={`text-xs ${selectedModel?.name === model.name ? 'text-blue-200' : 'text-gray-500'}`}>
                        by {model.provider}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container max-w-4xl">
        {/* Search Input */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What are you <span className="text-blue-400">curious</span> about?
          </h2>

          <form onSubmit={handleExplain} className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Why does my coffee cool down?"
                  className="w-full bg-[#1e293b] text-white placeholder-gray-400 text-lg px-6 py-4 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all pr-32"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  {loading ? 'Thinking...' : 'Explain'}
                </button>
              </div>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Try: "Why is the sky blue?" or "How do magnets work?"
            </p>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg mb-8 text-center animate-fade-in">
            {error}
          </div>
        )}

        {/* Results */}
        {result && <ExplanationResult data={result} />}
      </div>
    </div>
  );
}

export default App;

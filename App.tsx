
import React, { useState, useCallback, useRef } from 'react';
import { DesignType, DesignResult } from './types';
import { INTERIOR_STYLES, LANDSCAPE_STYLES } from './constants';
import { StyleCard } from './components/StyleCard';
import { redesignSpace } from './geminiService';

const App: React.FC = () => {
  const [designType, setDesignType] = useState<DesignType>(DesignType.INTERIOR);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [results, setResults] = useState<DesignResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDesign = async () => {
    if (!image || !selectedStyle) {
      setError("Please upload an image and select a style first.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const resultImage = await redesignSpace(
        image,
        imageMimeType,
        prompt,
        selectedStyle,
        designType
      );

      const newResult: DesignResult = {
        id: Date.now().toString(),
        originalImage: image,
        resultImage,
        prompt,
        style: selectedStyle,
        timestamp: Date.now(),
      };

      setResults([newResult, ...results]);
      // Smooth scroll to results
      window.scrollTo({ top: document.getElementById('results')?.offsetTop ?? 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = designType === DesignType.INTERIOR ? INTERIOR_STYLES : LANDSCAPE_STYLES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="serif text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
          Visionary Spaces
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Transform your home and garden using cutting-edge AI. Upload a photo, pick a style, and see the future of your space.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Step 1: Upload & Config */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span>
              Upload Photo
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-8 transition-colors text-center bg-slate-50 hover:bg-indigo-50/30"
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*"
              />
              {image ? (
                <div className="space-y-4">
                  <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                  <p className="text-indigo-600 text-sm font-medium">Click to change photo</p>
                </div>
              ) : (
                <div className="space-y-4 py-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold">Click to upload</p>
                    <p className="text-slate-500 text-sm mt-1">PNG, JPG or WEBP</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">2</span>
              Project Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Type</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setDesignType(DesignType.INTERIOR)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      designType === DesignType.INTERIOR ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Interior
                  </button>
                  <button 
                    onClick={() => setDesignType(DesignType.LANDSCAPE)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                      designType === DesignType.LANDSCAPE ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instructions (Optional)</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Add more lighting, remove the old rug, use hardwood floors..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  rows={4}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 animate-pulse">
                  {error}
                </div>
              )}

              <button 
                onClick={handleDesign}
                disabled={isGenerating || !image || !selectedStyle}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                  isGenerating || !image || !selectedStyle
                    ? 'bg-slate-300 cursor-not-allowed'
                    : designType === DesignType.INTERIOR 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-1'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Designing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Vision
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        {/* Step 2: Style Selection */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg">3</span>
              Select Style
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {styles.map((style) => (
                <StyleCard 
                  key={style.id} 
                  style={style} 
                  isSelected={selectedStyle === style.name}
                  onSelect={setSelectedStyle}
                />
              ))}
            </div>
          </section>

          {/* Results Area */}
          {results.length > 0 && (
            <div id="results" className="space-y-12 py-8">
              <h2 className="serif text-4xl font-bold text-slate-900 border-b border-slate-200 pb-4">Your Designs</h2>
              {results.map((res) => (
                <div key={res.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative group">
                      <img src={res.originalImage} alt="Original" className="w-full h-full object-cover aspect-square" />
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">Original</div>
                    </div>
                    <div className="relative group">
                      <img src={res.resultImage} alt="Redesign" className="w-full h-full object-cover aspect-square" />
                      <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">AI Re-imagined</div>
                    </div>
                  </div>
                  <div className="p-8 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{res.style} Style</h3>
                      <p className="text-slate-600 italic mt-1">"{res.prompt || 'Clean re-design'}"</p>
                      <p className="text-slate-400 text-sm mt-4">{new Date(res.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4">
                      <a 
                        href={res.resultImage} 
                        download={`design-${res.id}.png`}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-24 pt-12 border-t border-slate-200 text-center text-slate-500 text-sm pb-12">
        <p>© 2024 Visionary Spaces AI. All images are AI generated and for conceptual visualization only.</p>
      </footer>
    </div>
  );
};

export default App;

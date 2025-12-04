import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Wallet, 
  Sparkles, 
  Image as ImageIcon, 
  Zap, 
  LayoutGrid, 
  Search, 
  Menu, 
  X, 
  Heart,
  Share2,
  Download
} from 'lucide-react';

// --- Configuration & Helpers ---

const STYLES = [
  { id: '3d-render', name: '3D Render', prompt: '3d render, octane render, cinema 4d, unreal engine 5, highly detailed' },
  { id: 'pixel-art', name: 'Pixel Art', prompt: 'pixel art, 8-bit, retro game asset, sharp edges' },
  { id: 'cyberpunk', name: 'Cyberpunk', prompt: 'cyberpunk, neon lights, futuristic city, high tech, detailed' },
  { id: 'anime', name: 'Anime', prompt: 'anime style, studio ghibli, vibrant colors, detailed line art' },
  { id: 'surreal', name: 'Surrealism', prompt: 'surrealist art, dreamlike, dali style, abstract shapes, mysterious' },
  { id: 'oil-painting', name: 'Oil Painting', prompt: 'oil painting, textured brushstrokes, classical art style' },
];

const MOCK_NFTS = [
  { id: 1, title: 'Bored Cyber Ape #124', price: '450 XRP', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 2, title: 'Abstract Mind #009', price: '120 XRP', image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 3, title: 'Neon Genesis #77', price: '2,500 XRP', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 4, title: 'Pixel Punk #88', price: '890 XRP', image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
];

// --- Components ---

const Navbar = ({ walletConnected, setWalletConnected }: { walletConnected: boolean, setWalletConnected: (v: boolean) => void }) => {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-pink-500 to-purple-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">XRP<span className="text-pink-500">.Gen</span></span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Explore</a>
              <a href="#" className="text-pink-500 px-3 py-2 rounded-md text-sm font-medium">Create</a>
              <a href="#" className="hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Drops</a>
              <a href="#" className="hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Stats</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
              <Search className="h-5 w-5 text-slate-400" />
            </button>
            <button 
              onClick={() => setWalletConnected(!walletConnected)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
                walletConnected 
                  ? 'bg-slate-800 text-green-400 border border-green-500/30' 
                  : 'bg-white text-slate-900 hover:bg-gray-100'
              }`}
            >
              <Wallet className="h-4 w-4" />
              {walletConnected ? 'r9...4xZ' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NFTCardProps {
  title: string;
  price: string;
  image: string;
  isNew?: boolean;
}

const NFTCard = ({ title, price, image, isNew = false }: NFTCardProps) => {
  return (
    <div className="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1">
      {isNew && (
        <div className="absolute top-3 left-3 z-10 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          New
        </div>
      )}
      <div className="aspect-square overflow-hidden bg-slate-800 relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button className="p-2 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform">
                <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform">
                <Share2 className="h-5 w-5" />
            </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">{title}</h3>
        <div className="flex justify-between items-end mt-2">
          <div>
            <p className="text-xs text-slate-400">Price</p>
            <p className="text-sm font-semibold text-pink-400">{price}</p>
          </div>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-lg transition-colors text-white">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

const GeneratedResult = ({ image, prompt, onMint }: { image: string | null, prompt: string, onMint: () => void }) => {
  if (!image) return null;

  return (
    <div className="animate-fade-in glass-panel rounded-2xl p-6 border border-pink-500/20 shadow-2xl shadow-pink-900/20">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 aspect-square rounded-xl overflow-hidden bg-black border border-slate-700 relative group">
          <img src={image} alt="Generated NFT" className="w-full h-full object-contain" />
           <div className="absolute bottom-4 right-4 flex gap-2">
               <a 
                href={image} 
                download="generated-nft.png"
                className="p-2 bg-slate-900/80 backdrop-blur text-white rounded-lg hover:bg-pink-600 transition-colors"
                title="Download"
               >
                   <Download className="h-5 w-5" />
               </a>
           </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-pink-500/10 text-pink-500 text-xs px-2 py-1 rounded-full border border-pink-500/20">AI Generated</span>
                <span className="bg-purple-500/10 text-purple-500 text-xs px-2 py-1 rounded-full border border-purple-500/20">Preview</span>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white">Untitled Masterpiece</h2>
            <p className="text-slate-400 text-sm mb-6 line-clamp-3 italic">"{prompt}"</p>
            
            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-sm">Mint Price</span>
                <span className="text-white font-mono">20 XRP</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-sm">Network Fee</span>
                <span className="text-white font-mono">0.000012 XRP</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 gap-3 flex flex-col">
            <button 
                onClick={onMint}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-2"
            >
                <Zap className="h-5 w-5 fill-current" />
                Mint to XRP Ledger
            </button>
            <p className="text-center text-xs text-slate-500">
                By minting, you agree to the Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [recentMints, setRecentMints] = useState(MOCK_NFTS);

  // --- API Interaction ---
  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const fullPrompt = `${prompt}, ${selectedStyle.prompt}, high quality, detailed, digital art, trending on artstation`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: fullPrompt }],
        },
      });

      // Find image part
      let imageUrl = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
        setGeneratedPrompt(prompt);
      } else {
        alert("Failed to generate image. Try a different prompt.");
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleMint = () => {
    if (!walletConnected) {
        alert("Please connect your wallet first!");
        setWalletConnected(true); // Auto simulate connect for better UX in demo
        return;
    }
    
    // Simulate Minting
    const newNft = {
        id: Date.now(),
        title: `Gen Art #${Math.floor(Math.random() * 1000)}`,
        price: '20 XRP',
        image: generatedImage!,
    };
    
    setRecentMints([newNft, ...recentMints]);
    setGeneratedImage(null);
    setPrompt('');
    alert("Minted successfully! Check 'Recent Creations'.");
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar walletConnected={walletConnected} setWalletConnected={setWalletConnected} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Create Unique <span className="gradient-text">NFTs</span> with AI
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            The most advanced AI art generator on the XRP Ledger. Turn your imagination into digital assets in seconds.
          </p>
          
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-mono text-slate-300">SYSTEM OPERATIONAL</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
                <span className="text-xs font-mono text-slate-300">XRP: $0.62 (+2.4%)</span>
            </div>
          </div>
        </div>

        {/* Generator Interface */}
        <div className="glass-panel p-1 rounded-2xl mb-20 max-w-5xl mx-auto">
          <div className="bg-slate-900/80 rounded-xl p-6 md:p-8">
            <div className="flex flex-col gap-6">
                {/* Input Area */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Describe your vision</label>
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="A cyberpunk samurai cat wandering in neon tokyo raining..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none h-32 transition-all"
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-600">
                            {prompt.length}/500
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Style Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Art Style</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                                        selectedStyle.id === style.id
                                            ? 'bg-pink-500/10 border-pink-500 text-pink-400'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                                >
                                    {style.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-end">
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !prompt}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                                generating || !prompt
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg hover:shadow-pink-500/20'
                            }`}
                        >
                            {generating ? (
                                <>
                                    <Sparkles className="animate-spin h-5 w-5" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5" />
                                    Generate Art
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Result Area */}
        {generatedImage && (
            <div className="max-w-4xl mx-auto mb-20 scroll-mt-24" id="result">
                <GeneratedResult 
                    image={generatedImage} 
                    prompt={generatedPrompt} 
                    onMint={handleMint}
                />
            </div>
        )}

        {/* Gallery / Recent Mints */}
        <div className="mb-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <LayoutGrid className="h-6 w-6 text-pink-500" />
                    Recent Creations
                </h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">Trending</button>
                    <button className="px-4 py-2 text-sm bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">Top Sellers</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentMints.map((nft) => (
                    <NFTCard 
                        key={nft.id} 
                        title={nft.title} 
                        price={nft.price} 
                        image={nft.image} 
                        isNew={typeof nft.id === 'number' && nft.id > 100} // Basic check for demo
                    />
                ))}
            </div>
            
            <div className="mt-12 text-center">
                <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold transition-colors">
                    View All Collections
                </button>
            </div>
        </div>

      </main>

      <footer className="border-t border-slate-800 bg-slate-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold">XRP.Gen</span>
            </div>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                The premier AI-powered NFT launchpad on the XRP Ledger. 
                Create, mint, and trade unique digital assets with zero gas fees.
            </p>
            <div className="flex justify-center gap-6 text-slate-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
            <p className="mt-8 text-slate-600 text-xs">
                © 2024 XRP.Gen. All rights reserved. Powered by Google Gemini.
            </p>
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
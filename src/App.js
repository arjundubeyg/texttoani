import React, { useState, useEffect, useRef } from 'react';
import Good from "./gifs/good.gif" 
import Morning from "./gifs/morning.gif"
import Hello from "./gifs/hello.gif"
import You from "./gifs/you.gif" 

const SignLanguagePlayer = () => {
  const [inputText, setInputText] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [filteredWords, setFilteredWords] = useState([]);
  const [showFiltered, setShowFiltered] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const gifQueueRef = useRef([]);
  const originalQueueRef = useRef([]);
  const timeoutRef = useRef(null);

  // Define our sign language GIFs
  const signLanguageGifs = [
    { word: "good", gifPath: Good },
    { word: "morning", gifPath: Morning },
    { word: "hello", gifPath: Hello },
    { word: "you", gifPath: You},
  ];
  
  // Words to filter out
  const filterWords = ["it", "the", "a", "an", "in", "and", "or", "but", "is", "are"];

  const processText = () => {
    if (isPlaying) return;
    
    const text = inputText.trim().toLowerCase();
    if (!text) return;
    
    // Split text into words
    let words = text.split(/\s+/);
    
    // Filter out words
    const originalWords = [...words];
    words = words.filter(word => !filterWords.includes(word));
    
    // Check if words were filtered
    const filtered = originalWords.filter(word => filterWords.includes(word));
    setFilteredWords(filtered);
    setShowFiltered(filtered.length > 0);
    
    // Create queue of GIFs to play
    const queue = [];
    words.forEach(word => {
      const gifData = signLanguageGifs.find(item => item.word === word);
      if (gifData) {
        queue.push(gifData);
      }
    });
    
    // Store the original queue for looping
    originalQueueRef.current = [...queue];
    gifQueueRef.current = [...queue];
    
    // Reset loop count
    setLoopCount(0);
    
    // Start playing if we have GIFs in the queue
    if (queue.length > 0) {
      setIsPlaying(true);
      playNextGif();
    } else {
      setCurrentWord('');
    }
  };

  const playNextGif = () => {
    if (gifQueueRef.current.length === 0) {
      // Queue is empty, reset it and start over
      gifQueueRef.current = [...originalQueueRef.current];
      setLoopCount(prevCount => prevCount + 1);
    }
    
    // Get the next GIF from the queue
    const nextGif = gifQueueRef.current.shift();
    
    // Display the GIF
    setCurrentWord(nextGif.word);
    
    // After 2 seconds, play the next GIF
    timeoutRef.current = setTimeout(playNextGif, 2000);
  };

  const stopPlayback = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPlaying(false);
    setCurrentWord('');
    gifQueueRef.current = [];
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      processText();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Sign Language Translator</h1>
        
        <div className="mb-8">
          <div className="relative mb-4">
            <input 
              type="text" 
              id="textInput" 
              className="w-full px-5 py-4 text-lg border-2 border-indigo-200 rounded-lg outline-none focus:border-indigo-500 transition-colors bg-gray-50"
              placeholder="Type your message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              className={`flex-1 py-3 px-6 rounded-lg font-medium text-white shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none ${isPlaying ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              onClick={processText}
              disabled={isPlaying}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                </svg>
                Play
              </span>
            </button>
            
            {isPlaying && (
              <button 
                className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none"
                onClick={stopPlayback}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"></path>
                  </svg>
                  Stop
                </span>
              </button>
            )}
          </div>
          
          {showFiltered && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                <span>Filtered words: <span className="font-medium">{filteredWords.join(", ")}</span></span>
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative w-80 h-80 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-inner flex items-center justify-center overflow-hidden border-2 border-indigo-100">
            {isPlaying && currentWord ? (
              <>
                <img 
                  src={signLanguageGifs.find(item => item.word === currentWord)?.gifPath} 
                  alt={`${currentWord} sign`} 
                  className="max-w-full max-h-full object-contain"
                />
              
         
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <svg className="w-20 h-20 text-indigo-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <p className="text-indigo-800 font-medium">
                  {originalQueueRef.current.length > 0 && !isPlaying 
                    ? "Paused - Press Play to continue" 
                    : "Enter text and press Play to start"}
                </p>
              </div>
            )}
          </div>
          
         
         
        </div>
      </div>
    </div>
  );
};

export default SignLanguagePlayer;
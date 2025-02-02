import React, { useState, useRef, useCallback } from 'react';
import { Heart } from 'lucide-react';

const ValentinesPrompt = () => {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [noButtonMessage, setNoButtonMessage] = useState("No?");
  const noButtonRef = useRef(null);

  const yesResponses = [
    " I knew you'd say yes!\n|| This makes me so happy\n ||Let's make it special 💖"
    
  ];

  const noButtonMessages = [
    "No?",
    "Please say yes",
    "Last chance!",
  ];

  const updateNoButtonMessage = useCallback(() => {
    if (noCount < noButtonMessages.length - 1) {
      setNoButtonMessage(noButtonMessages[Math.min(noCount + 1, noButtonMessages.length - 1)]);
    }
  }, [noCount]);

  const handleMouseMove = (e) => {
    if (!noButtonRef.current || yesPressed) return;

    const rect = noButtonRef.current.getBoundingClientRect();
    const buttonCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const distance = Math.sqrt(
      Math.pow(e.clientX - buttonCenter.x, 2) + 
      Math.pow(e.clientY - buttonCenter.y, 2)
    );

    if (distance < 100) {
      const deltaX = buttonCenter.x - e.clientX;
      const deltaY = buttonCenter.y - e.clientY;
      const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Normalize and scale movement away from cursor
      const moveX = (deltaX / magnitude) * 200;
      const moveY = (deltaY / magnitude) * 200;
      
      const newX = Math.min(Math.max(0, rect.left + moveX), window.innerWidth - rect.width);
      const newY = Math.min(Math.max(0, rect.top + moveY), window.innerHeight - rect.height);

      requestAnimationFrame(() => {
        noButtonRef.current.style.transition = 'transform 0.4s ease-out';
        noButtonRef.current.style.position = 'fixed';
        noButtonRef.current.style.transform = `translate(${newX - rect.left}px, ${newY - rect.top}px)`;
      });

      setNoCount((prev) => prev + 1);

      // Use debounce-like logic to update message every time the button moves far enough
      if (noCount % 2 === 0) {
        updateNoButtonMessage();
      }
    }
  };

  const getYesButtonSize = () => {
    const sizes = ['px-4 py-2', 'px-6 py-3', 'px-8 py-4', 'px-10 py-5', 'px-12 py-6'];
    return sizes[Math.min(noCount, sizes.length - 1)];
  };

  if (yesPressed) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-pink-50">
        <div className="text-4xl font-bold text-pink-600 mb-8">
          {yesResponses[Math.floor(Math.random() * yesResponses.length)]}
        </div>
        <Heart className="text-red-500 animate-bounce" size={100} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-pink-50 overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="text-4xl font-bold text-pink-600 mb-8">
        Will you be my Valentine?
      </div>
      <div className="flex gap-4 items-center">
        <button
          className={`${getYesButtonSize()} bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transform hover:scale-110 transition-all duration-300`}
          onClick={() => setYesPressed(true)}
        >
          Yes!
        </button>
        <button
          ref={noButtonRef}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all duration-300"
        >
          {noButtonMessage}
        </button>
      </div>
    </div>
  );
};

export default ValentinesPrompt;

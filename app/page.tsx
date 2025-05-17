"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import Image from "next/image";
import Vapi from "@vapi-ai/web";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [vapiClient, setVapiClient] = useState<Vapi | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  // This is a hook that is used to set the Mini App is in a  ready state
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // This is a hook that is used to add  the Mini App
  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  // This is a hook that is used to save the Mini App
  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        // @ts-expect-error - webkitAudioContext is supported in some browsers
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        setAudioContext(context);
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    };

    initAudio();
  }, []);

  // Initialize Vapi client
  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || "");
    setVapiClient(vapi);

    // Cleanup function
    return () => {
      if (vapi) {
        vapi.stop();
      }
    };
  }, []);

  const handleLogoClick = async () => {
    try {
      if (!vapiClient) {
        console.error("Vapi client not initialized");
        return;
      }

      // Resume audio context on user interaction (required for mobile)
      if (audioContext && audioContext.state === "suspended") {
        await audioContext.resume();
      }

      if (isCalling) {
        // Stop the call
        await vapiClient.stop();
      } else {
        // Start the call
        await vapiClient.start("f169e7e7-3c14-4f10-adfa-1efe00219990");
      }

      setIsCalling(!isCalling);
      setIsAnimating(!isAnimating);
    } catch (error) {
      console.error("Error handling Vapi call:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <p className="text-2xl"><b>Farlo</b></p>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">
          <p className="text-lg text-center">Call Farlo to learn about Farcaster!</p>
          <div className="relative w-48 h-48 mt-28">
            <div 
              className={`absolute inset-0 rounded-full cursor-pointer transition-transform duration-300 hover:scale-105 z-10 ${isCalling ? 'animate-pulse' : ''}`}
              onClick={handleLogoClick}
            >
              <Image
                src="/logo.png"
                alt="Farlo Logo"
                fill
                className="rounded-full object-cover"
                priority
              />
            </div>
            {isCalling && isAnimating && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-[var(--app-accent)] animate-ping opacity-75 z-0"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[var(--app-accent)] animate-ping animation-delay-1000 opacity-50 z-0"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[var(--app-accent)] animate-ping animation-delay-2000 opacity-25 z-0"></div>
              </>
            )}
          </div>

          {/* Simple Audio Test Component */}
          <div className="mt-8 p-4 border rounded-lg">
            <p className="text-sm mb-2">Audio Test:</p>
            <button 
              onClick={async () => {
                try {
                  console.log('Starting audio test...');
                  
                  // Check if AudioContext is available
                  if (!window.AudioContext && !(window as any).webkitAudioContext) {
                    throw new Error('AudioContext not supported');
                  }
                  console.log('AudioContext is supported');

                  // Create audio context
                  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                  const audioContext = new AudioContext();
                  console.log('AudioContext created, state:', audioContext.state);

                  // Create a simple beep
                  const oscillator = audioContext.createOscillator();
                  console.log('Oscillator created');

                  // Set up the oscillator
                  oscillator.type = 'sine';
                  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                  console.log('Oscillator configured');

                  // Connect to destination
                  oscillator.connect(audioContext.destination);
                  console.log('Connected to audio destination');

                  // Start and stop
                  oscillator.start();
                  console.log('Oscillator started');
                  
                  // Stop after 1 second
                  setTimeout(() => {
                    oscillator.stop();
                    console.log('Oscillator stopped');
                  }, 1000);

                } catch (error) {
                  console.error('Audio test error:', error);
                  alert(`Audio test failed: ${error.message}\nCheck console for details`);
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Play Test Tone
            </button>
            <p className="text-xs text-gray-500 mt-2">Check console for detailed logs</p>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 bg-[var(--app-background)] border-t border-[var(--app-gray)] py-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}

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
            <p className="text-2xl"><b>Farlo 🛰️</b></p>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">
          <p className="text-lg text-center">Call Farlo to learn about Farcaster!</p>
          <div className="relative w-48 h-48 mt-28">
            <div 
              className="absolute inset-0 rounded-full z-0"
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
                <div className="absolute inset-0 rounded-full border-4 border-[var(--app-accent)] animate-ping opacity-75 z-[-1]"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[var(--app-accent)] animate-ping animation-delay-1000 opacity-50 z-[-1]"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[var(--app-accent)] animate-ping animation-delay-2000 opacity-25 z-[-1]"></div>
              </>
            )}
          </div>

          <div className="relative z-10">
            <button
              onClick={handleLogoClick}
              className={`mt-6 px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                isCalling 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white'
              }`}
            >
              <Icon name={isCalling ? "stop" : "play"} size="sm" />
              <p className="text-md font-medium">{isCalling ? 'End Call' : 'Meet Farlo'}</p>
            </button>
          </div>

          <button
            onClick={() => {
              window.open(
                "https://warpcast.com/~/compose?text=Just%20met%20Farlo%2C%20who%20introduced%20me%20to%20Farcaster!%0A%0AAsk%20him%20for%20new%20channel%20%2B%20follow%20recs%3A&embeds[]=https://test-mini-app-phi.vercel.app",
                "_blank"
              );
            }}
            className="mt-24 px-4 py-2 bg-[var(--app-accent)] text-white rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <p className="text-md">Share experience</p>
            <Icon name="arrow-right" size="sm" />
          </button>

          {/* <button
            onClick={() => {
              try {
                console.log('Starting audio test...');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz = A4 note
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Set volume to 10%
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                console.log('Playing test tone...');
                oscillator.start();
                
                // Stop after 1 second
                setTimeout(() => {
                  console.log('Stopping test tone...');
                  oscillator.stop();
                  audioContext.close();
                }, 1000);
              } catch (error) {
                console.error('Audio test failed:', error);
                alert('Audio test failed. Please check console for details.');
              }
            }}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
          >
            Test Audio
          </button> */}
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

import Head from "next/head";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, Button, Spinner, Alert, Container, Row, Col, Modal } from "react-bootstrap";
import { toast, Toaster } from 'sonner';
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import { SixFiveTwoNineVotingSDK } from "../lib/6529-voting-sdk";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (accounts: string[]) => void) => void;
      removeListener: (event: string, handler: (accounts: string[]) => void) => void;
    };
  }
}

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

interface TopSubmission {
  id: string;
  serial_no: number;
  author: {
    handle: string;
    primary_address: string;
    id?: string;
  };
  metadata?: Array<{
    data_key: string;
    data_value: string;
  }>;
  title?: string;
  content?: string;
  picture?: string;
  vote_count: number;
  raters_count: number;
  rating_prediction: number;
  realtime_rating: number;
  rank?: number;
  savedVoteAmount?: number; // Store original vote amount
}

interface FloatingMeme extends TopSubmission {
  x: number;
  y: number;
  speed: number;
}

export const calculateAllocations = (
  total: number, 
  filledCount: number, 
  method: string, 
  filledSlots: TopSubmission[] = []
) => {
  if (filledCount === 0) return [];
  
  if (method === 'current') {
    return filledSlots.map(s => s.savedVoteAmount || 0);
  }
  
  if (method === 'exponential') {
    let remaining = total;
    const res: number[] = [];
    for (let i = 0; i < filledCount; i++) {
      if (i === filledCount - 1) {
        res.push(remaining);
      } else {
        const amount = Math.floor(remaining * 0.5);
        res.push(amount);
        remaining -= amount;
      }
    }
    return res;
  }
  
  if (total <= 0) return Array(filledCount).fill(0);
  
  const weights: number[] = [];
  if (method === 'even') {
    for (let i = 0; i < filledCount; i++) weights.push(1);
  } else if (method === 'linear') {
    for (let i = 0; i < filledCount; i++) {
      weights.push(filledCount - i);
    }
  } else if (method === 'geometric') {
    for (let i = 0; i < filledCount; i++) {
      weights.push(1 / Math.pow(i + 1, 0.85));
    }
  } else if (method === 'gaussian') {
    const sigma = Math.max(1.5, filledCount / 3);
    for (let i = 0; i < filledCount; i++) {
      weights.push(Math.exp(-Math.pow(i, 2) / (2 * Math.pow(sigma, 2))));
    }
  }

  const sumWeights = weights.reduce((sum, w) => sum + w, 0);
  const allocations = weights.map(w => Math.floor((w / sumWeights) * total));
  
  let allocatedSum = allocations.reduce((sum, val) => sum + val, 0);
  let remainder = total - allocatedSum;
  
  let idx = 0;
  while (remainder > 0) {
    allocations[idx % filledCount] += 1;
    remainder--;
    idx++;
  }
  
  return allocations;
};

export const getMediaUrl = (meme: TopSubmission) => {
  if (meme.picture && (meme.picture.includes('arweave.net') || meme.picture.toLowerCase().includes('.html'))) {
    return meme.picture;
  }
  if (meme.content) {
    const match = meme.content.match(/(https?:\/\/[^\s]+arweave\.net\/[^\s]+)/i) || 
                  meme.content.match(/(https?:\/\/arweave\.net\/[a-zA-Z0-9_-]+)/i);
    if (match) return match[1];
  }
  return meme.picture;
};

export const getRandomSpacedY = (activeList: FloatingMeme[], minVal: number, maxVal: number) => {
  let y = minVal + Math.random() * (maxVal - minVal);
  let attempts = 0;
  while (attempts < 15) {
    const overlaps = activeList.some(m => m.x > 75 && Math.abs(m.y - y) < 14);
    if (!overlaps) break;
    y = minVal + Math.random() * (maxVal - minVal);
    attempts++;
  }
  return Math.max(2, Math.min(y, 90));
};

const FloatingCard = ({ 
  meme, 
  onDragStart, 
  onDragEnd,
  onClick, 
  onHoverChange,
  isDragged
}: { 
  meme: FloatingMeme; 
  onDragStart: (e: React.DragEvent, meme: FloatingMeme) => void;
  onDragEnd: () => void;
  onClick: (meme: FloatingMeme) => void;
  onHoverChange: (id: string | null) => void;
  isDragged: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange(meme.id);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(null);
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  };

  const mediaUrl = getMediaUrl(meme);
  const isIframe = mediaUrl && (mediaUrl.includes('arweave.net') || mediaUrl.toLowerCase().includes('.html'));
  const isVideo = !isIframe && (mediaUrl?.toLowerCase().includes('.mp4') || 
                                mediaUrl?.toLowerCase().includes('.mov') || 
                                mediaUrl?.toLowerCase().includes('.webm'));

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, meme)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(meme)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`floating-meme-card ${isHovered ? 'hovered' : ''}`}
      style={{
        position: 'absolute',
        left: `${meme.x}%`,
        top: `${meme.y}%`,
        cursor: 'grab',
        transition: isHovered ? 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s' : 'none',
        zIndex: isHovered ? 100 : 2,
        opacity: isDragged ? 0 : 1,
        pointerEvents: isDragged ? 'none' : 'auto'
      }}
    >
      <div 
        className="card-media-wrapper" 
        style={{ 
          aspectRatio: isIframe ? "16/9" : "auto", 
          height: isIframe ? "140px" : "auto", 
          position: "relative",
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        {mediaUrl ? (
          isIframe ? (
            <>
              <iframe
                src={mediaUrl}
                title={meme.title}
                sandbox="allow-scripts allow-same-origin"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, background: "transparent" }} />
            </>
          ) : isVideo ? (
            <video
              ref={videoRef}
              src={mediaUrl}
              muted
              loop
              playsInline
              autoPlay
              className="floating-card-media"
              draggable={false}
            />
          ) : (
            <img src={mediaUrl} alt={meme.title} className="floating-card-media" draggable={false} />
          )
        ) : (
          <div className="floating-card-fallback">Art</div>
        )}
      </div>
    </div>
  );
};

const getRandomSpeed = () => {
  return 0.03 + Math.random() * 0.04;
};

export default function Top20Voting() {
  // Inject style tokens
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

      .text-muted {
        color: rgba(255, 255, 255, 0.65) !important;
      }
      .form-control {
        color: #ffffff !important;
        background-color: #12111a !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
      }
      .form-control:focus {
        background-color: #161522 !important;
        border-color: #ffb000 !important;
        box-shadow: 0 0 0 0.2rem rgba(255, 176, 0, 0.25) !important;
      }
      .form-control:disabled {
        background-color: rgba(255, 255, 255, 0.03) !important;
        color: rgba(255, 255, 255, 0.45) !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
      }
      .card.bg-dark {
        background-color: rgba(18, 16, 28, 0.95) !important;
        color: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }

      .top20-fullscreen-layout {
        background: radial-gradient(circle at 50% 50%, #0d0b18 0%, #030206 100%);
        color: #f8f9fa;
        min-height: 100vh;
        height: auto;
        display: flex;
        flex-direction: column;
        overflow: visible;
        font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif;
        padding: 30px;
      }
      .top20-split-workspace {
        display: flex;
        flex-direction: row;
        gap: 32px;
        height: auto;
        overflow: visible;
        width: 100%;
      }
      .title-glow {
        background: linear-gradient(135deg, #ffb000 0%, #ff7a00 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        text-shadow: 0 0 40px rgba(255, 176, 0, 0.2);
      }
      .slots-pane {
        width: 420px;
        min-width: 420px;
        height: auto;
        overflow: visible;
        background: rgba(14, 12, 24, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.03);
        border-radius: 16px;
        padding: 24px;
        box-sizing: border-box;
        backdrop-filter: blur(12px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
      }
      .slots-pane::-webkit-scrollbar-thumb {
        background: rgba(255, 176, 0, 0.25);
        border-radius: 3px;
      }
      .slots-pane::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 176, 0, 0.5);
      }
      .rank-slot {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.01);
        border: 1px dashed rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        margin-bottom: 6px;
        min-height: 52px;
        transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        cursor: pointer;
        position: relative;
        overflow: visible;
      }
      .rank-slot.drag-over {
        border-color: #ffb000;
        background: rgba(255, 176, 0, 0.06);
        box-shadow: 0 0 12px rgba(255, 176, 0, 0.2);
      }
      .rank-number {
        font-size: 0.95rem;
        font-weight: 700;
        color: rgba(255, 176, 0, 0.5);
        min-width: 18px;
        text-align: center;
      }
      .rank-slot.filled {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 176, 0, 0.15);
        cursor: grab;
      }
      .rank-slot.filled:active {
        cursor: grabbing;
      }
      .slot-thumbnail {
        width: 36px;
        height: 36px;
        border-radius: 4px;
        object-fit: cover;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .slot-info {
        flex-grow: 1;
        min-width: 0;
      }
      .slot-title {
        font-weight: 600;
        font-size: 0.8rem;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #f0f0f5;
      }
      .slot-artist {
        font-size: 0.65rem;
        color: #888;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .slot-tdh {
        font-size: 0.72rem;
        font-weight: 700;
        color: #ffb000;
        background: rgba(255, 176, 0, 0.08);
        padding: 1px 6px;
        border-radius: 8px;
        white-space: nowrap;
      }
      @keyframes checkmark-fade-out {
        0% {
          opacity: 1;
          transform: scale(0.6);
        }
        15% {
          opacity: 1;
          transform: scale(1.1);
        }
        70% {
          opacity: 1;
          transform: scale(1.1);
        }
        100% {
          opacity: 0;
          transform: scale(0.8);
        }
      }
      .confirmed-checkmark {
        color: #10b981;
        font-size: 1rem;
        font-weight: bold;
        line-height: 1;
        display: block;
        animation: checkmark-fade-out 3.5s forwards cubic-bezier(0.16, 1, 0.3, 1);
      }
      .slot-remove {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.35);
        font-size: 1.1rem;
        padding: 0 4px;
        cursor: pointer;
        line-height: 1;
        transition: color 0.15s;
      }
      .slot-remove:hover {
        color: #ff4d4d;
      }
      .stream-pane {
        flex-grow: 1;
        height: auto;
        min-height: 1300px;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
        background: rgba(4, 4, 7, 0.2);
        position: relative;
        overflow-x: hidden;
        overflow-y: visible;
      }
      .floating-pool-container {
        flex-grow: 1;
        position: relative;
        background: #020204;
        border-radius: 16px;
        overflow-x: hidden;
        overflow-y: visible;
        border: 1px solid rgba(255, 176, 0, 0.04);
        background-image: 
          linear-gradient(rgba(255, 176, 0, 0.012) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 176, 0, 0.012) 1px, transparent 1px);
        background-size: 45px 45px;
        width: 100%;
        min-height: 1250px;
        height: auto;
      }
      .floating-meme-card {
        width: 200px;
        height: auto;
        border-radius: 12px;
        background: rgba(14, 14, 22, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
        transition: border-color 0.25s, box-shadow 0.25s;
      }
      .floating-meme-card.hovered {
        border-color: #ffb000;
        box-shadow: 0 0 25px rgba(255, 176, 0, 0.45);
        transform: scale(1.35);
        z-index: 100;
      }
      .card-media-wrapper {
        width: 100%;
        height: auto;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
      }
      .floating-card-media {
        width: 100%;
        height: auto;
        display: block;
        object-fit: contain;
      }
      .floating-card-fallback {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        background: #121217;
        color: #666;
        font-size: 0.8rem;
      }
      .nope-hole {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 95px;
        height: 95px;
        border-radius: 50%;
        background: radial-gradient(circle, #000 35%, #180900 65%, #d14900 100%);
        box-shadow: 0 0 15px rgba(209, 73, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        z-index: 1000;
        border: 2px solid rgba(209, 73, 0, 0.2);
        overflow: hidden;
      }
      .nope-hole:hover, .nope-hole.pulsing-glowing {
        transform: scale(1.1);
        border-color: #d14900;
        box-shadow: 0 0 30px rgba(209, 73, 0, 0.85), inset 0 0 10px rgba(0, 0, 0, 0.9);
      }
      .nope-hole-portal {
        position: absolute;
        width: 100%;
        height: 100%;
        background: repeating-conic-gradient(from 0deg, transparent 0deg 30deg, rgba(209, 73, 0, 0.08) 30deg 60deg);
        border-radius: 50%;
        animation: portal-spin 8s linear infinite;
      }
      .nope-hole-label {
        position: relative;
        font-size: 0.75rem;
        font-weight: 900;
        color: #ff9100;
        text-shadow: 0 0 8px rgba(209, 73, 0, 0.8);
        pointer-events: none;
        letter-spacing: 0.05em;
      }
      @keyframes portal-spin {
        100% {
          transform: rotate(-360deg);
        }
      }
      .custom-lightbox-modal {
        background: #08080c !important;
        border: 1px solid rgba(255, 176, 0, 0.3) !important;
        box-shadow: 0 0 60px rgba(255, 176, 0, 0.15) !important;
        border-radius: 16px !important;
      }
      .inspect-media-container {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 20px;
        min-height: 450px;
        max-height: 70vh;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      .inspect-media {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
      }
      .lightbox-desc {
        color: #e2e2e9 !important;
        font-size: 0.95rem !important;
        line-height: 1.6;
      }
      .distribution-badge {
        cursor: pointer;
        transition: all 0.2s;
        padding: 6px 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.02);
        color: #aaa;
        font-weight: 600;
        font-size: 0.8rem;
      }
      .distribution-badge:hover {
        border-color: rgba(255, 176, 0, 0.3);
        color: #fff;
      }
      .distribution-badge.active {
        background: rgba(255, 176, 0, 0.12);
        border-color: #ffb000;
        color: #ffb000;
        box-shadow: 0 0 12px rgba(255, 176, 0, 0.15);
      }
      .rank-slider-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        background: rgba(255, 255, 255, 0.015);
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 15px;
      }
      .rank-slider-value {
        font-size: 1.8rem;
        font-weight: 800;
        color: #ffb000;
        text-shadow: 0 0 15px rgba(255, 176, 0, 0.35);
        background: rgba(255, 176, 0, 0.05);
        padding: 2px 14px;
        border-radius: 8px;
        border: 1px solid rgba(255, 176, 0, 0.12);
        min-width: 100px;
        text-align: center;
      }
      .vertical-slider-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 240px;
        justify-content: space-between;
        padding: 10px 0;
      }
      .vertical-slider {
        -webkit-appearance: slider-vertical;
        writing-mode: bt-lr;
        width: 10px;
        height: 180px;
        background: rgba(255, 255, 255, 0.08);
        outline: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .vertical-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #ffb000;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(255, 176, 0, 0.8);
        border: 2px solid #ffffff;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Web3 state
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sdk, setSdk] = useState<SixFiveTwoNineVotingSDK | null>(null);

  // Data states
  const [slots, setSlots] = useState<(TopSubmission | null)[]>(Array(20).fill(null));

  const setCompactedSlots = (newSlots: (TopSubmission | null)[]) => {
    const filled = newSlots.filter((s): s is TopSubmission => s !== null);
    const result = Array(20).fill(null);
    for (let i = 0; i < Math.min(20, filled.length); i++) {
      result[i] = filled[i];
    }
    setSlots(result);
  };
  const [activeMemes, setActiveMemes] = useState<FloatingMeme[]>([]);
  const [nopedMemes, setNopedMemes] = useState<TopSubmission[]>([]);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [isNopeDragOver, setIsNopeDragOver] = useState(false);
  const floatingPoolRef = useRef<TopSubmission[]>([]);
  const [userTDHBalance, setUserTDHBalance] = useState<number>(0);
  const [userTDHTotal, setUserTDHTotal] = useState<number>(0);
  const [isLoadingMainStage, setIsLoadingMainStage] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Distribution config
  const [totalTDH, setTotalTDH] = useState<number>(0);
  const [distribution, setDistribution] = useState<string>("geometric");

  // Hover state for conveyor pausing
  const [hoveredMemeId, setHoveredMemeId] = useState<string | null>(null);

  // Lightbox inspect modal
  const [inspectingMeme, setInspectingMeme] = useState<TopSubmission | null>(null);

  // Active dragging states for layout styling
  const [activeDragOverIndex, setActiveDragOverIndex] = useState<number | null>(null);
  const [isPoolDragOver, setIsPoolDragOver] = useState(false);
  const [confirmedSlotIndices, setConfirmedSlotIndices] = useState<Record<number, boolean>>({});
  const [draggedStreamMemeId, setDraggedStreamMemeId] = useState<string | null>(null);
  const [draggedSlotIndex, setDraggedSlotIndex] = useState<number | null>(null);
  const [draggedVoidMemeId, setDraggedVoidMemeId] = useState<string | null>(null);
  const isDropHandledRef = useRef<boolean>(false);
  const activeMemesRef = useRef<FloatingMeme[]>([]);
  useEffect(() => {
    activeMemesRef.current = activeMemes;
  }, [activeMemes]);

  const initialSavedVotesRef = useRef<{ drop: TopSubmission; voteAmount: number }[]>([]);

  const visibleYRangeRef = useRef({ min: 5, max: 95 });

  // Track viewport vertical scrolling boundaries as percentages of the document
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight || 1300;
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      const minY = Math.max(2, (scrollTop / docHeight) * 100);
      const maxY = Math.min(98, ((scrollTop + viewportHeight) / docHeight) * 100);
      
      visibleYRangeRef.current = { min: minY, max: maxY };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    
    const interval = setInterval(handleScroll, 500);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(interval);
    };
  }, []);

  // Save void memes layout state to localStorage
  useEffect(() => {
    if (typeof localStorage !== "undefined" && typeof localStorage.setItem === "function") {
      localStorage.setItem('6529_void_memes', JSON.stringify(nopedMemes.map(m => m.id)));
    }
  }, [nopedMemes]);

  // Map SDK structure to client structure
  const sdkDropToTopSubmission = (sdkDrop: any): TopSubmission => ({
    id: sdkDrop.id,
    serial_no: sdkDrop.serial_no,
    author: {
      handle: sdkDrop.author?.handle || "Unknown",
      primary_address: sdkDrop.author?.primary_address || "",
      id: sdkDrop.author?.id
    },
    metadata: sdkDrop.metadata,
    title: sdkDrop.title || sdkDrop.metadata?.find((m: any) => m.data_key === "title")?.data_value || `Submission #${sdkDrop.serial_no}`,
    content: sdkDrop.content || sdkDrop.metadata?.find((m: any) => m.data_key === "description")?.data_value || "",
    picture: sdkDrop.parts?.[0]?.media?.[0]?.url || sdkDrop.parts?.[0]?.media_url || sdkDrop.media_url || sdkDrop.parts?.[0]?.picture || sdkDrop.picture || sdkDrop.image || "",
    vote_count: sdkDrop.rating_prediction || sdkDrop.realtime_rating || sdkDrop.rating || 0,
    raters_count: sdkDrop.raters_count || 0,
    rating_prediction: sdkDrop.rating_prediction || sdkDrop.realtime_rating || 0,
    realtime_rating: sdkDrop.realtime_rating || 0,
    rank: sdkDrop.rank || 0
  });

  const sdkVoteDistributionToLocalDrop = (sdkDist: any): TopSubmission => ({
    ...sdkDropToTopSubmission(sdkDist.drop),
    savedVoteAmount: sdkDist.voteAmount
  });

  // Return item to floating queue and refill screen if needed
  const returnToPool = useCallback((drop: TopSubmission) => {
    const isDuplicate = floatingPoolRef.current.some(m => m.id === drop.id) ||
                        activeMemesRef.current.some(m => m.id === drop.id);
    if (isDuplicate) return;

    floatingPoolRef.current.push(drop);
    const copy = [...activeMemesRef.current];
    while (copy.length < 10 && floatingPoolRef.current.length > 0) {
      const randIdx = Math.floor(Math.random() * floatingPoolRef.current.length);
      const sub = floatingPoolRef.current.splice(randIdx, 1)[0];
      copy.push({
        ...sub,
        x: 105,
        y: 5 + Math.random() * 65,
        speed: getRandomSpeed()
      });
    }
    setActiveMemes(copy);
  }, []);

  const resetToCurrentVotes = useCallback(() => {
    const originalSlots = Array(20).fill(null);
    initialSavedVotesRef.current.forEach((v, idx) => {
      originalSlots[idx] = v.drop;
    });

    const originalIds = new Set(initialSavedVotesRef.current.map(v => v.drop.id));
    
    slots.forEach(slot => {
      if (slot && !originalIds.has(slot.id)) {
        if (!floatingPoolRef.current.some(m => m.id === slot.id)) {
          floatingPoolRef.current.push(slot);
        }
      }
    });

    originalSlots.forEach(orig => {
      if (orig) {
        floatingPoolRef.current = floatingPoolRef.current.filter(m => m.id !== orig.id);
        setNopedMemes(prev => prev.filter(m => m.id !== orig.id));
      }
    });

    setSlots(originalSlots);

    const copy = [...activeMemesRef.current].filter(m => !originalIds.has(m.id));
    while (copy.length < 10 && floatingPoolRef.current.length > 0) {
      const randIdx = Math.floor(Math.random() * floatingPoolRef.current.length);
      const sub = floatingPoolRef.current.splice(randIdx, 1)[0];
      copy.push({
        ...sub,
        x: 105,
        y: 5 + Math.random() * 65,
        speed: getRandomSpeed()
      });
    }
    setActiveMemes(copy);

    const currentVotesSum = initialSavedVotesRef.current.reduce((sum, v) => sum + v.voteAmount, 0);
    setTotalTDH(currentVotesSum);
  }, [slots]);

  // Initialize SDK
  useEffect(() => {
    const votingSdk = new SixFiveTwoNineVotingSDK({
      callbacks: {
        onAuthenticated: (token) => {
          setAccessToken(token);
        },
        onError: (err) => {
          console.error("SDK Error:", err);
          toast.error(err);
        }
      }
    });
    setSdk(votingSdk);
  }, []);

  // Restore wallet & access token sessions
  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && sdk) {
      const eth = window.ethereum;
      const handleAccounts = (accounts: string[]) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          sdk.setWalletAddress(address);
          
          const savedToken = typeof localStorage !== "undefined" && typeof localStorage.getItem === "function" 
            ? localStorage.getItem('6529_access_token') 
            : null;
          if (savedToken) {
            sdk.setAccessToken(savedToken);
            setAccessToken(savedToken);
            loadVotingData(sdk);
          }
        } else {
          setWalletAddress("");
          setAccessToken(null);
          sdk.clearAuth();
        }
      };

      eth
        .request({ method: "eth_accounts" })
        .then(handleAccounts);

      eth.on("accountsChanged", handleAccounts);
      return () => {
        eth.removeListener("accountsChanged", handleAccounts);
      };
    }
  }, [sdk]);

  // Sync localStorage with token changes
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      if (accessToken) {
        if (typeof localStorage.setItem === "function") {
          localStorage.setItem('6529_access_token', accessToken);
        }
      } else {
        if (typeof localStorage.removeItem === "function") {
          localStorage.removeItem('6529_access_token');
        }
      }
    }
  }, [accessToken]);

  // Load submissions and previous voting structures
  const loadVotingData = async (activeSdk: SixFiveTwoNineVotingSDK) => {
    if (!activeSdk) return;
    setIsLoadingMainStage(true);
    
    try {
      const votingData = await activeSdk.getVotingData({ immediate: true });
      setUserTDHTotal(votingData.user.tdh);
      setUserTDHBalance(votingData.user.availableTDH);
      const allSubs = votingData.submissions.map(sdkDropToTopSubmission);
      
      // Load previous votes into slots sorted descending by user's TDH amount
      const sortedUserVotes = (votingData.userVoteDistribution || [])
        .map(v => ({
          drop: sdkVoteDistributionToLocalDrop(v),
          voteAmount: v.voteAmount
        }))
        .sort((a, b) => b.voteAmount - a.voteAmount)
        .slice(0, 20);

      initialSavedVotesRef.current = sortedUserVotes;

      const initialSlots = Array(20).fill(null);
      sortedUserVotes.forEach((v, idx) => {
        initialSlots[idx] = v.drop;
      });
      setSlots(initialSlots);

      const currentVotesSum = sortedUserVotes.reduce((sum, v) => sum + v.voteAmount, 0);
      if (currentVotesSum > 0) {
        setDistribution("current");
        setTotalTDH(currentVotesSum);
      } else {
        setTotalTDH(votingData.user.availableTDH || votingData.user.tdh || 0);
      }

      // Filter slotted submissions out of pool
      const slottedIds = new Set(sortedUserVotes.map(v => v.drop.id));
      
      // Restore noped memes from localStorage
      let voidSet = new Set<string>();
      try {
        const savedVoidIdsStr = typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function'
          ? localStorage.getItem('6529_void_memes')
          : null;
        if (savedVoidIdsStr) {
          const savedVoidIds = JSON.parse(savedVoidIdsStr);
          if (Array.isArray(savedVoidIds)) {
            voidSet = new Set(savedVoidIds);
          }
        }
      } catch (e) {
        console.error("Failed to parse void memes from localStorage", e);
      }
      
      const voidMemes = allSubs.filter(sub => voidSet.has(sub.id));
      setNopedMemes(voidMemes);

      const poolSubs = allSubs.filter(sub => !slottedIds.has(sub.id) && !voidSet.has(sub.id));

      // Store remaining queue in Ref
      floatingPoolRef.current = poolSubs;

      // Populate up to 8 active floating memes on-screen from random positions in queue
      const initialActive: FloatingMeme[] = [];
      for (let i = 0; i < 8; i++) {
        if (floatingPoolRef.current.length === 0) break;
        const randIdx = Math.floor(Math.random() * floatingPoolRef.current.length);
        const sub = floatingPoolRef.current.splice(randIdx, 1)[0];
        const spawnedY = getRandomSpacedY(initialActive, visibleYRangeRef.current.min, visibleYRangeRef.current.max - 15);
        initialActive.push({
          ...sub,
          x: 5 + Math.random() * 80, // Random starting X
          y: spawnedY,
          speed: 0.01 + Math.random() * 0.015
        });
      }
      
      setActiveMemes(initialActive);
    } catch (error) {
      console.error("Error loading stage data:", error);
      toast.error("Failed to load voting resources");
    } finally {
      setIsLoadingMainStage(false);
    }
  };

  // Math allocation calculation
  const filledSlots = slots.filter((s): s is TopSubmission => s !== null);
  const filledCount = filledSlots.length;
  const allocations = React.useMemo(() => {
    return calculateAllocations(totalTDH, filledCount, distribution, filledSlots);
  }, [totalTDH, filledCount, distribution, slots]);

  useEffect(() => {
    if (distribution === 'current') {
      const currentAllocSum = slots.reduce((sum, s) => sum + (s?.savedVoteAmount || 0), 0);
      setTotalTDH(currentAllocSum);
    }
  }, [distribution, slots]);

  const getAllocationForSlot = (index: number) => {
    let filledIndex = 0;
    for (let i = 0; i < index; i++) {
      if (slots[i] !== null) filledIndex++;
    }
    return slots[index] !== null ? allocations[filledIndex] : 0;
  };

  // 60FPS animation loop for drifting conveyor (smooth continual stream)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const updatePositions = (time: number) => {
      const delta = (time - lastTime) / 16.666;
      lastTime = time;
      
      setActiveMemes(prevActive => {
        let changed = false;
        const nextActive = prevActive.map(m => {
          if (m.id === hoveredMemeId || inspectingMeme !== null || showVoidModal) {
            return m; // Stop drifting on hover or when modals are open
          }
          const newX = m.x - m.speed * delta;
          if (newX !== m.x) changed = true;
          return { ...m, x: newX };
        });

        // Check if any items drifted off the left edge (-2% to prevent slot overlay)
        const kept = nextActive.filter(m => m.x >= -2);
        const drifted = nextActive.filter(m => m.x < -2);

        if (drifted.length > 0) {
          // Recycle off-screen items back into the queue
          drifted.forEach(d => {
            const { x, y, speed, ...rawDrop } = d;
            floatingPoolRef.current.push(rawDrop);
          });

          // Refill active display back to 10 from the queue randomly
          while (kept.length < 10 && floatingPoolRef.current.length > 0) {
            const randIdx = Math.floor(Math.random() * floatingPoolRef.current.length);
            const nextSub = floatingPoolRef.current.splice(randIdx, 1)[0];
            const spawnedY = getRandomSpacedY(kept, visibleYRangeRef.current.min, visibleYRangeRef.current.max - 15);
            kept.push({
              ...nextSub,
              x: 105, // start off-screen right
              y: spawnedY,
              speed: getRandomSpeed()
            });
          }
          return kept;
        }
        
        return changed ? nextActive : prevActive;
      });
      
      animationFrameId = requestAnimationFrame(updatePositions);
    };
    
    animationFrameId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredMemeId, inspectingMeme, showVoidModal]);

  // Wallet Connection & Auth Callbacks
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("Please install MetaMask!");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWalletAddress(address);
      if (sdk) {
        sdk.setWalletAddress(address);
        await authenticate(sdk, address);
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const authenticate = async (activeSdk: SixFiveTwoNineVotingSDK, address: string) => {
    try {
      const provider = window.ethereum;
      if (!provider) return;

      const signMessage = async (message: string) => {
        return await provider.request({
          method: 'personal_sign',
          params: [message, address]
        });
      };
      
      const token = await activeSdk.authenticate(signMessage, address);
      setAccessToken(token);
      toast.success("Authenticated with 6529 API!");
      await loadVotingData(activeSdk);
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Authentication failed");
    }
  };

  // Drag-and-Drop Event Handlers
  const handleDragStartFromStream = (e: React.DragEvent, meme: FloatingMeme) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ source: "stream", id: meme.id }));
    setTimeout(() => {
      setDraggedStreamMemeId(meme.id);
    }, 0);
  };

  const handleDragStartFromSlot = (e: React.DragEvent, index: number) => {
    isDropHandledRef.current = false;
    e.dataTransfer.setData("text/plain", JSON.stringify({ source: "slot", index }));
    setTimeout(() => {
      setDraggedSlotIndex(index);
    }, 0);
  };

  const handleDragStartFromVoid = (e: React.DragEvent, meme: TopSubmission) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ source: "void", id: meme.id }));
    setTimeout(() => {
      setDraggedVoidMemeId(meme.id);
    }, 0);
  };

  const handleDragEndStream = () => {
    setDraggedStreamMemeId(null);
  };

  const handleDragEndSlot = () => {
    if (!isDropHandledRef.current && draggedSlotIndex !== null) {
      removeSlot(draggedSlotIndex);
    }
    setDraggedSlotIndex(null);
  };

  const handleDragEndVoid = () => {
    setDraggedVoidMemeId(null);
  };

  const handleDragOverSlot = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const filledCount = slots.filter(s => s !== null).length;
    const targetIndex = Math.min(index, filledCount);
    if (activeDragOverIndex !== targetIndex) {
      setActiveDragOverIndex(targetIndex);
    }
  };

  const handleDragLeaveSlot = () => {
    setActiveDragOverIndex(null);
  };

  const handleDropOnSlot = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setActiveDragOverIndex(null);
    try {
      isDropHandledRef.current = true;
      const dataStr = e.dataTransfer.getData("text/plain");
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      
      const filledCount = slots.filter(s => s !== null).length;

      if (data.source === "stream") {
        const meme = activeMemes.find(m => m.id === data.id);
        if (!meme) return;
        
        const adjustedTargetIndex = Math.min(targetIndex, filledCount);
        const { x, y, speed, ...drop } = meme;
        const newSlots = [...slots];
        const bumped = newSlots[19]; // Meme bumped out of slot 20
        
        // Shift right to make space for adjustedTargetIndex
        for (let i = 19; i > adjustedTargetIndex; i--) {
          newSlots[i] = newSlots[i - 1];
        }
        newSlots[adjustedTargetIndex] = drop;
        setCompactedSlots(newSlots);
        
        // Filter out from active display and refill from queue randomly (keep 10 count)
        setActiveMemes(prev => {
          const filtered = prev.filter(m => m.id !== drop.id);
          while (filtered.length < 10 && floatingPoolRef.current.length > 0) {
            const randIdx = Math.floor(Math.random() * floatingPoolRef.current.length);
            const nextSub = floatingPoolRef.current.splice(randIdx, 1)[0];
            filtered.push({
              ...nextSub,
              x: 105,
              y: 5 + Math.random() * 65,
              speed: getRandomSpeed()
            });
          }
          return filtered;
        });
        
        // Float the bumped item back
        if (bumped) {
          returnToPool(bumped);
        }
        toast.success(`Slotted ${drop.title} at Rank ${adjustedTargetIndex + 1}`);
      } else if (data.source === "slot") {
        const sourceIndex = data.index;
        if (sourceIndex === targetIndex) return;
        
        const adjustedTargetIndex = Math.min(targetIndex, filledCount - 1);
        if (sourceIndex === adjustedTargetIndex) return;

        const newSlots = [...slots];
        const itemToMove = newSlots[sourceIndex];
        if (!itemToMove) return;
        
        newSlots[sourceIndex] = null;
        
        // Slot displacement shifting
        if (sourceIndex < adjustedTargetIndex) {
          for (let i = sourceIndex; i < adjustedTargetIndex; i++) {
            newSlots[i] = newSlots[i + 1];
          }
        } else {
          for (let i = sourceIndex; i > adjustedTargetIndex; i--) {
            newSlots[i] = newSlots[i - 1];
          }
        }
        newSlots[adjustedTargetIndex] = itemToMove;
        setCompactedSlots(newSlots);
        toast.success(`Moved ${itemToMove.title} to Rank ${adjustedTargetIndex + 1}`);
      } else if (data.source === "void") {
        const meme = nopedMemes.find(m => m.id === data.id);
        if (!meme) return;
        
        const adjustedTargetIndex = Math.min(targetIndex, filledCount);
        const newSlots = [...slots];
        const bumped = newSlots[19];
        for (let i = 19; i > adjustedTargetIndex; i--) {
          newSlots[i] = newSlots[i - 1];
        }
        newSlots[adjustedTargetIndex] = meme;
        setCompactedSlots(newSlots);
        
        setNopedMemes(prev => prev.filter(m => m.id !== meme.id));
        
        if (bumped) {
          returnToPool(bumped);
        }
        toast.success(`Slotted ${meme.title} at Rank ${adjustedTargetIndex + 1}`);
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const handleDragOverPool = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isPoolDragOver) setIsPoolDragOver(true);
  };

  const handleDragLeavePool = () => {
    setIsPoolDragOver(false);
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    setIsPoolDragOver(false);
    try {
      isDropHandledRef.current = true;
      const dataStr = e.dataTransfer.getData("text/plain");
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      
      const rect = e.currentTarget.getBoundingClientRect();
      const dropX = ((e.clientX - rect.left - 80) / rect.width) * 100;
      const dropY = ((e.clientY - rect.top - 80) / rect.height) * 100;
      
      const safeX = Math.max(0, Math.min(90, dropX));
      const safeY = Math.max(0, Math.min(75, dropY));

      if (data.source === "stream") {
        setActiveMemes(prev => prev.map(m => m.id === data.id ? { ...m, x: safeX, y: safeY } : m));
      } else if (data.source === "slot") {
        const index = data.index;
        const itemToRemove = slots[index];
        if (!itemToRemove) return;
        
        const newSlots = [...slots];
        newSlots[index] = null;
        setCompactedSlots(newSlots);
        
        setActiveMemes(prev => {
          const filtered = prev.filter(m => m.id !== itemToRemove.id);
          filtered.push({
            ...itemToRemove,
            x: safeX,
            y: safeY,
            speed: getRandomSpeed()
          });
          return filtered;
        });
        toast.success(`Removed ${itemToRemove.title} from rankings`);
      } else if (data.source === "void") {
        const meme = nopedMemes.find(m => m.id === data.id);
        if (!meme) return;
        
        setNopedMemes(prev => prev.filter(m => m.id !== meme.id));
        setActiveMemes(prev => {
          const filtered = prev.filter(m => m.id !== meme.id);
          filtered.push({
            ...meme,
            x: safeX,
            y: safeY,
            speed: getRandomSpeed()
          });
          return filtered;
        });
        toast.success(`Recovered ${meme.title} from the Void`);
      }
    } catch (err) {
      console.error("Pool drop error:", err);
    }
  };

  const handleDropOnNopeHole = (e: React.DragEvent) => {
    e.preventDefault();
    setIsNopeDragOver(false);
    try {
      isDropHandledRef.current = true;
      const dataStr = e.dataTransfer.getData("text/plain");
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      
      let itemToVoid: TopSubmission | null = null;
      
      if (data.source === "stream") {
        const meme = activeMemes.find(m => m.id === data.id);
        if (meme) {
          const { x, y, speed, ...rawDrop } = meme;
          itemToVoid = rawDrop;
          
          setActiveMemes(prev => {
            const filtered = prev.filter(m => m.id !== data.id);
            while (filtered.length < 10 && floatingPoolRef.current.length > 0) {
              const randIdx = Math.floor(Math.random() * floatingPoolRef.current.length);
              const nextSub = floatingPoolRef.current.splice(randIdx, 1)[0];
              filtered.push({
                ...nextSub,
                x: 105,
                y: 5 + Math.random() * 65,
                speed: getRandomSpeed()
              });
            }
            return filtered;
          });
        }
      } else if (data.source === "slot") {
        const index = data.index;
        const drop = slots[index];
        if (drop) {
          itemToVoid = drop;
          const newSlots = [...slots];
          newSlots[index] = null;
          setCompactedSlots(newSlots);
        }
      }
      
      if (itemToVoid) {
        setNopedMemes(prev => {
          if (prev.some(m => m.id === itemToVoid!.id)) return prev;
          return [...prev, itemToVoid!];
        });
        toast.success(`Sent ${itemToVoid.title} to the Void`);
      }
    } catch (err) {
      console.error("Void drop error:", err);
    }
  };

  const removeSlot = (index: number) => {
    const itemToRemove = slots[index];
    if (!itemToRemove) return;
    
    const newSlots = [...slots];
    newSlots[index] = null;
    setCompactedSlots(newSlots);
    
    returnToPool(itemToRemove);
    toast.success(`Removed ${itemToRemove.title}`);
  };

  const handleRankSliderChange = (newRankVal: number) => {
    if (!inspectingMeme) return;
    
    let newSlots = [...slots];
    const previousIndex = slots.findIndex(s => s?.id === inspectingMeme.id);
    
    if (newRankVal === 0) {
      if (previousIndex !== -1) {
        newSlots[previousIndex] = null;
        setCompactedSlots(newSlots);
        returnToPool(inspectingMeme);
        toast.success(`Removed ${inspectingMeme.title} from rankings`);
      }
      return;
    }
    
    const targetIndex = newRankVal - 1;
    if (previousIndex === targetIndex) return;
    
    if (previousIndex !== -1) {
      newSlots[previousIndex] = null;
    }
    
    const bumped = newSlots[19];
    
    for (let i = 19; i > targetIndex; i--) {
      newSlots[i] = newSlots[i - 1];
    }
    newSlots[targetIndex] = inspectingMeme;
    setCompactedSlots(newSlots);
    
    if (previousIndex === -1) {
      setActiveMemes(prev => {
        const filtered = prev.filter(m => m.id !== inspectingMeme.id);
        while (filtered.length < 10 && floatingPoolRef.current.length > 0) {
          const randIdx = Math.floor(Math.random() * floatingPoolRef.current.length);
          const nextSub = floatingPoolRef.current.splice(randIdx, 1)[0];
          filtered.push({
            ...nextSub,
            x: 105,
            y: 5 + Math.random() * 65,
            speed: getRandomSpeed()
          });
        }
        return filtered;
      });
      floatingPoolRef.current = floatingPoolRef.current.filter(m => m.id !== inspectingMeme.id);
      
      // Also make sure it's not in the void if dragged/ranked directly from void
      setNopedMemes(prev => prev.filter(m => m.id !== inspectingMeme.id));
    }
    
    if (bumped) {
      returnToPool(bumped);
    }
    toast.success(`Placed ${inspectingMeme.title} at Rank ${newRankVal}`);
  };

  // Submit batch batch transaction API calls
  const submitBatchVotes = async () => {
    if (!sdk) return;
    if (!sdk.isAuthenticated()) {
      toast.error("Please authenticate first");
      return;
    }
    if (filledCount === 0) {
      toast.error("Add at least one meme to rankings");
      return;
    }
    if (totalTDH <= 0) {
      toast.error("Provide a valid TDH budget");
      return;
    }

    setIsVoting(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < 20; i++) {
        const drop = slots[i];
        if (drop) {
          const amt = getAllocationForSlot(i);
          if (amt > 0) {
            try {
              await sdk.submitVote(drop.id, amt);
              successCount++;
              setConfirmedSlotIndices(prev => ({ ...prev, [i]: true }));
              setTimeout(() => {
                setConfirmedSlotIndices(prev => {
                  const copy = { ...prev };
                  delete copy[i];
                  return copy;
                });
              }, 4000);
            } catch (e) {
              console.error(`Failed to submit vote for #${drop.serial_no}:`, e);
              failCount++;
            }
          }
        }
      }

      if (successCount > 0) {
        toast.success(`Submitted ${successCount} ranked votes successfully!`);
        // Refresh session balances
        const refreshedData = await sdk.refreshUserData();
        setUserTDHBalance(refreshedData.user.availableTDH);
        setUserTDHTotal(refreshedData.user.tdh);
      }
      if (failCount > 0) {
        toast.error(`Failed to submit ${failCount} votes.`);
      }
    } catch (err) {
      console.error("Batch vote execution failure:", err);
      toast.error("Transaction error during batch dispatch");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <>
      <Head>
        <title>🏆 Top 20 Stacked Rank Voting - The OM Pub</title>
        <meta name="description" content="Drag and drop memes to rank your top 20 and distribute your TDH budget mathematically." />
      </Head>
      <Toaster />

      <div className="top20-fullscreen-layout">
        {!accessToken ? (
          <div className="d-flex align-items-center justify-content-center flex-grow-1" style={{ background: "#040407" }}>
            <Card className="bg-dark text-center border-secondary py-5 px-4" style={{ maxWidth: "500px" }}>
              <Card.Body>
                <h4 className="text-amber mb-3">Connect Wallet</h4>
                <p className="text-muted mb-2">
                  Connect your wallet to view and submit votes
                </p>
                <p className="text-muted small mb-4">
                  Please authenticate to fetch your available voting power
                </p>
                <Button onClick={connectWallet} className="mt-2 btn-amber">
                  Sign message to authenticate
                </Button>
              </Card.Body>
            </Card>
          </div>
        ) : (
          <div className="top20-split-workspace">
            {/* Left rankings slots stack */}
            <div className="slots-pane">
              <div className="mb-4 border-bottom border-secondary pb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="text-amber mb-0">Allocation Config</h5>
                  <span className="text-muted small" style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
                <div className="text-muted small mb-3" style={{ fontSize: '0.8rem' }}>
                  Available TDH: <span className="text-amber font-weight-bold">{userTDHBalance.toLocaleString()}</span> / {userTDHTotal.toLocaleString()}
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Total TDH Budget</label>
                  <div className="input-group">
                    <input 
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
                      value={totalTDH}
                      onChange={(e) => setTotalTDH(Math.max(0, parseInt(e.target.value) || 0))}
                      disabled={distribution === 'current'}
                    />
                    {distribution !== 'current' && (
                      <button 
                        className="btn font-weight-bold" 
                        type="button" 
                        onClick={() => setTotalTDH(userTDHTotal)}
                        style={{ 
                          border: '1px solid rgba(255, 176, 0, 0.3)', 
                          color: '#ffb000', 
                          background: 'rgba(255, 176, 0, 0.06)',
                          borderTopRightRadius: '6px', 
                          borderBottomRightRadius: '6px',
                          fontSize: '0.8rem',
                          padding: '0 12px'
                        }}
                      >
                        MAX
                      </button>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted d-block">Split Distribution Curve</label>
                  <div className="d-flex flex-wrap gap-2">
                    {["even", "linear", "geometric", "exponential", "gaussian", "current"].map((m) => (
                      <div 
                        key={m} 
                        onClick={() => {
                          setDistribution(m);
                          if (m === "current") {
                            resetToCurrentVotes();
                          }
                        }}
                        className={`distribution-badge ${distribution === m ? 'active' : ''}`}
                      >
                        {m.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={submitBatchVotes} 
                  disabled={isVoting || filledCount === 0} 
                  className="w-100 btn-amber mt-2"
                >
                  {isVoting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Submitting Votes...
                    </>
                  ) : (
                    `Batch Submit ${filledCount} Votes`
                  )}
                </Button>
              </div>

              <h5 className="text-amber mb-3">Ranked Slots</h5>
              {Array(20).fill(null).map((_, idx) => {
                const drop = slots[idx];
                const slotAllocation = getAllocationForSlot(idx);
                const isCurrentlyDragged = draggedSlotIndex === idx;
                const showFilled = drop && !isCurrentlyDragged;
                const shouldShiftDown = activeDragOverIndex !== null && idx >= activeDragOverIndex && !isCurrentlyDragged;
                
                return (
                  <div
                    key={idx}
                    onDragOver={(e) => handleDragOverSlot(e, idx)}
                    onDragLeave={handleDragLeaveSlot}
                    onDrop={(e) => handleDropOnSlot(e, idx)}
                    className={`rank-slot ${showFilled ? 'filled' : ''} ${activeDragOverIndex === idx ? 'drag-over' : ''}`}
                    draggable={!!drop}
                    onDragStart={(e) => handleDragStartFromSlot(e, idx)}
                    onDragEnd={handleDragEndSlot}
                  >
                    <div className="rank-number">{idx + 1}</div>
                    {showFilled ? (
                      <div
                        className="rank-slot-card-content"
                        style={{
                          transform: shouldShiftDown ? 'translateY(120px)' : 'none',
                          transition: 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          flexGrow: 1,
                          width: '100%',
                          gap: '12px',
                          pointerEvents: 'none'
                        }}
                      >
                        {(() => {
                          const dropMediaUrl = getMediaUrl(drop);
                          const dropIsIframe = dropMediaUrl && (dropMediaUrl.includes('arweave.net') || dropMediaUrl.toLowerCase().includes('.html'));
                          const dropIsVideo = !dropIsIframe && (dropMediaUrl?.toLowerCase().includes('.mp4') || 
                                                                dropMediaUrl?.toLowerCase().includes('.mov') || 
                                                                dropMediaUrl?.toLowerCase().includes('.webm'));

                          return (
                            <div 
                              onClick={() => setInspectingMeme(drop)} 
                              style={{ pointerEvents: 'auto', cursor: 'pointer', flexGrow: 1, position: 'relative' }}
                            >
                              {dropMediaUrl ? (
                                dropIsIframe ? (
                                  <div style={{ position: "relative", width: "100%", height: "180px", borderRadius: "6px", overflow: "hidden" }}>
                                    <iframe
                                      src={dropMediaUrl}
                                      title={drop.title}
                                      sandbox="allow-scripts allow-same-origin"
                                      style={{ width: "100%", height: "100%", border: "none" }}
                                    />
                                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, background: "transparent" }} />
                                  </div>
                                ) : dropIsVideo ? (
                                  <video 
                                    src={dropMediaUrl} 
                                    muted 
                                    loop 
                                    autoPlay 
                                    playsInline 
                                    style={{ maxWidth: "100%", maxHeight: "250px", height: "auto", display: "block", borderRadius: "6px" }} 
                                  />
                                ) : (
                                  <img 
                                    src={dropMediaUrl} 
                                    alt={drop.title} 
                                    style={{ maxWidth: "100%", maxHeight: "250px", height: "auto", display: "block", borderRadius: "6px" }} 
                                  />
                                )
                              ) : (
                                <div className="bg-secondary p-3 text-center text-white small" style={{ borderRadius: "6px" }}>#</div>
                              )}
                            </div>
                          );
                        })()}
                        {slotAllocation > 0 && (
                          <div className="d-flex flex-column align-items-center" style={{ alignSelf: 'flex-start', marginTop: '4px', gap: '2px' }}>
                            <div className="slot-tdh" style={{ marginTop: 0 }}>
                              {slotAllocation.toLocaleString()}
                            </div>
                            {confirmedSlotIndices[idx] && (
                              <div className="confirmed-checkmark">
                                ✓
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div 
                        className="text-muted small py-2"
                        style={{
                          transform: shouldShiftDown ? 'translateY(120px)' : 'none',
                          transition: 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)'
                        }}
                      >
                        Drag a meme here to rank #{idx + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right conveyor floating memes view */}
            <div className="stream-pane">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-amber mb-0">Meme Pool ({floatingPoolRef.current.length + activeMemes.length} unranked)</h5>
                <small className="text-muted">Hover to freeze & listen | Click to inspect | Drag to reposition or slot</small>
              </div>
              
              {isLoadingMainStage ? (
                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : (
                <div 
                  onDragOver={handleDragOverPool}
                  onDragLeave={handleDragLeavePool}
                  onDrop={handleDropOnPool}
                  className={`floating-pool-container ${isPoolDragOver ? 'border border-amber' : ''}`}
                >
                  {activeMemes.map((meme) => (
                    <FloatingCard
                      key={meme.id}
                      meme={meme}
                      onDragStart={handleDragStartFromStream}
                      onDragEnd={handleDragEndStream}
                      onClick={setInspectingMeme}
                      onHoverChange={setHoveredMemeId}
                      isDragged={draggedStreamMemeId === meme.id}
                    />
                  ))}
                  {activeMemes.length === 0 && (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                      All memes are currently slotted in your Top 20!
                    </div>
                  )}

                  {/* NOPE Void Black Hole */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsNopeDragOver(true); }}
                    onDragLeave={() => setIsNopeDragOver(false)}
                    onDrop={handleDropOnNopeHole}
                    onClick={() => setShowVoidModal(true)}
                    className={`nope-hole ${isNopeDragOver ? 'pulsing-glowing' : ''}`}
                  >
                    <div className="nope-hole-portal"></div>
                    <div className="nope-hole-label">VOID ({nopedMemes.length})</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox inspection details Modal */}
      <Modal 
        show={inspectingMeme !== null} 
        onHide={() => setInspectingMeme(null)} 
        size="xl" 
        centered
        contentClassName="bg-dark text-white border-amber custom-lightbox-modal"
      >
        {inspectingMeme && (() => {
          const modalMediaUrl = getMediaUrl(inspectingMeme);
          const modalIsIframe = modalMediaUrl && (modalMediaUrl.includes('arweave.net') || modalMediaUrl.toLowerCase().includes('.html'));
          const modalIsVideo = !modalIsIframe && (modalMediaUrl?.toLowerCase().includes('.mp4') || 
                                                  modalMediaUrl?.toLowerCase().includes('.mov') || 
                                                  modalMediaUrl?.toLowerCase().includes('.webm'));

          return (
            <Modal.Body className="p-0 overflow-hidden">
              <div className="d-flex flex-column flex-lg-row" style={{ minHeight: "75vh" }}>
                {/* Left side: Art focus */}
                <div className="flex-grow-1 bg-black d-flex align-items-center justify-content-center p-3 position-relative" style={{ minWidth: 0, backgroundColor: "#020204" }}>
                  {modalMediaUrl ? (
                    modalIsIframe ? (
                      <iframe
                        src={modalMediaUrl}
                        title={inspectingMeme.title}
                        sandbox="allow-scripts allow-same-origin allow-popups"
                        style={{ width: "100%", height: "70vh", border: "none" }}
                      />
                    ) : modalIsVideo ? (
                      <video 
                        src={modalMediaUrl} 
                        controls 
                        autoPlay 
                        style={{ maxWidth: "100%", maxHeight: "70vh", width: "auto", height: "auto", objectFit: "contain" }}
                      />
                    ) : (
                      <img 
                        src={modalMediaUrl} 
                        alt={inspectingMeme.title} 
                        style={{ maxWidth: "100%", maxHeight: "70vh", width: "auto", height: "auto", objectFit: "contain" }}
                      />
                    )
                  ) : (
                    <div className="text-muted">No Preview Available</div>
                  )}
                </div>

              {/* Right side: Sidebar details */}
              <div className="border-start border-secondary p-4 d-flex flex-column justify-content-between position-relative" style={{ width: "380px", flexShrink: 0, overflowY: "auto", maxHeight: "75vh", backgroundColor: "#0a0a0f" }}>
                <button 
                  onClick={() => setInspectingMeme(null)} 
                  className="btn-close btn-close-white position-absolute" 
                  style={{ top: "15px", right: "15px" }} 
                  aria-label="Close"
                />
                
                <div className="pe-3">
                  <h4 className="text-amber mb-1" style={{ paddingRight: "25px" }}>{inspectingMeme.title}</h4>
                  <p className="text-muted small mb-3">by {inspectingMeme.author.handle}</p>
                  
                  <h6 className="text-muted small uppercase tracking-wider mb-2">Description</h6>
                  <p className="lightbox-desc small mb-4" style={{ whiteSpace: "pre-line", opacity: 0.8, color: "#ccc" }}>
                    {inspectingMeme.content || "No description provided."}
                  </p>

                  <h6 className="text-muted small uppercase tracking-wider mb-2">Submission Details</h6>
                  <div className="small text-muted mb-4">
                    <strong>Address:</strong> <span className="text-break text-muted" style={{ color: "#888" }}>{inspectingMeme.author.primary_address}</span>
                    {inspectingMeme.rank && (
                      <>
                        <br />
                        <strong>Global Rank:</strong> {inspectingMeme.rank}
                      </>
                    )}
                  </div>
                </div>

                {/* Rank Selection Vertical Slider */}
                <div className="rank-slider-container mt-auto">
                  <span className="small text-muted font-weight-bold">Rank Placement Selector</span>
                  <div className="rank-slider-value">
                    {slots.findIndex(s => s?.id === inspectingMeme.id) === -1 ? "Unranked" : `#${slots.findIndex(s => s?.id === inspectingMeme.id) + 1}`}
                  </div>
                  <div className="vertical-slider-wrapper">
                    <div className="small text-muted font-weight-bold">1</div>
                    <input 
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={slots.findIndex(s => s?.id === inspectingMeme.id) === -1 ? 0 : 21 - (slots.findIndex(s => s?.id === inspectingMeme.id) + 1)}
                      onChange={(e) => {
                        const sliderVal = parseInt(e.target.value);
                        const newRankVal = sliderVal === 0 ? 0 : 21 - sliderVal;
                        handleRankSliderChange(newRankVal);
                      }}
                      className="vertical-slider"
                    />
                    <div className="small text-muted font-weight-bold">Unranked</div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          );
        })()}
      </Modal>

      {/* Void Modal Drawer */}
      <Modal 
        show={showVoidModal} 
        onHide={() => setShowVoidModal(false)} 
        size="lg" 
        centered
        contentClassName="bg-dark text-white border-amber custom-lightbox-modal"
      >
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="text-amber">The Void (Noped Memes)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-4">
            Drag memes out of the Void to place them back into the conveyor pool or slot them directly into your rankings.
          </p>
          <div className="d-flex flex-wrap gap-3 justify-content-center" style={{ minHeight: "150px" }}>
            {nopedMemes.map(meme => (
              <div 
                key={meme.id}
                draggable
                onDragStart={(e) => handleDragStartFromVoid(e, meme)}
                onDragEnd={handleDragEndVoid}
                onClick={() => { setInspectingMeme(meme); setShowVoidModal(false); }}
                className="floating-meme-card position-relative"
                style={{ 
                  cursor: "grab", 
                  width: "130px", 
                  height: "auto",
                  opacity: draggedVoidMemeId === meme.id ? 0 : 1,
                  pointerEvents: draggedVoidMemeId === meme.id ? 'none' : 'auto'
                }}
              >
                <div className="card-media-wrapper">
                  {meme.picture ? (
                    meme.picture.toLowerCase().includes('.mp4') || 
                    meme.picture.toLowerCase().includes('.mov') || 
                    meme.picture.toLowerCase().includes('.webm') ? (
                      <video src={meme.picture} muted className="floating-card-media" draggable={false} />
                    ) : (
                      <img src={meme.picture} alt={meme.title} className="floating-card-media" draggable={false} />
                    )
                  ) : (
                    <div className="floating-card-fallback">Art</div>
                  )}
                </div>
                <div className="text-center small mt-1 text-truncate w-100 px-1" style={{ color: "#aaa", fontSize: "0.7rem" }}>
                  {meme.title}
                </div>
              </div>
            ))}
            {nopedMemes.length === 0 && (
              <div className="text-muted d-flex align-items-center justify-content-center flex-grow-1">
                The Void is currently empty.
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

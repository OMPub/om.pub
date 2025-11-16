import Head from "next/head";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SixFiveTwoNineVotingSDK, VotingData, VoteDistribution as SDKVoteDistribution, Drop as SDKDrop, WaveActivity, NotificationItem, NotificationCategoryCounts } from "../lib/6529-voting-sdk";
import { Card, Button, Spinner, Alert, Tabs, Tab, Container, Badge } from "react-bootstrap";
import { toast, Toaster } from 'sonner';
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import CrystalForestVisualization from "@/components/vote/CrystalForestVisualization";
import SubmissionCard from "@/components/vote/SubmissionCard";
import VotingForm from "@/components/vote/VotingForm";

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
}

interface LocalVoteDistribution {
  drop: TopSubmission;
  voteAmount: number;
}

const buildRepCategory = (drop: TopSubmission) => {
  const fallback = `Submission #${drop.serial_no}`;
  const metadataTitle = drop.metadata?.find((m) => m.data_key === "title")?.data_value;
  const rawCategory = drop.title || metadataTitle || fallback;
  const sanitized = rawCategory
    .replace(/[^a-zA-Z0-9?!,."() ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (sanitized || fallback).slice(0, 100);
};

const formatRelativeTime = (timestamp?: number | null) => {
  if (!timestamp) return "Unknown";

  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return "Just now";

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    const seconds = Math.floor(diffMs / 1000);
    return seconds <= 1 ? "Just now" : `${seconds}s ago`;
  }

  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes}m ago`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours}h ago`;
  }

  const days = Math.floor(diffMs / day);
  return `${days}d ago`;
};

export default function Vote() {
  // Add CSS for smooth animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .vote-card-body-animated {
        transition: all 0.3s ease-out;
        transform-origin: top;
        overflow: hidden;
      }
      
      .vote-card-body-collapsed {
        max-height: 0;
        opacity: 0;
        transform: scaleY(0.95);
        padding: 0 !important;
      }
      
      .vote-card-body-expanded {
        max-height: 2000px;
        opacity: 1;
        transform: scaleY(1);
      }
      
      .vote-card-header-clickable {
        transition: background-color 0.2s ease;
        cursor: pointer;
      }
      
      .vote-card-header-clickable:hover {
        background-color: rgba(0, 123, 255, 0.05);
      }
      
      .chevron-icon {
        transition: transform 0.3s ease;
        display: inline-block;
      }
      
      .chevron-icon.expanded {
        transform: rotate(180deg);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Authentication state
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // SDK instance
  const [sdk, setSdk] = useState<SixFiveTwoNineVotingSDK | null>(null);

  // Data state
  const [topSubmissions, setTopSubmissions] = useState<TopSubmission[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<TopSubmission[]>([]);
  const [userVoteDistribution, setUserVoteDistribution] = useState<LocalVoteDistribution[]>([]);
  const [userVotes, setUserVotes] = useState<{[key: string]: number}>({});
  const [userTDHBalance, setUserTDHBalance] = useState<number>(0);
  const [userTDHTotal, setUserTDHTotal] = useState<number>(0);
  
  const totalTDHVoted = userVoteDistribution.reduce((sum, v) => sum + v.voteAmount, 0);

  // Helper to convert SDK Drop to TopSubmission
  const sdkDropToTopSubmission = (sdkDrop: SDKDrop): TopSubmission => ({
    ...sdkDrop,
    vote_count: sdkDrop.rating_prediction || sdkDrop.realtime_rating || 0
  });

  // Helper to convert SDK VoteDistribution to LocalVoteDistribution
  const sdkVoteDistributionToLocal = (sdkDist: SDKVoteDistribution): LocalVoteDistribution => ({
    drop: sdkDropToTopSubmission(sdkDist.drop),
    voteAmount: sdkDist.voteAmount
  });


  // UI state
  const [isLoadingMainStage, setIsLoadingMainStage] = useState(false);
  const [isLoadingVotes, setIsLoadingVotes] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [selectedVote, setSelectedVote] = useState<LocalVoteDistribution | null>(null);
  const [expandedVotes, setExpandedVotes] = useState<{[key: string]: boolean}>({});
  const [userRepAvailable, setUserRepAvailable] = useState<number>(0);
  const [userRepReceived, setUserRepReceived] = useState<number>(0);
  const [isLoadingRep, setIsLoadingRep] = useState(false);
  const [instantRepStatus, setInstantRepStatus] = useState<{ [key: string]: boolean }>({});
  const [recentActivity, setRecentActivity] = useState<WaveActivity[]>([]);
  const defaultNotificationCounts: NotificationCategoryCounts = {
    mentionsAndReplies: 0,
    reactions: 0,
    identitySubscribed: 0,
    other: 0
  };

  const defaultNotificationGroups = {
    mentionsAndReplies: [] as NotificationItem[],
    reactions: [] as NotificationItem[],
    identitySubscribed: [] as NotificationItem[],
    other: [] as NotificationItem[]
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationCategoryCounts, setNotificationCategoryCounts] = useState<NotificationCategoryCounts>(defaultNotificationCounts);
  const [notificationGroups, setNotificationGroups] = useState(defaultNotificationGroups);
  const [waveNotificationCounts, setWaveNotificationCounts] = useState<Record<string, number>>({});
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  const loadRepData = useCallback(async () => {
    if (!sdk || !sdk.isAuthenticated()) {
      return;
    }

    setIsLoadingRep(true);
    try {
      const [credit, received] = await Promise.all([
        sdk.getRepCredit(),
        sdk.getMyRepReceived()
      ]);
      setUserRepAvailable(Number(credit?.rep_credit ?? 0));
      setUserRepReceived(received || 0);
    } catch (error) {
      console.error("Error loading rep data:", error);
      toast.error("Failed to load REP info");
    } finally {
      setIsLoadingRep(false);
    }
  }, [sdk]);

  const loadActivityData = useCallback(async () => {
    if (!sdk || !sdk.isAuthenticated()) {
      return;
    }

    setIsLoadingActivity(true);
    setActivityError(null);
    try {
      const [waves, notif] = await Promise.all([
        sdk.getRecentWaveActivity(5),
        sdk.getNotifications(50)
      ]);

      const unreadCounts: Record<string, number> = {};
      notif.notifications.forEach((notification) => {
        if (notification.read_at) {
          return;
        }
        (notification.wave_ids || []).forEach((waveId) => {
          unreadCounts[waveId] = (unreadCounts[waveId] || 0) + 1;
        });
      });

      const causeToGroup = (cause: string): keyof typeof defaultNotificationGroups => {
        if (cause === 'IDENTITY_MENTIONED' || cause === 'DROP_REPLIED' || cause === 'DROP_QUOTED') {
          return 'mentionsAndReplies';
        }
        if (cause === 'DROP_VOTED') {
          return 'reactions';
        }
        if (cause === 'IDENTITY_SUBSCRIBED') {
          return 'identitySubscribed';
        }
        return 'other';
      };

      const grouped = {
        mentionsAndReplies: [] as NotificationItem[],
        reactions: [] as NotificationItem[],
        identitySubscribed: [] as NotificationItem[],
        other: [] as NotificationItem[]
      };

      notif.notifications.forEach((notification) => {
        const groupKey = causeToGroup(notification.cause || '');
        grouped[groupKey].push(notification);
      });

      setRecentActivity(waves);
      setNotifications(notif.notifications);
      setWaveNotificationCounts(unreadCounts);
      setNotificationCategoryCounts(notif.category_counts || defaultNotificationCounts);
      setNotificationGroups(grouped);
    } catch (error) {
      console.error("Error loading activity data:", error);
      setActivityError("Failed to load activity");
    } finally {
      setIsLoadingActivity(false);
    }
  }, [sdk]);

  const handleInstantRep = useCallback(async (drop: TopSubmission) => {
    if (!sdk) {
      toast.error("SDK not initialized");
      return;
    }

    if (!accessToken) {
      toast.error("Authenticate to send REP");
      return;
    }

    const targetIdentity = drop.author?.id || drop.author?.handle;
    if (!targetIdentity) {
      toast.error("Unable to determine artist identity");
      return;
    }

    const percentAmount = Math.floor(userRepAvailable * 0.01);
    const repAmount = Math.min(percentAmount, 6967);
    if (repAmount <= 0) {
      toast.error("No REP available to send");
      return;
    }

    const category = buildRepCategory(drop);
    setInstantRepStatus((prev) => ({ ...prev, [drop.id]: true }));

    try {
      await sdk.assignRep(targetIdentity, repAmount, category);
      toast.success(`Sent ${repAmount.toLocaleString()} REP to ${drop.author.handle}`);
      await loadRepData();
    } catch (error: any) {
      console.error("Error sending instant REP:", error);
      toast.error(error?.message || "Failed to send REP");
    } finally {
      setInstantRepStatus((prev) => ({ ...prev, [drop.id]: false }));
    }
  }, [sdk, accessToken, userRepAvailable, loadRepData]);

  // Initialize SDK
  useEffect(() => {
    const votingSdk = new SixFiveTwoNineVotingSDK({
      callbacks: {
        onAuthenticated: (token) => {
          setAccessToken(token);
          toast.success("Authenticated with 6529 API successfully!");
        },
        onError: (error) => {
          console.error("SDK Error:", error);
          toast.error(error);
        }
      }
    });
    
    setSdk(votingSdk);
    
    // Set up event listeners for debugging and background updates
    votingSdk.on('dataLoaded', (data: VotingData | undefined) => {
      if (data) {
        console.debug('[SDK] Data loaded:', {
          user: data.user,
          submissionsCount: data.submissions.length,
          userVotesCount: data.userVotes.length
        });
      }
    });
    
    votingSdk.on('leaderboardUpdated', (data: any) => {
      console.debug('[SDK] Background loading complete:', {
        additionalDrops: data.drops?.length || 0
      });
      // Optionally refresh UI when background loading completes
      // This ensures we have the complete dataset
      if (data.drops && data.drops.length > 0) {
        loadVotingData();
      }
    });
    
    votingSdk.on('voteSubmitted', (data) => {
      console.debug('[SDK] Vote submitted:', data);
    });
    
    return () => {
      votingSdk.clearAuth();
    };
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setWalletAddress(address);
        
        // Update SDK with wallet address
        if (sdk) {
          sdk.setWalletAddress(address);
        }
        
        // Auto-authenticate with 6529 API
        await authenticate(address);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Failed to connect wallet");
      }
    } else {
      toast.error("Please install MetaMask");
    }
  };

  // Authenticate with 6529 API using SDK
  const authenticate = async (address: string) => {
    if (!sdk) {
      toast.error("SDK not initialized");
      return;
    }
    
    try {
      // Sign message with wallet
      const provider = typeof window !== "undefined" ? window.ethereum : undefined;
      if (!provider) {
        toast.error("Please install MetaMask");
        return;
      }

      const signMessage = async (message: string) => {
        return await provider.request({
          method: 'personal_sign',
          params: [message, address]
        });
      };
      
      const token = await sdk.authenticate(signMessage, address);
      setAccessToken(token);
      
      // Load voting data after authentication
      await loadVotingData();
      await loadRepData();
      await loadActivityData();
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed");
    }
  };

  // Load voting data using SDK
  const loadVotingData = async () => {
    if (!sdk) return;
    
    setIsLoadingMainStage(true);
    setIsLoadingVotes(true);
    
    try {
      // Use immediate loading for faster initial display
      const votingData = await sdk.getVotingData({ immediate: true });
      
      // Update state with SDK data
      setTopSubmissions(votingData.submissions.slice(0, 10).map(sdkDropToTopSubmission));
      setAllSubmissions(votingData.submissions.map(sdkDropToTopSubmission));
      setUserVoteDistribution(votingData.userVoteDistribution.map(sdkVoteDistributionToLocal));
      setUserVotes(votingData.userVotesMap);
      setUserTDHTotal(votingData.user.tdh);
      setUserTDHBalance(votingData.user.availableTDH);
      
      console.debug('[SDK] Voting data loaded immediately', {
        totalSubmissions: votingData.submissions.length,
        userVotes: votingData.userVotes.length,
        tdh: votingData.user.tdh,
        availableTDH: votingData.user.availableTDH
      });
    } catch (error) {
      console.error("Error loading voting data:", error);
      toast.error("Failed to load voting data");
    } finally {
      setIsLoadingMainStage(false);
      setIsLoadingVotes(false);
    }
  };


  // Refresh user data using SDK
  const refreshUserData = async () => {
    if (!sdk) return;
    
    try {
      const refreshedData = await sdk.refreshUserData();
      
      // Update state with refreshed data
      setUserVotes(refreshedData.userVotesMap);
      setUserTDHTotal(refreshedData.user.tdh);
      setUserTDHBalance(refreshedData.user.availableTDH);
      
      // Update vote distribution
      const userVoteDist: LocalVoteDistribution[] = [];
      allSubmissions.forEach((drop: TopSubmission) => {
        if (refreshedData.userVotesMap[drop.id]) {
          userVoteDist.push({
            drop,
            voteAmount: refreshedData.userVotesMap[drop.id]
          });
        }
      });
      setUserVoteDistribution(userVoteDist);
      
      console.debug('[SDK] User data refreshed', {
        tdh: refreshedData.user.tdh,
        availableTDH: refreshedData.user.availableTDH
      });

      await loadRepData();
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast.error("Failed to refresh user data");
    }
  };

  // Submit vote using SDK
  const submitVote = async (dropId: string, amount: number) => {
    if (!sdk) {
      throw new Error("SDK not initialized");
    }

    try {
      console.debug('[Vote] Submitting vote:', { dropId, amount });
      console.debug('[Vote] SDK state:', {
        isAuthenticated: sdk.isAuthenticated(),
        walletAddress: sdk.getWalletAddress(),
        hasToken: !!sdk.getAccessToken()
      });
      
      await sdk.submitVote(dropId, amount);
      toast.success(`Vote of ${amount} TDH submitted successfully!`);
      
      // Refresh user data after successful vote
      await refreshUserData();
    } catch (error: any) {
      console.error("Error submitting vote:", error);
      toast.error(error.message || "Failed to submit vote");
      throw error;
    }
  };

  // Load more submissions
  const loadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 10, allSubmissions.length));
  };

  // Auto-connect wallet on mount and restore SDK state
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0 && sdk) {
            const address = accounts[0];
            setWalletAddress(address);
            sdk.setWalletAddress(address);
            
            // Try to restore session from localStorage if available
            const savedToken = localStorage.getItem('6529_access_token');
            if (savedToken) {
              sdk.setAccessToken(savedToken);
              setAccessToken(savedToken);
              // Load voting data if we have a saved session
              loadVotingData();
              loadRepData();
              loadActivityData();
            }
          }
        });
    }
  }, [sdk, loadRepData, loadActivityData]);
  
  // Save token to localStorage when it changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('6529_access_token', accessToken);
    } else {
      localStorage.removeItem('6529_access_token');
    }
  }, [accessToken]);

  return (
    <>
      <Head>
        <title>🎭 6529 Main Stage TDH Voting - The OM Pub</title>
        <meta property="og:url" content={`https://om.pub/vote`} />
        <meta property="og:title" content={`🎭 6529 Main Stage TDH Voting - The OM Pub`} />
        <meta property="og:image" content={`/om-pub-logo.webp`} />
      </Head>
      <Toaster />
      <Header />
      <Container className="mt-4 mb-5">
        <h1 className="mb-4">Meme Votes</h1>

        {/* Wallet Connection */}
        {!walletAddress ? (
          <Card className="mb-4">
            <Card.Body className="text-center">
              <p className="mb-3">Connect your wallet to view and submit votes</p>
              <Button onClick={connectWallet} disabled={isConnecting}>
                {isConnecting ? <Spinner animation="border" size="sm" /> : "Connect Wallet"}
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Connected:</strong> {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
                {accessToken && (
                  <div>
                    <strong>Available TDH:</strong> {userTDHBalance.toLocaleString()} / {userTDHTotal.toLocaleString()} total
                  </div>
                )}
              </div>
              {accessToken && (
                <div className="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
                  <div>
                    <strong>Available REP:</strong>{' '}
                    {isLoadingRep ? 'Loading…' : userRepAvailable.toLocaleString()}
                  </div>
                  <div className="text-muted small">
                    Total REP Received:{' '}
                    {isLoadingRep ? 'Loading…' : userRepReceived.toLocaleString()}
                  </div>
                </div>
              )}
              {!accessToken && (
                <Button onClick={() => authenticate(walletAddress)} className="mt-2" size="sm">
                  Authenticate with 6529 API
                </Button>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Main Content */}
        {accessToken && (
          <>
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Total Votes Cast:</strong> {userVoteDistribution.length}
                  </div>
                  <div>
                    <strong>Total TDH Voted:</strong>{' '}
                    {totalTDHVoted.toLocaleString()}
                  </div>
                </div>

                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'list')} className="mb-3">
                  <Tab eventKey="list" title="📋 My Votes">
                    {isLoadingVotes ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" />
                        <p className="mt-2">Loading your votes...</p>
                      </div>
                    ) : userVoteDistribution.length > 0 ? (
                      <div>
                        {userVoteDistribution
                          .sort((a, b) => b.voteAmount - a.voteAmount)
                          .map((vote) => (
                            <Card key={vote.drop.id} className="mb-3">
                              <Card.Header 
                                className="d-flex justify-content-between align-items-center vote-card-header-clickable"
                                onClick={() => {
                                  const expandedState = {...expandedVotes};
                                  expandedState[vote.drop.id] = !expandedState[vote.drop.id];
                                  setExpandedVotes(expandedState);
                                }}
                              >
                                <div>
                                  <strong>
                                    {vote.drop.title || 
                                     (vote.drop.metadata?.find((m: any) => m.data_key === 'title')?.data_value) || 
                                     `Meme #${vote.drop.serial_no}`}
                                  </strong>
                                  <div className="text-muted small">#{vote.drop.serial_no} by {vote.drop.author.handle}</div>
                                  {vote.drop.rank && (
                                    <Badge bg="secondary" className="mt-1">Rank: {vote.drop.rank}</Badge>
                                  )}
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <strong>{vote.voteAmount.toLocaleString()} TDH</strong>
                                  <span className={`chevron-icon ${expandedVotes[vote.drop.id] ? 'expanded' : ''}`}>▼</span>
                                </div>
                              </Card.Header>
                              
                              {expandedVotes[vote.drop.id] && (
                                <Card.Body className="vote-card-body-animated vote-card-body-expanded">
                                  <div className="row">
                                    <div className="col-md-6">
                                      {vote.drop.picture ? (
                                        <>
                                          {vote.drop.picture.toLowerCase().includes('.mp4') || 
                                           vote.drop.picture.toLowerCase().includes('.mov') || 
                                           vote.drop.picture.toLowerCase().includes('.webm') ? (
                                            <video
                                              controls
                                              style={{ 
                                                maxWidth: '100%', 
                                                height: 'auto',
                                                borderRadius: '4px',
                                                border: '1px solid #dee2e6',
                                                maxHeight: '300px'
                                              }}
                                            >
                                              <source src={vote.drop.picture} type="video/mp4" />
                                              Your browser does not support the video tag.
                                            </video>
                                          ) : (
                                            <img
                                              src={vote.drop.picture}
                                              alt={`Meme #${vote.drop.serial_no}`}
                                              style={{ 
                                                maxWidth: '100%', 
                                                height: 'auto',
                                                borderRadius: '4px',
                                                border: '1px solid #dee2e6'
                                              }}
                                            />
                                          )}
                                        </>
                                      ) : (
                                        <div className="text-muted small">No picture data</div>
                                      )}
                                      {vote.drop.content && (
                                        <p className="mt-2 text-muted small">{vote.drop.content}</p>
                                      )}
                                    </div>
                                    <div className="col-md-6">
                                      <h6 className="mb-3">Adjust Vote</h6>
                                      <VotingForm
                                        drop={vote.drop}
                                        userVote={vote.voteAmount}
                                        userTDHBalance={userTDHBalance + vote.voteAmount}
                                        onSubmit={async (dropId, amount) => {
                                          try {
                                            await submitVote(dropId, amount);
                                          } catch (error) {
                                            // Error is already handled in submitVote with toast
                                            console.error('Vote submission error in My Votes:', error);
                                          }
                                        }}
                                      />
                                      <div className="mt-3">
                                        <div className="border-top pt-2">
                                          <small className="text-muted d-block">
                                            <strong>Voters:</strong> {vote.drop.raters_count?.toLocaleString() || 'N/A'}
                                          </small>
                                          <small className="text-muted d-block">
                                            <strong>Predicted TDH:</strong> {vote.drop.rating_prediction?.toLocaleString() || 'N/A'}
                                          </small>
                                          <small className="text-muted d-block">
                                            <strong>Realtime TDH:</strong> {vote.drop.realtime_rating?.toLocaleString() || 'N/A'}
                                          </small>
                                          <small className="text-muted d-block">
                                            <strong>Your Voting Power:</strong> {vote.drop.rating_prediction ? ((vote.voteAmount / vote.drop.rating_prediction) * 100).toFixed(2) : 'N/A'}% of predicted
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Card.Body>
                              )}
                            </Card>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="info">
                        <strong>No votes yet!</strong> Head to the Main Stage Voting tab to cast your first vote. 🎭
                      </Alert>
                    )}
                  </Tab>
                  <Tab eventKey="voting" title="🎭 Main Stage Voting">
                    <div className="mb-3">
                      <p className="text-muted">
                        Browse and vote on Main Stage submissions. Your votes are weighted by your TDH (The Memes) holdings.
                      </p>
                    </div>
                    
                    {isLoadingMainStage ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" />
                        <p className="mt-2">Loading submissions...</p>
                      </div>
                    ) : (
                      <>
                        {allSubmissions.slice(0, displayedCount).map((drop) => {
                          const instantRepAmount = Math.min(Math.floor(userRepAvailable * 0.01), 6967);
                          return (
                          <SubmissionCard
                            key={drop.id}
                            drop={drop}
                            userVote={userVotes[drop.id] || 0}
                            userTDHBalance={userTDHBalance}
                            isAuthenticated={!!accessToken}
                            onVoteSubmit={submitVote}
                            onInstantRep={handleInstantRep}
                            instantRepEnabled={userRepAvailable > 0}
                            instantRepLoading={!!instantRepStatus[drop.id]}
                            instantRepAmount={instantRepAmount}
                            instantRepCategory={buildRepCategory(drop)}
                          />
                          );
                        })}

                        {displayedCount < allSubmissions.length && (
                          <div className="text-center mt-4">
                            <Button onClick={loadMore} variant="outline-primary">
                              Load More ({allSubmissions.length - displayedCount} remaining)
                            </Button>
                          </div>
                        )}

                        {!isLoadingMainStage && topSubmissions.length === 0 && (
                          <p>No Main Stage data available.</p>
                        )}
                      </>
                    )}
                  </Tab>
                  <Tab eventKey="visualization" title="🌲 Crystal Forest">
                    {userVoteDistribution.length > 0 ? (
                      <CrystalForestVisualization
                        userVoteDistribution={userVoteDistribution}
                        onCrystalClick={setSelectedVote}
                      />
                    ) : (
                      <Alert variant="info">
                        Cast some votes to see your 3D crystal forest visualization!
                      </Alert>
                    )}
                  </Tab>
                  <Tab eventKey="activity" title="📡 Activity">
                    {isLoadingActivity ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" />
                        <p className="mt-2">Loading activity...</p>
                      </div>
                    ) : (
                      <div className="activity-tab">
                        {activityError && (
                          <Alert variant="danger">{activityError}</Alert>
                        )}

                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">
                              Recent Waves
                              {(() => {
                                const unreadTotal = recentActivity.reduce((sum, wave) => sum + (waveNotificationCounts[wave.id] || 0), 0);
                                return unreadTotal > 0 ? ` (${unreadTotal} unread)` : '';
                              })()}
                            </h5>
                            <Button variant="outline-secondary" size="sm" onClick={loadActivityData}>
                              Refresh
                            </Button>
                          </div>
                          {recentActivity.length === 0 ? (
                            <Alert variant="info">No recent wave activity yet.</Alert>
                          ) : (
                            <div className="d-flex flex-wrap gap-3">
                              {recentActivity.map((wave) => (
                                <Card
                                  key={wave.id}
                                  style={{ width: '200px', cursor: 'pointer' }}
                                  onClick={() => window.open(wave.url, '_blank')}
                                >
                                  {wave.picture ? (
                                    <Card.Img variant="top" src={wave.picture} alt={wave.name} style={{ height: '120px', objectFit: 'cover' }} />
                                  ) : (
                                    <div style={{ height: '120px', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777' }}>
                                      No Image
                                    </div>
                                  )}
                                  <Card.Body>
                                    <Card.Title style={{ fontSize: '1rem' }}>{wave.name}</Card.Title>
                                    <Card.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
                                      Activity: {wave.activityCount.toLocaleString()}
                                      <br />
                                      Last active: {formatRelativeTime(wave.latestActivityAt)}
                                      <br />
                                      {wave.isDirectMessage ? 'Direct Message Wave' : 'Wave'}
                                      {waveNotificationCounts[wave.id] ? (
                                        <>
                                          <br />
                                          Unread notifications: <strong>{waveNotificationCounts[wave.id]}</strong>
                                        </>
                                      ) : null}
                                    </Card.Text>
                                  </Card.Body>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                            <h5 className="mb-0">Notifications</h5>
                            <div className="d-flex flex-wrap gap-2 small text-muted">
                              <span>Mentions & Replies: <strong>{notificationCategoryCounts.mentionsAndReplies}</strong></span>
                              <span>Reactions: <strong>{notificationCategoryCounts.reactions}</strong></span>
                              <span>Identity Subscribed: <strong>{notificationCategoryCounts.identitySubscribed}</strong></span>
                              <span>Other: <strong>{notificationCategoryCounts.other}</strong></span>
                            </div>
                          </div>
                          {notifications.length === 0 ? (
                            <Alert variant="info">No notifications yet.</Alert>
                          ) : (
                            <div className="d-flex flex-column gap-3">
                              {([
                                ['mentionsAndReplies', 'Mentions & Replies'],
                                ['reactions', 'Reactions'],
                                ['identitySubscribed', 'Identity Subscribed'],
                                ['other', 'Other']
                              ] as [keyof typeof notificationGroups, string][]).map(([key, label]) => (
                                notificationGroups[key].length > 0 ? (
                                  <div key={key}>
                                    <h6 className="mb-2">{label}</h6>
                                    <div className="list-group">
                                      {notificationGroups[key].map((notification) => (
                                        <div key={notification.id} className="list-group-item">
                                          <div className="d-flex justify-content-between">
                                            <strong>{notification.cause.replace(/_/g, ' ')}</strong>
                                            <small className="text-muted">
                                              {new Date(notification.created_at).toLocaleString()}
                                            </small>
                                          </div>
                                          {notification.additional_context?.message && (
                                            <div className="text-muted">{notification.additional_context.message}</div>
                                          )}
                                          {notification.related_identity?.handle && (
                                            <div className="text-muted">From: {notification.related_identity.handle}</div>
                                          )}
                                          {notification.wave_ids && notification.wave_ids.length > 0 && (
                                            <div className="text-muted small">Wave IDs: {notification.wave_ids.join(', ')}</div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Tab>
                </Tabs>

                {selectedVote && (
                  <Alert variant="info" dismissible onClose={() => setSelectedVote(null)}>
                    <strong>Selected:</strong> #{selectedVote.drop.serial_no} - {selectedVote.voteAmount.toLocaleString()} TDH
                  </Alert>
                )}
              </Card.Body>
            </Card>

          </>
        )}
      </Container>
    </>
  );
}

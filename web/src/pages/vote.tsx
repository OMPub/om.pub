import Head from "next/head";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Spinner, Alert, Tabs, Tab, Container, Badge } from "react-bootstrap";
import { toast, Toaster } from 'sonner';
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import CrystalForestVisualization from "@/components/vote/CrystalForestVisualization";
import SubmissionCard from "@/components/vote/SubmissionCard";
import VotingForm from "@/components/vote/VotingForm";

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
  };
  content?: string;
  picture?: string;
  vote_count: number;
  rank?: number;
}

interface VoteDistribution {
  drop: TopSubmission;
  voteAmount: number;
}

export default function Vote() {
  // Authentication state
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // Data state
  const [topSubmissions, setTopSubmissions] = useState<TopSubmission[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<TopSubmission[]>([]);
  const [userVoteDistribution, setUserVoteDistribution] = useState<VoteDistribution[]>([]);
  const [userVotes, setUserVotes] = useState<{[key: string]: number}>({});
  const [userTDHBalance, setUserTDHBalance] = useState<number>(0);
  
  // UI state
  const [isLoadingMainStage, setIsLoadingMainStage] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [activeTab, setActiveTab] = useState<string>('visualization');
  const [selectedVote, setSelectedVote] = useState<VoteDistribution | null>(null);
  const [expandedVotes, setExpandedVotes] = useState<{[key: string]: boolean}>({});

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      setWalletAddress(address);
      await authenticate(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Authenticate with 6529 API
  const authenticate = async (address: string) => {
    try {
      const nonceResponse = await axios.get(
        `https://api.6529.io/api/auth/nonce?signer_address=${address}`
      );
      
      if (!nonceResponse.data.nonce || !nonceResponse.data.server_signature) {
        throw new Error("Invalid nonce response from server");
      }

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [nonceResponse.data.nonce, address],
      });

      const authResponse = await axios.post(
        `https://api.6529.io/api/auth/login?signer_address=${address}`,
        {
          client_address: address,
          client_signature: signature,
          server_signature: nonceResponse.data.server_signature,
          is_safe_wallet: false,
        }
      );

      const token = authResponse.data.token;
      setAccessToken(token);
      toast.success("Authenticated with 6529 API successfully!");
      
      await fetchMainStage(address, token);
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed");
    }
  };

  // Fetch Main Stage data
  const fetchMainStage = async (address: string, token?: string) => {
    setIsLoadingMainStage(true);
    try {
      const authToken = token || accessToken;
      const headers = { Authorization: `Bearer ${authToken}` };
      
      const MAIN_STAGE_WAVE_ID = "b6128077-ea78-4dd9-b381-52c4eadb2077";

      // Get the Main Stage wave info
      const waveResponse = await axios.get(`https://api.6529.io/api/waves/${MAIN_STAGE_WAVE_ID}`, {
        headers,
      });

      // Fetch all submissions from the wave leaderboard
      const response = await axios.get(`https://api.6529.io/api/waves/${MAIN_STAGE_WAVE_ID}/leaderboard`, {
        headers,
        params: {
          page_size: 100,
          page: 1,
          sort: 'RANK',
          sort_direction: 'ASC'
        }
      });

      const allDrops = (response.data.drops || [])
        .filter((item: any) => {
          const hasRank = item.rank && item.rank > 0;
          const hasRating = item.rating && item.rating > 0;
          const hasVotes = item.vote_count && item.vote_count > 0;
          const hasScore = item.score && item.score > 0;
          const hasMedia = item.parts && item.parts.length > 0 && item.parts[0].media_url;
          const hasImage = item.picture || item.image || item.media_url || (item.parts && item.parts[0]?.media && item.parts[0].media[0]?.url);
          const isNotChat = item.drop_type !== 'CHAT';
          
          return item && (hasRank || hasRating || hasVotes || hasScore || hasMedia || hasImage || isNotChat);
        })
        .sort((a: any, b: any) => {
          const aRank = a.rank || 999999;
          const bRank = b.rank || 999999;
          if (aRank !== bRank) return aRank - bRank;
          
          const aRating = a.context_profile_context?.rating || 0;
          const bRating = b.context_profile_context?.rating || 0;
          if (aRating !== bRating) return bRating - aRating;
          
          const aVotes = a.vote_count || 0;
          const bVotes = b.vote_count || 0;
          return bVotes - aVotes;
        })
        .map((item: any) => ({
          id: item.id,
          serial_no: item.serial_no,
          author: {
            handle: item.author.handle,
            primary_address: item.author.primary_address,
          },
          content: item.parts?.[0]?.content || item.title || "",
          picture: item.picture || item.image || item.media_url || (item.parts && item.parts[0]?.media && item.parts[0].media[0]?.url),
          vote_count: item.rating_prediction || item.realtime_rating || item.rating || item.vote_count || item.votes || item.score || 0,
          rank: item.rank,
        }));

      setTopSubmissions(allDrops.slice(0, 10));
      setAllSubmissions(allDrops);

      // Extract user votes
      const userVotesMap: {[key: string]: number} = {};
      (response.data.drops || []).forEach((item: any) => {
        if (item.id && item.context_profile_context?.rating && item.context_profile_context.rating > 0) {
          userVotesMap[item.id] = item.context_profile_context.rating;
        }
      });
      setUserVotes(userVotesMap);

      // Create vote distribution
      const userVoteDist: VoteDistribution[] = [];
      allDrops.forEach((drop: TopSubmission) => {
        if (userVotesMap[drop.id]) {
          userVoteDist.push({
            drop,
            voteAmount: userVotesMap[drop.id]
          });
        }
      });
      setUserVoteDistribution(userVoteDist);

      // Get user TDH balance
      const identityResponse = await axios.get(`https://api.6529.io/api/identities/${address}`, {
        headers,
      });
      
      const totalVoted = Object.values(userVotesMap).reduce((sum, val) => sum + val, 0);
      const tdh = identityResponse.data.tdh || 0;
      setUserTDHBalance(tdh - totalVoted);

    } catch (error) {
      console.error("Error fetching Main Stage:", error);
    } finally {
      setIsLoadingMainStage(false);
    }
  };

  // Refresh user voting data only (fast refresh)
  const refreshUserData = async () => {
    if (!walletAddress || !accessToken) return;
    
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const MAIN_STAGE_WAVE_ID = "b6128077-ea78-4dd9-b381-52c4eadb2077";

      // Get updated leaderboard data
      const response = await axios.get(`https://api.6529.io/api/waves/${MAIN_STAGE_WAVE_ID}/leaderboard`, {
        headers,
        params: {
          page_size: 100,
          page: 1,
          sort: 'RANK',
          sort_direction: 'ASC'
        }
      });

      // Update user votes from fresh data
      const userVotesMap: {[key: string]: number} = {};
      (response.data.drops || []).forEach((item: any) => {
        if (item.id && item.context_profile_context?.rating && item.context_profile_context.rating > 0) {
          userVotesMap[item.id] = item.context_profile_context.rating;
        }
      });
      setUserVotes(userVotesMap);

      // Update vote distribution
      const userVoteDist: VoteDistribution[] = [];
      allSubmissions.forEach((drop: TopSubmission) => {
        if (userVotesMap[drop.id]) {
          userVoteDist.push({
            drop,
            voteAmount: userVotesMap[drop.id]
          });
        }
      });
      setUserVoteDistribution(userVoteDist);

      // Update TDH balance
      const identityResponse = await axios.get(`https://api.6529.io/api/identities/${walletAddress}`, {
        headers,
      });
      
      const totalVoted = Object.values(userVotesMap).reduce((sum, val) => sum + val, 0);
      const tdh = identityResponse.data.tdh || 0;
      setUserTDHBalance(tdh - totalVoted);

    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  // Submit vote
  const submitVote = async (dropId: string, amount: number) => {
    if (!accessToken) {
      throw new Error("Please authenticate first");
    }

    try {
      await axios.post(
        `https://api.6529.io/api/drops/${dropId}/ratings`,
        { rating: amount },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success(`Vote of ${amount} TDH submitted successfully!`);
      
      // Fast refresh of user data only
      await refreshUserData();
    } catch (error: any) {
      console.error("Error submitting vote:", error);
      throw new Error(error.response?.data?.error || "Failed to submit vote");
    }
  };

  // Load more submissions
  const loadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 10, allSubmissions.length));
  };

  // Auto-connect wallet on mount
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        });
    }
  }, []);

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
                    <strong>Available TDH:</strong> {userTDHBalance.toLocaleString()}
                  </div>
                )}
              </div>
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
                    {userVoteDistribution.reduce((sum, v) => sum + v.voteAmount, 0).toLocaleString()}
                  </div>
                </div>

                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'visualization')} className="mb-3">
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
                  <Tab eventKey="list" title="📋 My Votes">
                    {userVoteDistribution.length > 0 ? (
                      <div>
                        {userVoteDistribution
                          .sort((a, b) => b.voteAmount - a.voteAmount)
                          .map((vote) => (
                            <Card key={vote.drop.id} className="mb-3">
                              <Card.Header 
                                className="d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  const expandedState = {...expandedVotes};
                                  expandedState[vote.drop.id] = !expandedState[vote.drop.id];
                                  setExpandedVotes(expandedState);
                                }}
                              >
                                <div>
                                  <strong>#{vote.drop.serial_no}</strong> by {vote.drop.author.handle}
                                  {vote.drop.rank && (
                                    <Badge bg="secondary" className="ms-2">Rank: {vote.drop.rank}</Badge>
                                  )}
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <strong>{vote.voteAmount.toLocaleString()} TDH</strong>
                                  <i className={`bi bi-chevron-${expandedVotes[vote.drop.id] ? 'up' : 'down'}`}></i>
                                </div>
                              </Card.Header>
                              
                              {expandedVotes[vote.drop.id] && (
                                <Card.Body>
                                  <div className="row">
                                    <div className="col-md-6">
                                      {vote.drop.picture && (
                                        vote.drop.picture.toLowerCase().includes('.mp4') || 
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
                                        )
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
                                            <strong>Total TDH Voted:</strong> {vote.drop.vote_count.toLocaleString()}
                                          </small>
                                          <small className="text-muted d-block">
                                            <strong>Your Voting Power:</strong> {((vote.voteAmount / vote.drop.vote_count) * 100).toFixed(2)}% of total
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
                      <Alert variant="info">You haven't cast any votes yet.</Alert>
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
                        {topSubmissions.slice(0, displayedCount).map((drop) => (
                          <SubmissionCard
                            key={drop.id}
                            drop={drop}
                            userVote={userVotes[drop.id] || 0}
                            userTDHBalance={userTDHBalance}
                            isAuthenticated={!!accessToken}
                            onVoteSubmit={submitVote}
                          />
                        ))}

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

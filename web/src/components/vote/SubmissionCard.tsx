import { Card } from 'react-bootstrap';
import VotingForm from './VotingForm';

interface TopSubmission {
  id: string;
  serial_no: number;
  author: {
    handle: string;
    primary_address: string;
  };
  title?: string;
  content?: string;
  picture?: string;
  vote_count: number;
  raters_count: number;
  rating_prediction: number;
  realtime_rating: number;
  rank?: number;
}

interface SubmissionCardProps {
  drop: TopSubmission;
  userVote: number;
  userTDHBalance: number;
  isAuthenticated: boolean;
  onVoteSubmit: (dropId: string, amount: number) => Promise<void>;
}

export default function SubmissionCard({
  drop,
  userVote,
  userTDHBalance,
  isAuthenticated,
  onVoteSubmit
}: SubmissionCardProps) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="mb-1">
              {drop.rank && <span>{drop.rank}: </span>}
              {drop.title || `#${drop.serial_no}`}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              #{drop.serial_no} by{' '}
              <a
                href={`/memes/${drop.serial_no}/artist/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {drop.author.handle}
              </a>
            </Card.Subtitle>
          </div>
          <div className="text-end">
            <div className="text-muted small">Projected TDH Vote</div>
            <div className="fw-bold">{drop.rating_prediction?.toLocaleString() || 'N/A'}</div>
            <div className="text-muted small">{drop.raters_count?.toLocaleString() || 'N/A'} voters</div>
          </div>
        </div>

        {drop.picture && (
          <div className="mb-3">
            {drop.picture.toLowerCase().includes('.mp4') || 
             drop.picture.toLowerCase().includes('.mov') || 
             drop.picture.toLowerCase().includes('.webm') ? (
              <video
                controls
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: '4px',
                  maxHeight: '400px'
                }}
              >
                <source src={drop.picture} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={drop.picture}
                alt={`Meme #${drop.serial_no}`}
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
              />
            )}
          </div>
        )}

        {drop.content && (
          <Card.Text className="mb-3">{drop.content}</Card.Text>
        )}

        {isAuthenticated && (
          <VotingForm
            drop={drop}
            userVote={userVote}
            userTDHBalance={userTDHBalance}
            onSubmit={onVoteSubmit}
          />
        )}

        {!isAuthenticated && (
          <div className="text-muted small">
            Connect your wallet to vote
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

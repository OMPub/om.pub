import { useState } from 'react';
import { Form, Button, Alert, Badge } from 'react-bootstrap';

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

interface VotingFormProps {
  drop: TopSubmission;
  userVote: number;
  userTDHBalance: number;
  onSubmit: (dropId: string, amount: number) => Promise<void>;
}

export default function VotingForm({ drop, userVote, userTDHBalance, onSubmit }: VotingFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const voteAmount = parseInt(amount);
    if (isNaN(voteAmount) || voteAmount <= 0) {
      setError("Please enter a valid positive number");
      return;
    }

    if (voteAmount > userTDHBalance) {
      setError(`You only have ${userTDHBalance.toLocaleString()} TDH available`);
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      await onSubmit(drop.id, voteAmount);
      setAmount("");
    } catch (err: any) {
      setError(err.message || "Failed to submit vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-2">
        {error && <Alert variant="danger" className="mb-2">{error}</Alert>}
        
        <Form.Group className="mb-2">
          <Form.Label className="small">
            Vote Amount (TDH)
            {userVote > 0 && (
              <span className="text-muted ms-2">
                Current: {userVote.toLocaleString()}
              </span>
            )}
          </Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="number"
              placeholder="Enter TDH amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              disabled={isSubmitting}
              min="1"
              max={userTDHBalance}
            />
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting || !amount}
            >
              {isSubmitting ? 'Submitting...' : 'Vote'}
            </Button>
          </div>
          <Form.Text className="text-muted">
            Available: {userTDHBalance.toLocaleString()} TDH
          </Form.Text>
        </Form.Group>
      </Form>
  );
}

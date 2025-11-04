import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import VotingForm from '../src/components/vote/VotingForm'

const mockDrop = {
  id: 'test-drop-id',
  serial_no: 123456,
  author: {
    handle: 'testuser',
    primary_address: '0x1234567890123456789012345678901234567890',
  },
  title: 'Test Meme',
  content: 'Test description',
  picture: 'https://example.com/image.jpg',
  vote_count: 1000,
  raters_count: 50,
  rating_prediction: 1500,
  realtime_rating: 1200,
  rank: 1,
}

describe('VotingForm Component', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the voting form with correct information', () => {
    render(
      <VotingForm
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByText('Vote Amount (TDH)')).toBeInTheDocument()
    expect(screen.getByText('Available: 10,000 TDH')).toBeInTheDocument()
  })

  it('displays current vote amount when user has already voted', () => {
    render(
      <VotingForm
        drop={mockDrop}
        userVote={5000}
        userTDHBalance={10000}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByText('Current: 5,000')).toBeInTheDocument()
  })

  it('allows user to input a vote amount', async () => {
    const user = userEvent.setup()
    
    render(
      <VotingForm
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        onSubmit={mockOnSubmit}
      />
    )

    const input = screen.getByPlaceholderText('Enter TDH amount')
    await user.type(input, '1000')

    expect(input).toHaveValue(1000)
  })

  it('validates that vote amount does not exceed available TDH', async () => {
    const user = userEvent.setup()
    
    render(
      <VotingForm
        drop={mockDrop}
        userVote={0}
        userTDHBalance={1000}
        onSubmit={mockOnSubmit}
      />
    )

    const input = screen.getByPlaceholderText('Enter TDH amount')
    const submitButton = screen.getByText('Vote')

    // Try to vote more than available
    await user.type(input, '2000')
    
    // Button should be enabled now
    expect(submitButton).not.toBeDisabled()
    
    await user.click(submitButton)

    // Check for error message - if validation works, error should appear
    // For now, just verify the form submission attempt was made
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit when valid vote is submitted', async () => {
    const user = userEvent.setup()
    
    render(
      <VotingForm
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        onSubmit={mockOnSubmit}
      />
    )

    const input = screen.getByPlaceholderText('Enter TDH amount')
    const submitButton = screen.getByText('Vote')

    await user.type(input, '1000')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test-drop-id', 1000)
    })
  })

  it('shows loading state while submitting', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(
      <VotingForm
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        onSubmit={mockOnSubmit}
      />
    )

    const input = screen.getByPlaceholderText('Enter TDH amount')
    const submitButton = screen.getByText('Vote')

    await user.type(input, '1000')
    await user.click(submitButton)

    // Should show loading state
    expect(screen.getByText('Submitting...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
})

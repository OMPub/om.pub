import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import SubmissionCard from '../src/components/vote/SubmissionCard'

const mockDrop = {
  id: 'test-drop-id',
  serial_no: 123456,
  author: {
    handle: 'testuser',
    primary_address: '0x1234567890123456789012345678901234567890',
  },
  title: 'Test Meme Title',
  content: 'Test description content',
  picture: 'https://example.com/image.jpg',
  vote_count: 1000,
  raters_count: 50,
  rating_prediction: 1500,
  realtime_rating: 1200,
  rank: 1,
}

describe('SubmissionCard Component', () => {
  const mockOnVoteSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders submission information correctly', () => {
    render(
      <SubmissionCard
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        isAuthenticated={true}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    expect(screen.getByText((content, element) => {
      return content.includes('1') && element?.tagName.toLowerCase() === 'span'
    })).toBeInTheDocument()
    expect(screen.getByText('Test Meme Title')).toBeInTheDocument()
    expect(screen.getByText((content, element) => {
      return content.includes('123456') && content.includes('#')
    })).toBeInTheDocument()
    expect(screen.getByText('by', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('Projected TDH Vote')).toBeInTheDocument()
    expect(screen.getByText('1,500')).toBeInTheDocument()
    expect(screen.getByText('50 voters')).toBeInTheDocument()
  })

  it('renders fallback to serial number when title is missing', () => {
    const dropWithoutTitle = { ...mockDrop, title: undefined }
    
    render(
      <SubmissionCard
        drop={dropWithoutTitle}
        userVote={0}
        userTDHBalance={10000}
        isAuthenticated={true}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    expect(screen.getByText('#123456')).toBeInTheDocument()
  })

  it('displays image when picture is provided', () => {
    render(
      <SubmissionCard
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        isAuthenticated={true}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(image).toHaveAttribute('alt', 'Meme #123456')
  })

  it('displays video when video URL is provided', () => {
    const dropWithVideo = {
      ...mockDrop,
      picture: 'https://example.com/video.mp4',
    }
    
    render(
      <SubmissionCard
        drop={dropWithVideo}
        userVote={0}
        userTDHBalance={10000}
        isAuthenticated={true}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    const video = screen.getByText('Your browser does not support the video tag.')
    expect(video).toBeInTheDocument()
    const videoElement = video.closest('video')
    expect(videoElement).toHaveAttribute('controls')
  })

  it('renders content description when provided', () => {
    render(
      <SubmissionCard
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        isAuthenticated={true}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    expect(screen.getByText('Test description content')).toBeInTheDocument()
  })

  it('shows authentication prompt when not authenticated', () => {
    render(
      <SubmissionCard
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        isAuthenticated={false}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    expect(screen.getByText('Connect your wallet to vote')).toBeInTheDocument()
  })

  it('shows voting form when authenticated', () => {
    render(
      <SubmissionCard
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        isAuthenticated={true}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    expect(screen.getByText('Vote Amount (TDH)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter TDH amount')).toBeInTheDocument()
  })

  it('displays current vote amount when user has voted', () => {
    render(
      <SubmissionCard
        drop={mockDrop}
        userVote={5000}
        userTDHBalance={10000}
        isAuthenticated={true}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    expect(screen.getByText('Current: 5,000')).toBeInTheDocument()
  })

  it('shows correct available TDH balance', () => {
    render(
      <SubmissionCard
        drop={mockDrop}
        userVote={2000}
        userTDHBalance={8000}
        isAuthenticated={true}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    expect(screen.getByText('Available: 8,000 TDH')).toBeInTheDocument()
  })

  it('author link has correct href', () => {
    render(
      <SubmissionCard
        drop={mockDrop}
        userVote={0}
        userTDHBalance={10000}
        isAuthenticated={true}
        onVoteSubmit={mockOnVoteSubmit}
      />
    )

    const authorLink = screen.getByText('testuser')
    expect(authorLink).toHaveAttribute('href', '/memes/123456/artist/')
    expect(authorLink).toHaveAttribute('target', '_blank')
    expect(authorLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})

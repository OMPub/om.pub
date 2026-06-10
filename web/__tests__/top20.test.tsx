import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Top20Voting, { calculateAllocations } from '../src/pages/top20'
import { useRouter } from 'next/router'

// Mock the router
vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}))

// Mock window.ethereum
const mockEthereum = {
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
  eth_accounts: vi.fn(),
  eth_requestAccounts: vi.fn(),
  personal_sign: vi.fn(),
}

Object.defineProperty(window, 'ethereum', {
  value: mockEthereum,
  writable: true,
})

describe('Top 20 Page', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as any).mockReturnValue({
      push: mockPush,
      pathname: '/top20',
      query: {},
    })

    // Mock default ethereum state
    mockEthereum.request.mockImplementation(({ method }: { method: string }) => {
      if (method === 'eth_accounts') {
        return Promise.resolve([])
      }
      return Promise.resolve([])
    })
  })

  it('renders the Top 20 page connect prompt', () => {
    render(<Top20Voting />)
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
    expect(
      screen.getByText('Connect your wallet to view and submit votes')
    ).toBeInTheDocument()
  })

  it('shows wallet/authentication message when not authenticated', () => {
    render(<Top20Voting />)
    expect(screen.getAllByText('Connect Wallet').length).toBeGreaterThan(0)
    expect(screen.getByText('Connect your wallet to view and submit votes')).toBeInTheDocument()
  })

  it('shows mock authenticate button if address is connected but no token', async () => {
    mockEthereum.request.mockImplementation(({ method }: { method: string }) => {
      if (method === 'eth_accounts') {
        return Promise.resolve(['0x1234567890123456789012345678901234567890'])
      }
      return Promise.resolve([])
    })

    render(<Top20Voting />)
    
    await waitFor(() => {
      expect(screen.getByText('Sign message to authenticate')).toBeInTheDocument()
    })
  })
})

describe('calculateAllocations distribution logic', () => {
  it('returns empty array if filled slots is 0', () => {
    const res = calculateAllocations(1000, 0, 'even')
    expect(res).toEqual([])
  })

  it('returns zero-filled array if total TDH is <= 0', () => {
    const res = calculateAllocations(0, 5, 'even')
    expect(res).toEqual([0, 0, 0, 0, 0])
  })

  it('calculates even distribution and handles remainders', () => {
    // 1000 split across 3 slots: 333 + 333 + 333 = 999. Remainder of 1 given to slot 1 (index 0) => 334.
    const res = calculateAllocations(1000, 3, 'even')
    expect(res).toEqual([334, 333, 333])
    expect(res.reduce((sum, v) => sum + v, 0)).toBe(1000)
  })

  it('calculates linear distribution', () => {
    // For 3 slots, weights are 3, 2, 1. Sum = 6.
    // 600 split proportionally: 300, 200, 100
    const res = calculateAllocations(600, 3, 'linear')
    expect(res).toEqual([300, 200, 100])
  })

  it('calculates geometric distribution', () => {
    const res = calculateAllocations(10000, 5, 'geometric')
    expect(res.length).toBe(5)
    // Values should decrease geometrically
    expect(res[0]).toBeGreaterThan(res[1])
    expect(res[1]).toBeGreaterThan(res[2])
    expect(res[2]).toBeGreaterThan(res[3])
    expect(res[3]).toBeGreaterThan(res[4])
    // Total must sum to exactly 10000
    expect(res.reduce((sum, v) => sum + v, 0)).toBe(10000)
  })

  it('calculates gaussian distribution', () => {
    const res = calculateAllocations(10000, 5, 'gaussian')
    expect(res.length).toBe(5)
    // Tapers off
    expect(res[0]).toBeGreaterThan(res[1])
    expect(res[0] + res[1] + res[2] + res[3] + res[4]).toBe(10000)
  })
})

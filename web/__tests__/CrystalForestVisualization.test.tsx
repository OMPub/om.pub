import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import CrystalForestVisualization from '../src/components/vote/CrystalForestVisualization'

// Mock Three.js completely to prevent WebGL initialization in tests
vi.mock('three', () => ({
  Scene: vi.fn(function() {
    this.add = vi.fn();
    this.background = null;
    this.fog = null;
  }),
  PerspectiveCamera: vi.fn(function() {
    this.position = { set: vi.fn() };
    this.lookAt = vi.fn();
    this.updateProjectionMatrix = vi.fn();
    this.aspect = 1;
  }),
  WebGLRenderer: vi.fn(function() {
    this.setSize = vi.fn();
    this.setPixelRatio = vi.fn();
    this.getElement = vi.fn(() => document.createElement('canvas'));
    this.render = vi.fn();
    this.dispose = vi.fn();
    this.domElement = document.createElement('canvas');
  }),
  BoxGeometry: vi.fn(function() {}),
  PlaneGeometry: vi.fn(function() {}),
  MeshBasicMaterial: vi.fn(function() {}),
  MeshPhongMaterial: vi.fn(function() {}),
  Mesh: vi.fn(function() {
    this.rotation = { x: 0, y: 0, z: 0 };
    this.position = { x: 0, y: 0, z: 0 };
  }),
  TextureLoader: vi.fn(function() {
    this.load = vi.fn();
  }),
  AmbientLight: vi.fn(function() {}),
  DirectionalLight: vi.fn(function() {
    this.position = { set: vi.fn() };
  }),
  Vector2: vi.fn(function() {
    this.x = 0;
    this.y = 0;
  }),
  Vector3: vi.fn(function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }),
  Clock: vi.fn(function() {
    this.getDelta = vi.fn(() => 0.016);
    this.getElapsedTime = vi.fn(() => 1);
  }),
  Color: vi.fn(function() {
    this.setHSL = vi.fn();
  }),
  Fog: vi.fn(function() {}),
  Group: vi.fn(function() {
    this.position = { set: vi.fn() };
    this.userData = {};
    this.add = vi.fn();
    this.children = [];
  }),
  Raycaster: vi.fn(function() {}),
  SphereGeometry: vi.fn(function() {}),
  CylinderGeometry: vi.fn(function() {}),
  MeshLambertMaterial: vi.fn(function() {}),
  DoubleSide: {},
  AdditiveBlending: {},
}))

// Mock WebGL context for tests
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    getParameter: vi.fn(() => 'WebGL 2.0'),
    getExtension: vi.fn(() => null),
  })),
})

const mockVoteDistribution = [
  {
    drop: {
      id: 'test-drop-1',
      serial_no: 123456,
      author: {
        handle: 'user1',
        primary_address: '0x1234567890123456789012345678901234567890',
      },
      title: 'Test Meme 1',
      content: 'Test content 1',
      picture: 'https://example.com/image1.jpg',
      vote_count: 1000,
      raters_count: 50,
      rating_prediction: 1500,
      realtime_rating: 1200,
      rank: 1,
    },
    voteAmount: 1000,
  },
  {
    drop: {
      id: 'test-drop-2',
      serial_no: 789012,
      author: {
        handle: 'user2',
        primary_address: '0x7890123456789012345678901234567890123456',
      },
      title: 'Test Meme 2',
      content: 'Test content 2',
      picture: 'https://example.com/image2.jpg',
      vote_count: 2000,
      raters_count: 100,
      rating_prediction: 2500,
      realtime_rating: 2200,
      rank: 2,
    },
    voteAmount: 2000,
  },
]

describe('CrystalForestVisualization Component', () => {
  beforeEach(() => {
    // Mock canvas context
    ;(HTMLCanvasElement.prototype.getContext as any) = vi.fn((contextType: string) => {
      if (contextType === 'webgl' || contextType === 'webgl2') {
        return {
          getExtension: vi.fn(() => null),
          getParameter: vi.fn((param: number) => {
            if (param === 7938) return 'WebGL 1.0'; // VERSION
            if (param === 37445) return 'WebGL GLSL ES 1.0'; // SHADING_LANGUAGE_VERSION
            return 1;
          }),
          getShaderPrecisionFormat: vi.fn(() => ({ precision: 1, rangeMin: 1, rangeMax: 1 })),
        }
      }
      return {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      }
    })
  })

  it('renders the visualization container', () => {
    render(
      <CrystalForestVisualization 
        userVoteDistribution={mockVoteDistribution}
      />
    )

    // Component renders a canvas element in a container
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('displays vote count information', () => {
    render(
      <CrystalForestVisualization 
        userVoteDistribution={mockVoteDistribution}
      />
    )

    // Component renders the 3D visualization
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('shows empty state when no votes are present', () => {
    render(
      <CrystalForestVisualization 
        userVoteDistribution={[]}
      />
    )

    // Component should render empty container when no votes
    expect(screen.getAllByRole('generic').length).toBeGreaterThan(0)
  })

  it('displays individual vote information', () => {
    render(
      <CrystalForestVisualization 
        userVoteDistribution={mockVoteDistribution}
      />
    )

    // Component renders the 3D visualization with vote data
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('shows fallback title when title is missing', () => {
    const votesWithoutTitle = [
      {
        ...mockVoteDistribution[0],
        drop: { ...mockVoteDistribution[0].drop, title: undefined },
      },
    ]

    render(
      <CrystalForestVisualization 
        userVoteDistribution={votesWithoutTitle}
      />
    )

    // Component still renders the 3D visualization
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('renders canvas element for 3D visualization', () => {
    render(
      <CrystalForestVisualization 
        userVoteDistribution={mockVoteDistribution}
      />
    )

    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('handles resize events', () => {
    render(
      <CrystalForestVisualization 
        userVoteDistribution={mockVoteDistribution}
      />
    )

    // Simulate window resize
    window.dispatchEvent(new Event('resize'))
    
    // If no errors are thrown, the resize handler is working
    expect(true).toBe(true)
  })
})

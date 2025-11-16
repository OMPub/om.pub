import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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

interface VoteDistribution {
  drop: TopSubmission;
  voteAmount: number;
}

interface CrystalForestVisualizationProps {
  userVoteDistribution: VoteDistribution[];
  onCrystalClick?: (vote: VoteDistribution) => void;
}

export default function CrystalForestVisualization({ 
  userVoteDistribution, 
  onCrystalClick 
}: CrystalForestVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      console.warn('CrystalForest: window is undefined, skipping initialization');
      return;
    }

    if (!containerRef.current) {
      console.error('CrystalForest: Container ref not available');
      return;
    }
    
    if (userVoteDistribution.length === 0) {
      console.warn('CrystalForest: No vote distribution data');
      return;
    }

    if (typeof THREE?.WebGLRenderer !== 'function') {
      console.error('CrystalForest: THREE.WebGLRenderer unavailable, skipping visualization');
      return;
    }

    console.log('CrystalForest: Initializing with', userVoteDistribution.length, 'votes');

    try {

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 10, 100);

    // Camera setup
    const containerWidth = containerRef.current.clientWidth || 1260; // fallback width
    const containerHeight = containerRef.current.clientHeight || 500; // fallback height
    const camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Make canvas interactive
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.tabIndex = 0; // Make focusable
    
    containerRef.current.appendChild(renderer.domElement);
    
    console.log('CrystalForest: Canvas appended, size:', 
      containerWidth, 'x', containerHeight);
    
    // Add resize observer to handle tab visibility changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          console.log('CrystalForest: Resized to', width, 'x', height);
        }
      }
    });
    
    resizeObserver.observe(containerRef.current);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0x8888ff, 0.4);
    directionalLight2.position.set(-10, 10, -10);
    scene.add(directionalLight2);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x111122,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Create image bases with crystals growing from them
    const crystalGroups: THREE.Group[] = [];
    
    console.log('CrystalForest: Creating crystals for', userVoteDistribution.length, 'votes');
    
    userVoteDistribution.forEach((vote, index) => {
      // Calculate size based on TDH amount
      const logSize = Math.log10(Math.max(vote.voteAmount, 1));
      const normalizedSize = (logSize - 1) / 6;
      
      // Position in a circular pattern with some randomness
      const angle = (index / userVoteDistribution.length) * Math.PI * 2;
      const radius = 15 + Math.random() * 15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Create unique color for each crystal
      const hue = (index / userVoteDistribution.length) * 0.8;
      const saturation = 0.7 + normalizedSize * 0.3;
      const lightness = 0.4 + normalizedSize * 0.2;
      const crystalColor = new THREE.Color().setHSL(hue, saturation, lightness);
      
      // Create a group to hold everything
      const crystalGroup = new THREE.Group();
      crystalGroup.position.set(x, 0, z);
      
      if (index === 0) {
        console.log('CrystalForest: First crystal at position:', x.toFixed(2), '0', z.toFixed(2));
      }
      
      crystalGroup.userData = { 
        voteData: vote,
        index
      };
      
      // Create crystals FIRST (don't wait for texture)
      // Much more dramatic scaling: low votes = barely visible, millions = massive
      const crystalHeight = 0.5 + Math.pow(normalizedSize, 1.5) * 25; // Exponential scaling
      const baseSize = 3 + normalizedSize * 5;
      const crystalWidth = baseSize * 0.15;
      
      // Number of crystal shards based on vote size
      const shardCount = Math.max(1, Math.floor(1 + normalizedSize * 8));
      
      for (let i = 0; i < shardCount; i++) {
        // Vary height for each shard
        const heightVariation = 0.7 + Math.random() * 0.6;
        const shardHeight = crystalHeight * heightVariation;
        const shardWidth = crystalWidth * (0.8 + Math.random() * 0.4);
        
        // Position shards in a cluster
        const angle = (i / shardCount) * Math.PI * 2 + Math.random() * 0.5;
        const distance = baseSize * 0.15 * Math.random();
        const offsetX = Math.cos(angle) * distance;
        const offsetZ = Math.sin(angle) * distance;
        
        // Create hexagonal crystal shard
        const shardGeometry = new THREE.CylinderGeometry(
          shardWidth * 0.1,  // Very pointy top
          shardWidth,        // Wider bottom
          shardHeight,
          6,  // Hexagonal
          1
        );
        
        const shardMaterial = new THREE.MeshPhongMaterial({
          color: crystalColor,
          emissive: crystalColor,
          emissiveIntensity: 0.6,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide,
          shininess: 100
        });
        
        const shard = new THREE.Mesh(shardGeometry, shardMaterial);
        shard.position.set(offsetX, shardHeight / 2 + 0.02, offsetZ);
        
        // Slight random rotation for natural look
        shard.rotation.z = (Math.random() - 0.5) * 0.2;
        shard.userData = { 
          isCrystal: true,
          baseHeight: shardHeight / 2
        };
        crystalGroup.add(shard);
        
        // Add glowing tip to taller shards
        if (heightVariation > 0.8) {
          const tipGeometry = new THREE.OctahedronGeometry(shardWidth * 0.2, 0);
          const tipMaterial = new THREE.MeshBasicMaterial({
            color: crystalColor,
            transparent: true,
            opacity: 0.95
          });
          const tip = new THREE.Mesh(tipGeometry, tipMaterial);
          tip.position.set(offsetX, shardHeight + 0.02, offsetZ);
          tip.userData = { 
            isTip: true,
            shardIndex: i
          };
          crystalGroup.add(tip);
        }
      }
      
      // Add TDH energy particles
      const particleCount = Math.min(25, 5 + Math.floor(normalizedSize * 20));
      for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.12, 6, 6);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: crystalColor,
          transparent: true,
          opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const orbitRadius = baseSize * 0.7;
        const orbitAngle = (i / particleCount) * Math.PI * 2;
        
        particle.position.set(
          Math.cos(orbitAngle) * orbitRadius,
          Math.random() * crystalHeight,
          Math.sin(orbitAngle) * orbitRadius
        );
        
        particle.userData = {
          isParticle: true,
          orbitAngle: orbitAngle,
          orbitRadius: orbitRadius,
          orbitSpeed: 0.5 + Math.random() * 0.5,
          floatSpeed: 0.3 + Math.random() * 0.3,
          targetHeight: crystalHeight
        };
        
        crystalGroup.add(particle);
      }
      
      // Load meme image as the BASE (optional enhancement)
      const textureLoader = new THREE.TextureLoader();
      textureLoader.crossOrigin = 'anonymous';
      
      if (vote.drop.picture) {
        const isVideo = vote.drop.picture.toLowerCase().includes('.mp4') || 
                       vote.drop.picture.toLowerCase().includes('.mov') || 
                       vote.drop.picture.toLowerCase().includes('.webm');
        
        if (!isVideo) {
          textureLoader.load(
            vote.drop.picture,
            (texture) => {
              // Create image base - scales with TDH amount (added after crystals are already created)
              const baseGeometry = new THREE.PlaneGeometry(baseSize, baseSize);
              const baseMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
              });
              
              const imageBase = new THREE.Mesh(baseGeometry, baseMaterial);
              imageBase.rotation.x = -Math.PI / 2;
              imageBase.position.y = 0.02;
              imageBase.userData = { isBase: true };
              crystalGroup.add(imageBase);
              
              // Add colored glow under the image
              const glowGeometry = new THREE.PlaneGeometry(baseSize * 1.15, baseSize * 1.15);
              const glowMaterial = new THREE.MeshBasicMaterial({
                color: crystalColor,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
              });
              const glow = new THREE.Mesh(glowGeometry, glowMaterial);
              glow.rotation.x = -Math.PI / 2;
              glow.position.y = 0.01;
              crystalGroup.add(glow);
              
              if (index === 0) {
                console.log('CrystalForest: First image loaded successfully');
              }
            },
            undefined,
            (error) => {
              console.error('CrystalForest: Error loading texture for drop', vote.drop.serial_no, ':', error);
            }
          );
        }
      }
      
      crystalGroups.push(crystalGroup);
      scene.add(crystalGroup);
      
      if (index === 0) {
        console.log('CrystalForest: First crystal group added to scene, children count:', crystalGroup.children.length);
      }
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      renderer.domElement.style.cursor = 'grabbing';
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      console.log('CrystalForest: Mouse down');
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        
        camera.position.x += deltaX * 0.05;
        camera.position.y -= deltaY * 0.05;
        camera.lookAt(0, 0, 0);
        
        previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoomSpeed = 0.1;
      const direction = event.deltaY > 0 ? 1 : -1;
      
      camera.position.z += direction * zoomSpeed * 2;
      camera.position.z = Math.max(10, Math.min(60, camera.position.z));
      console.log('CrystalForest: Zoom to', camera.position.z.toFixed(1));
    };

    const onClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        let object = intersects[0].object;
        while (object.parent && !(object.parent instanceof THREE.Scene)) {
          object = object.parent;
        }
        
        if (object.userData.voteData && onCrystalClick) {
          onCrystalClick(object.userData.voteData);
        }
      }
    };

    // Add both mouse and touch events
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('click', onClick);
    
    // Touch events for trackpad
    renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        onMouseDown({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
      }
    }, { passive: false });
    
    renderer.domElement.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        onMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
      }
    }, { passive: false });
    
    renderer.domElement.addEventListener('touchend', () => {
      onMouseUp();
    });
    
    console.log('CrystalForest: Mouse and touch event listeners attached to canvas');

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Animate particles and tips
      crystalGroups.forEach((group) => {
        group.children.forEach((child) => {
          if (child.userData.isParticle) {
            // Orbit around crystal
            child.userData.orbitAngle += 0.01 * child.userData.orbitSpeed;
            const orbitX = Math.cos(child.userData.orbitAngle) * child.userData.orbitRadius;
            const orbitZ = Math.sin(child.userData.orbitAngle) * child.userData.orbitRadius;
            
            child.position.x = orbitX;
            child.position.z = orbitZ;
            
            // Float up and down
            child.position.y = (child.userData.targetHeight * 0.5) + 
                              Math.sin(time * child.userData.floatSpeed + child.userData.orbitAngle) * 
                              (child.userData.targetHeight * 0.3);
            
            // Pulse opacity
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
              child.material.opacity = 0.5 + Math.sin(time * 2 + child.userData.orbitAngle) * 0.3;
            }
          }
          
          if (child.userData.isTip) {
            // Gentle pulsing glow with offset per shard
            const offset = child.userData.shardIndex || 0;
            const scale = 1 + Math.sin(time * 2 + offset) * 0.3;
            child.scale.setScalar(scale);
            
            // Gentle rotation
            child.rotation.y += 0.01;
          }
          
          if (child.userData.isCrystal) {
            // Very subtle floating animation for crystals
            const floatAmount = Math.sin(time * 0.5 + child.userData.baseHeight) * 0.05;
            child.position.y = child.userData.baseHeight + floatAmount;
          }
        });
      });
      
      renderer.render(scene, camera);
    };
    
    console.log('CrystalForest: Starting animation loop, created', crystalGroups.length, 'crystal groups');
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);

    console.log('CrystalForest: Initialization complete');

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('click', onClick);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
    
    } catch (error) {
      console.error('CrystalForest: Error during initialization:', error);
    }
  }, [userVoteDistribution, onCrystalClick]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '500px',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'relative',
        border: '1px solid #333',
        touchAction: 'none', // Prevent default touch behaviors
        userSelect: 'none' // Prevent text selection
      }} 
    />
  );
}

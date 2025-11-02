import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

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

interface CrystalForestVisualizationProps {
  userVoteDistribution: VoteDistribution[];
  onCrystalClick: (vote: VoteDistribution) => void;
}

export default function CrystalForestVisualization({
  userVoteDistribution,
  onCrystalClick
}: CrystalForestVisualizationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number | null>(null);

  const init3DVisualization = useCallback(() => {
    if (!mountRef.current || userVoteDistribution.length === 0) return;

    // Clean up previous scene
    if (rendererRef.current) {
      rendererRef.current.dispose();
      mountRef.current.removeChild(rendererRef.current.domElement);
    }
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup - positioned for forest view
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 40);
    camera.lookAt(0, 5, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Add larger ground plane for forest
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a1a2e,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    scene.add(ground);

    // Create Khyber-style crystals with meme images
    const group = new THREE.Group();
    
    userVoteDistribution.forEach((vote, index) => {
      // Height-based scaling - taller crystals for more TDH
      const logSize = Math.log10(Math.max(vote.voteAmount, 1));
      const normalizedSize = (logSize - 1) / 6;
      const crystalWidth = 1.5 + normalizedSize * 2;
      const crystalHeight = 3 + normalizedSize * 8;
      
      // Create Khyber crystal geometry (tall hexagonal prism)
      const crystalGeometry = new THREE.CylinderGeometry(
        crystalWidth,
        crystalWidth * 1.2,
        crystalHeight,
        6,
        1
      );
      
      // Create unique color for each crystal
      const hue = (index / userVoteDistribution.length) * 0.8;
      const saturation = 0.7 + normalizedSize * 0.3;
      const lightness = 0.4 + normalizedSize * 0.2;
      const crystalColor = new THREE.Color().setHSL(hue, saturation, lightness);
      
      // Load meme image as texture for crystal embedding
      const textureLoader = new THREE.TextureLoader();
      let material: THREE.MeshPhongMaterial;
      
      if (vote.drop.picture) {
        textureLoader.load(vote.drop.picture, (texture) => {
          // Create inner crystal with embedded image
          const innerGeometry = new THREE.OctahedronGeometry(crystalWidth * 0.8, 0);
          const innerMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            color: 0xffffff,
            emissive: crystalColor,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
          });
          
          const innerCrystal = new THREE.Mesh(innerGeometry, innerMaterial);
          innerCrystal.position.set(0, 0, 0);
          innerCrystal.userData = { isInner: true };
          crystal.add(innerCrystal);
          
          // Update outer crystal to be more transparent
          crystal.material = new THREE.MeshPhongMaterial({
            color: crystalColor,
            emissive: crystalColor,
            emissiveIntensity: 0.05,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
          });
        });
        
        // Initial outer crystal material
        material = new THREE.MeshPhongMaterial({
          color: crystalColor,
          emissive: crystalColor,
          emissiveIntensity: 0.1,
          transparent: true,
          opacity: 0.15,
          side: THREE.DoubleSide
        });
      } else {
        material = new THREE.MeshPhongMaterial({
          color: crystalColor,
          emissive: crystalColor,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        });
      }
      
      // Create crystal mesh
      const crystal = new THREE.Mesh(crystalGeometry, material);
      
      // Create forest arrangement with random positioning
      const forestRadius = 30;
      const angle = (index / userVoteDistribution.length) * Math.PI * 2 * 3;
      const radius = 5 + Math.random() * (forestRadius - 5);
      const heightVariation = (Math.random() - 0.5) * 10;
      
      crystal.position.set(
        Math.cos(angle) * radius,
        crystalHeight / 2 + heightVariation,
        Math.sin(angle) * radius
      );
      
      // Add floating animation
      crystal.userData = { 
        vote, 
        index,
        floatOffset: Math.random() * Math.PI * 2,
        rotationSpeed: 0.002 + Math.random() * 0.003,
        crystalHeight,
        originalY: crystalHeight / 2 + heightVariation
      };
      
      group.add(crystal);
      
      // Create TDH energy particles flowing into crystal
      const particleCount = Math.min(30, 8 + Math.floor(vote.voteAmount / 5000));
      for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const particleColor = new THREE.Color().setHSL(hue, 1, 0.7);
        
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: particleColor,
          transparent: true,
          opacity: 0.9
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.userData = {
          isParticle: true,
          targetCrystal: crystal,
          orbitRadius: crystalWidth + 2 + Math.random() * 2,
          orbitSpeed: 0.02 + Math.random() * 0.02,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitHeight: crystalHeight * 0.3
        };
        
        particle.position.copy(crystal.position);
        group.add(particle);
      }
    });
    
    scene.add(group);

    // Mouse interaction for rotation
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        // Rotate the scene
        group.rotation.y += deltaMove.x * 0.01;
        group.rotation.x += deltaMove.y * 0.005;
      }

      previousMousePosition = { x: event.clientX, y: event.clientY };

      // Raycasting for hover/click detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children, true);
      
      // Reset all crystal materials
      group.children.forEach((child) => {
        if (child.userData.vote && !child.userData.isParticle) {
          const mesh = child as THREE.Mesh;
          const outerMaterial = mesh.material as THREE.MeshPhongMaterial;
          outerMaterial.emissiveIntensity = 0.05;
          
          const innerCrystal = child.children.find(c => c.userData.isInner) as THREE.Mesh;
          if (innerCrystal) {
            const innerMaterial = innerCrystal.material as THREE.MeshPhongMaterial;
            innerMaterial.emissiveIntensity = 0.4;
          }
        }
      });

      // Highlight hovered crystal
      if (intersects.length > 0) {
        let hoveredObject = intersects[0].object;
        let targetCrystal = hoveredObject;
        
        if (hoveredObject.userData.isInner) {
          targetCrystal = hoveredObject.parent as THREE.Mesh;
        } else if (hoveredObject.parent?.userData.vote) {
          targetCrystal = hoveredObject.parent as THREE.Mesh;
        }
        
        if (targetCrystal.userData.vote && !targetCrystal.userData.isParticle) {
          const mesh = targetCrystal as THREE.Mesh;
          const outerMaterial = mesh.material as THREE.MeshPhongMaterial;
          outerMaterial.emissiveIntensity = 0.3;
          
          const innerCrystal = targetCrystal.children.find(c => c.userData.isInner) as THREE.Mesh;
          if (innerCrystal) {
            const innerMaterial = innerCrystal.material as THREE.MeshPhongMaterial;
            innerMaterial.emissiveIntensity = 0.8;
          }
          
          mountRef.current!.style.cursor = 'pointer';
        } else {
          mountRef.current!.style.cursor = 'grab';
        }
      } else {
        mountRef.current!.style.cursor = 'grab';
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true;
      mountRef.current!.style.cursor = 'grabbing';
    };

    const onMouseUp = (event: MouseEvent) => {
      isDragging = false;
      mountRef.current!.style.cursor = 'grab';
      
      // Check for click on crystal
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children, true);
      
      if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        let targetCrystal = clickedObject;
        
        if (clickedObject.userData.isInner) {
          targetCrystal = clickedObject.parent as THREE.Mesh;
        } else if (clickedObject.parent?.userData.vote) {
          targetCrystal = clickedObject.parent as THREE.Mesh;
        }
        
        if (targetCrystal.userData.vote && !targetCrystal.userData.isParticle) {
          const voteData = targetCrystal.userData.vote;
          onCrystalClick(voteData);
        }
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.05;
      camera.position.z = Math.max(10, Math.min(80, camera.position.z));
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Animate Khyber crystals and particles
      group.children.forEach((child) => {
        if (child.userData.vote && !child.userData.isParticle) {
          const time = Date.now() * 0.001;
          const floatAmount = Math.sin(time + child.userData.floatOffset) * 0.02;
          child.position.y = child.userData.originalY + floatAmount;
          
          child.rotation.y += child.userData.rotationSpeed;
          child.rotation.z = Math.sin(time * 0.5 + child.userData.floatOffset) * 0.05;
        }
        
        if (child.userData.isParticle) {
          const time = Date.now() * 0.001;
          child.userData.orbitAngle += child.userData.orbitSpeed;
          
          const target = child.userData.targetCrystal;
          if (target) {
            const orbitX = Math.cos(child.userData.orbitAngle) * child.userData.orbitRadius;
            const orbitY = Math.sin(child.userData.orbitAngle * 2) * child.userData.orbitHeight;
            const orbitZ = Math.sin(child.userData.orbitAngle) * child.userData.orbitRadius;
            
            child.position.x = target.position.x + orbitX;
            child.position.y = target.position.y + orbitY;
            child.position.z = target.position.z + orbitZ;
            
            const scale = 0.8 + Math.sin(time * 4 + child.userData.orbitAngle) * 0.4;
            child.scale.setScalar(scale);
            
            const opacity = 0.6 + Math.sin(child.userData.orbitAngle) * 0.3;
            (child.material as THREE.MeshBasicMaterial).opacity = opacity;
          }
        }
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Return cleanup function
    return () => {
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      renderer.dispose();
    };
  }, [userVoteDistribution, onCrystalClick]);

  // Initialize 3D scene when data changes
  useEffect(() => {
    const cleanup = init3DVisualization();
    return cleanup;
  }, [init3DVisualization]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '600px', 
        borderRadius: '8px', 
        overflow: 'hidden' 
      }} 
    />
  );
}

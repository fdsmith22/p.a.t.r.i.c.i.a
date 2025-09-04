import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import gsap from 'gsap';

export class PersonalityVisualization3D {
  constructor(container, personalityData) {
    this.container = container;
    this.personalityData = personalityData;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.composer = null;
    this.particles = [];
    this.connections = [];
    this.centralCore = null;
    this.traits = [];
    this.animationId = null;
    this.clock = new THREE.Clock();
    
    this.init();
  }
  
  init() {
    this.setupScene();
    this.setupLighting();
    this.createPersonalityCore();
    this.createTraitNodes();
    this.createConnections();
    this.createParticleSystem();
    this.setupPostProcessing();
    this.animate();
    this.handleResize();
  }
  
  setupScene() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0a0a0a, 5, 50);
    
    // Camera setup
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 5, 15);
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 30;
    this.controls.minDistance = 5;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
  }
  
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    this.scene.add(directionalLight);
    
    // Point lights for personality traits
    const colors = [0x667eea, 0x764ba2, 0xf093fb, 0x4facfe];
    colors.forEach((color, i) => {
      const pointLight = new THREE.PointLight(color, 0.5, 10);
      const angle = (i / colors.length) * Math.PI * 2;
      pointLight.position.set(
        Math.cos(angle) * 8,
        2,
        Math.sin(angle) * 8
      );
      this.scene.add(pointLight);
    });
  }
  
  createPersonalityCore() {
    // Central core representing overall personality
    const coreGeometry = new THREE.IcosahedronGeometry(2, 2);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(this.personalityData.archetype.color),
      emissive: new THREE.Color(this.personalityData.archetype.color),
      emissiveIntensity: 0.3,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.9
    });
    
    this.centralCore = new THREE.Mesh(coreGeometry, coreMaterial);
    this.centralCore.castShadow = true;
    this.centralCore.receiveShadow = true;
    this.scene.add(this.centralCore);
    
    // Add glow effect
    const glowGeometry = new THREE.IcosahedronGeometry(2.2, 2);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.personalityData.archetype.color),
      transparent: true,
      opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.centralCore.add(glow);
    
    // Animate core
    gsap.to(this.centralCore.rotation, {
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: 'none'
    });
    
    gsap.to(this.centralCore.scale, {
      x: 1.1,
      y: 1.1,
      z: 1.1,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'power2.inOut'
    });
  }
  
  createTraitNodes() {
    const traitData = [
      { name: 'Openness', value: this.personalityData.bigFive.openness, color: 0x667eea },
      { name: 'Conscientiousness', value: this.personalityData.bigFive.conscientiousness, color: 0x764ba2 },
      { name: 'Extraversion', value: this.personalityData.bigFive.extraversion, color: 0xf093fb },
      { name: 'Agreeableness', value: this.personalityData.bigFive.agreeableness, color: 0x4facfe },
      { name: 'Neuroticism', value: this.personalityData.bigFive.neuroticism, color: 0xf5576c }
    ];
    
    traitData.forEach((trait, index) => {
      const angle = (index / traitData.length) * Math.PI * 2;
      const radius = 6;
      const size = 0.3 + (trait.value / 100) * 0.7;
      
      // Trait sphere
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhysicalMaterial({
        color: trait.color,
        emissive: trait.color,
        emissiveIntensity: 0.2,
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        Math.cos(angle) * radius,
        Math.sin(index * 0.5) * 2,
        Math.sin(angle) * radius
      );
      sphere.castShadow = true;
      sphere.userData = trait;
      
      this.scene.add(sphere);
      this.traits.push(sphere);
      
      // Add floating animation
      gsap.to(sphere.position, {
        y: sphere.position.y + 0.5,
        duration: 2 + Math.random(),
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut'
      });
      
      // Add rotation
      gsap.to(sphere.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 10 + Math.random() * 5,
        repeat: -1,
        ease: 'none'
      });
      
      // Create trait label
      this.createLabel(trait.name, sphere.position, trait.value);
    });
  }
  
  createConnections() {
    // Create energy connections between core and traits
    this.traits.forEach((trait, index) => {
      const points = [];
      const corePos = this.centralCore.position;
      const traitPos = trait.position;
      
      // Create curved path
      for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const x = corePos.x + (traitPos.x - corePos.x) * t;
        const y = corePos.y + (traitPos.y - corePos.y) * t + Math.sin(t * Math.PI) * 1;
        const z = corePos.z + (traitPos.z - corePos.z) * t;
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: trait.userData.color,
        transparent: true,
        opacity: 0.3,
        linewidth: 2
      });
      
      const line = new THREE.Line(geometry, material);
      this.scene.add(line);
      this.connections.push(line);
      
      // Animate connection opacity
      gsap.to(material, {
        opacity: 0.6,
        duration: 1 + Math.random(),
        yoyo: true,
        repeat: -1,
        ease: 'power2.inOut'
      });
    });
  }
  
  createParticleSystem() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      const radius = 15 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Color
      color.setHSL(0.6 + Math.random() * 0.4, 0.7, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Size
      sizes[i] = Math.random() * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }
  
  createLabel(text, position, value) {
    // Create HTML label element
    const labelDiv = document.createElement('div');
    labelDiv.className = 'trait-label-3d';
    labelDiv.innerHTML = `
      <div style="
        position: absolute;
        color: white;
        font-size: 12px;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(0,0,0,0.5);
        background: rgba(0,0,0,0.5);
        padding: 5px 10px;
        border-radius: 5px;
        pointer-events: none;
        transform: translate(-50%, -50%);
      ">
        ${text}: ${value}%
      </div>
    `;
    labelDiv.style.position = 'absolute';
    this.container.appendChild(labelDiv);
    
    // Update label position in animation loop
    const updatePosition = () => {
      const vector = position.clone();
      vector.project(this.camera);
      
      const x = (vector.x * 0.5 + 0.5) * this.container.clientWidth;
      const y = (-vector.y * 0.5 + 0.5) * this.container.clientHeight;
      
      labelDiv.style.left = `${x}px`;
      labelDiv.style.top = `${y - 30}px`;
    };
    
    // Store update function for animation loop
    if (!this.labelUpdaters) this.labelUpdaters = [];
    this.labelUpdaters.push(updatePosition);
  }
  
  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
      1.5, // Bloom strength
      0.4, // Bloom radius
      0.85 // Bloom threshold
    );
    this.composer.addPass(bloomPass);
  }
  
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    
    // Update controls
    this.controls.update();
    
    // Rotate particle system
    if (this.particleSystem) {
      this.particleSystem.rotation.y += 0.001;
    }
    
    // Update labels
    if (this.labelUpdaters) {
      this.labelUpdaters.forEach(update => update());
    }
    
    // Pulse connections based on personality strength
    this.connections.forEach((connection, index) => {
      const trait = this.traits[index];
      if (trait && trait.userData) {
        const intensity = trait.userData.value / 100;
        connection.material.opacity = 0.2 + Math.sin(Date.now() * 0.001 + index) * 0.3 * intensity;
      }
    });
    
    // Render scene
    this.composer.render();
  }
  
  handleResize() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      
      this.renderer.setSize(width, height);
      this.composer.setSize(width, height);
    });
  }
  
  updateVisualization(newData) {
    // Update central core color
    if (this.centralCore && newData.archetype) {
      const newColor = new THREE.Color(newData.archetype.color);
      gsap.to(this.centralCore.material.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
        duration: 1
      });
    }
    
    // Update trait nodes
    if (newData.bigFive) {
      const traitValues = [
        newData.bigFive.openness,
        newData.bigFive.conscientiousness,
        newData.bigFive.extraversion,
        newData.bigFive.agreeableness,
        newData.bigFive.neuroticism
      ];
      
      this.traits.forEach((trait, index) => {
        if (traitValues[index] !== undefined) {
          const newScale = 0.3 + (traitValues[index] / 100) * 0.7;
          gsap.to(trait.scale, {
            x: newScale,
            y: newScale,
            z: newScale,
            duration: 1,
            ease: 'power2.inOut'
          });
        }
      });
    }
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Clean up Three.js resources
    this.scene.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(material => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
    
    // Remove labels
    const labels = this.container.querySelectorAll('.trait-label-3d');
    labels.forEach(label => label.remove());
  }
  
  captureScreenshot() {
    return this.renderer.domElement.toDataURL('image/png');
  }
  
  toggleAutoRotate() {
    this.controls.autoRotate = !this.controls.autoRotate;
  }
  
  setQuality(quality) {
    switch(quality) {
      case 'low':
        this.renderer.setPixelRatio(1);
        break;
      case 'medium':
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        break;
      case 'high':
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        break;
    }
  }
}
export const personalityArchetypes = {
  'cosmic-explorer': {
    id: 'cosmic-explorer',
    name: 'The Cosmic Explorer',
    emoji: '🌌',
    color: '#4a00e0',
    gradient: 'linear-gradient(135deg, #4a00e0, #8e2de2)',
    description: 'You navigate life with boundless curiosity and wonder, always seeking to understand the deeper mysteries of existence.',
    traits: ['Visionary', 'Philosophical', 'Intuitive', 'Open-minded', 'Adventurous'],
    strengths: [
      'Exceptional at seeing the big picture',
      'Natural innovator and forward-thinker',
      'Connects abstract concepts effortlessly',
      'Inspires others with grand visions'
    ],
    challenges: [
      'May overlook practical details',
      'Can get lost in abstract thinking',
      'Difficulty with routine tasks'
    ],
    careers: ['Astrophysicist', 'Philosopher', 'Innovation Strategist', 'Futurist', 'Creative Director'],
    compatibility: ['quantum-architect', 'neural-navigator', 'creative-innovator'],
    quote: 'The universe is not only queerer than we suppose, but queerer than we can suppose.',
    mythicalCreature: 'Phoenix',
    element: 'Aether',
    powerStats: {
      creativity: 95,
      logic: 70,
      empathy: 75,
      leadership: 80,
      resilience: 85
    }
  },
  
  'quantum-architect': {
    id: 'quantum-architect',
    name: 'The Quantum Architect',
    emoji: '⚛️',
    color: '#00d4ff',
    gradient: 'linear-gradient(135deg, #00d4ff, #090979)',
    description: 'You design complex systems with precision and elegance, bridging the gap between possibility and reality.',
    traits: ['Systematic', 'Innovative', 'Analytical', 'Precise', 'Visionary'],
    strengths: [
      'Masters complex problem-solving',
      'Creates elegant solutions',
      'Balances innovation with practicality',
      'Exceptional strategic thinking'
    ],
    challenges: [
      'Perfectionism can cause delays',
      'May struggle with ambiguity',
      'Can be overly critical'
    ],
    careers: ['Systems Architect', 'Quantum Physicist', 'Algorithm Designer', 'Strategic Planner', 'UX Architect'],
    compatibility: ['cosmic-explorer', 'digital-alchemist', 'neural-navigator'],
    quote: 'In the quantum realm, all possibilities exist simultaneously until observed.',
    mythicalCreature: 'Dragon',
    element: 'Crystal',
    powerStats: {
      creativity: 85,
      logic: 95,
      empathy: 60,
      leadership: 75,
      resilience: 80
    }
  },

  'neural-navigator': {
    id: 'neural-navigator',
    name: 'The Neural Navigator',
    emoji: '🧠',
    color: '#ff006e',
    gradient: 'linear-gradient(135deg, #ff006e, #8338ec)',
    description: 'You traverse the landscapes of human consciousness with remarkable insight and emotional intelligence.',
    traits: ['Empathetic', 'Perceptive', 'Adaptive', 'Insightful', 'Collaborative'],
    strengths: [
      'Exceptional emotional intelligence',
      'Natural mediator and counselor',
      'Reads social dynamics effortlessly',
      'Builds deep, meaningful connections'
    ],
    challenges: [
      'Can absorb others\' emotions',
      'May neglect self-care',
      'Difficulty with conflict'
    ],
    careers: ['Neuroscientist', 'Therapist', 'UX Researcher', 'Team Leader', 'Behavioral Analyst'],
    compatibility: ['empathy-sage', 'harmony-weaver', 'cosmic-explorer'],
    quote: 'The mind is not a vessel to be filled, but a fire to be kindled.',
    mythicalCreature: 'Sphinx',
    element: 'Water',
    powerStats: {
      creativity: 80,
      logic: 75,
      empathy: 95,
      leadership: 85,
      resilience: 70
    }
  },

  'digital-alchemist': {
    id: 'digital-alchemist',
    name: 'The Digital Alchemist',
    emoji: '💫',
    color: '#f72585',
    gradient: 'linear-gradient(135deg, #f72585, #7209b7)',
    description: 'You transform raw data and ideas into digital gold, creating magic at the intersection of art and technology.',
    traits: ['Creative', 'Technical', 'Transformative', 'Resourceful', 'Experimental'],
    strengths: [
      'Blends creativity with technology',
      'Transforms problems into opportunities',
      'Masters multiple disciplines',
      'Creates innovative solutions'
    ],
    challenges: [
      'Can be scattered across interests',
      'Impatience with slow progress',
      'May start more than finish'
    ],
    careers: ['Creative Technologist', 'Game Designer', 'Digital Artist', 'Product Designer', 'Innovation Lab Director'],
    compatibility: ['quantum-architect', 'creative-innovator', 'chaos-dancer'],
    quote: 'Technology is magic made real through human creativity.',
    mythicalCreature: 'Shapeshifter',
    element: 'Lightning',
    powerStats: {
      creativity: 90,
      logic: 80,
      empathy: 70,
      leadership: 75,
      resilience: 85
    }
  },

  'temporal-sage': {
    id: 'temporal-sage',
    name: 'The Temporal Sage',
    emoji: '⏳',
    color: '#3a0ca3',
    gradient: 'linear-gradient(135deg, #3a0ca3, #f72585)',
    description: 'You perceive time as a fluid dimension, understanding patterns across past, present, and future with uncanny wisdom.',
    traits: ['Wise', 'Patient', 'Strategic', 'Reflective', 'Far-sighted'],
    strengths: [
      'Exceptional long-term thinking',
      'Learns from history to predict future',
      'Patient and methodical approach',
      'Deep understanding of cycles'
    ],
    challenges: [
      'May seem detached from present',
      'Can be overly cautious',
      'Difficulty with urgent decisions'
    ],
    careers: ['Historian', 'Strategic Advisor', 'Risk Analyst', 'Philosopher', 'Archivist'],
    compatibility: ['cosmic-explorer', 'pattern-weaver', 'memory-keeper'],
    quote: 'Time is an illusion; wisdom is seeing through it.',
    mythicalCreature: 'Ancient Tree',
    element: 'Time',
    powerStats: {
      creativity: 75,
      logic: 85,
      empathy: 80,
      leadership: 90,
      resilience: 95
    }
  },

  'chaos-dancer': {
    id: 'chaos-dancer',
    name: 'The Chaos Dancer',
    emoji: '🌪️',
    color: '#ff4500',
    gradient: 'linear-gradient(135deg, #ff4500, #ffa500)',
    description: 'You thrive in uncertainty and change, finding rhythm and opportunity where others see only disorder.',
    traits: ['Adaptable', 'Spontaneous', 'Resilient', 'Dynamic', 'Fearless'],
    strengths: [
      'Thrives under pressure',
      'Exceptional improvisation skills',
      'Turns chaos into opportunity',
      'Incredibly resilient'
    ],
    challenges: [
      'Struggles with routine',
      'Can create unnecessary drama',
      'Difficulty with long-term planning'
    ],
    careers: ['Emergency Response', 'Startup Founder', 'Crisis Manager', 'Performance Artist', 'War Correspondent'],
    compatibility: ['digital-alchemist', 'storm-rider', 'phoenix-soul'],
    quote: 'In chaos, there is fertility.',
    mythicalCreature: 'Kitsune',
    element: 'Fire',
    powerStats: {
      creativity: 85,
      logic: 60,
      empathy: 70,
      leadership: 80,
      resilience: 100
    }
  },

  'empathy-sage': {
    id: 'empathy-sage',
    name: 'The Empathy Sage',
    emoji: '💝',
    color: '#c77dff',
    gradient: 'linear-gradient(135deg, #c77dff, #7209b7)',
    description: 'Your emotional depth and understanding create healing spaces wherever you go, transforming pain into wisdom.',
    traits: ['Compassionate', 'Healing', 'Intuitive', 'Nurturing', 'Wise'],
    strengths: [
      'Profound emotional understanding',
      'Natural healer and counselor',
      'Creates safe spaces for others',
      'Transforms emotional energy'
    ],
    challenges: [
      'Emotional overwhelm',
      'Difficulty with boundaries',
      'Can neglect own needs'
    ],
    careers: ['Therapist', 'Social Worker', 'Hospice Worker', 'Meditation Teacher', 'Conflict Resolution Specialist'],
    compatibility: ['neural-navigator', 'harmony-weaver', 'light-bearer'],
    quote: 'The wound is the place where the Light enters you.',
    mythicalCreature: 'Unicorn',
    element: 'Spirit',
    powerStats: {
      creativity: 75,
      logic: 65,
      empathy: 100,
      leadership: 70,
      resilience: 80
    }
  },

  'pattern-weaver': {
    id: 'pattern-weaver',
    name: 'The Pattern Weaver',
    emoji: '🕸️',
    color: '#560bad',
    gradient: 'linear-gradient(135deg, #560bad, #c77dff)',
    description: 'You see the invisible threads connecting all things, weaving understanding from complexity.',
    traits: ['Analytical', 'Holistic', 'Observant', 'Connecting', 'Methodical'],
    strengths: [
      'Identifies hidden patterns',
      'Connects disparate information',
      'Systematic problem-solving',
      'Creates comprehensive solutions'
    ],
    challenges: [
      'Can overthink situations',
      'May miss emotional nuances',
      'Paralysis by analysis'
    ],
    careers: ['Data Scientist', 'Systems Analyst', 'Detective', 'Epidemiologist', 'Market Researcher'],
    compatibility: ['quantum-architect', 'temporal-sage', 'truth-seeker'],
    quote: 'Everything is connected; nothing exists in isolation.',
    mythicalCreature: 'Spider',
    element: 'Web',
    powerStats: {
      creativity: 80,
      logic: 90,
      empathy: 65,
      leadership: 70,
      resilience: 75
    }
  },

  'storm-rider': {
    id: 'storm-rider',
    name: 'The Storm Rider',
    emoji: '⚡',
    color: '#0077b6',
    gradient: 'linear-gradient(135deg, #0077b6, #0096c7)',
    description: 'You harness the power of change and transformation, riding the waves of disruption with grace and purpose.',
    traits: ['Bold', 'Transformative', 'Courageous', 'Dynamic', 'Pioneering'],
    strengths: [
      'Fearless in face of change',
      'Natural change agent',
      'Inspires transformation in others',
      'Thrives in transition'
    ],
    challenges: [
      'Can be disruptive',
      'Impatience with status quo',
      'May struggle with stability'
    ],
    careers: ['Change Management', 'Revolutionary', 'Venture Capitalist', 'Extreme Sports Athlete', 'Disaster Relief Coordinator'],
    compatibility: ['chaos-dancer', 'phoenix-soul', 'quantum-architect'],
    quote: 'The storm is not something to weather, but to dance with.',
    mythicalCreature: 'Thunderbird',
    element: 'Storm',
    powerStats: {
      creativity: 80,
      logic: 70,
      empathy: 65,
      leadership: 90,
      resilience: 95
    }
  },

  'harmony-weaver': {
    id: 'harmony-weaver',
    name: 'The Harmony Weaver',
    emoji: '🎵',
    color: '#2a9d8f',
    gradient: 'linear-gradient(135deg, #2a9d8f, #264653)',
    description: 'You create balance and beauty in all things, orchestrating life like a symphony of interconnected melodies.',
    traits: ['Balanced', 'Aesthetic', 'Diplomatic', 'Peaceful', 'Integrative'],
    strengths: [
      'Creates harmony from discord',
      'Natural mediator',
      'Aesthetic sensibility',
      'Brings people together'
    ],
    challenges: [
      'Avoids necessary conflicts',
      'Can be indecisive',
      'May suppress own needs'
    ],
    careers: ['Mediator', 'Interior Designer', 'Music Therapist', 'Diplomat', 'Community Organizer'],
    compatibility: ['empathy-sage', 'neural-navigator', 'creative-innovator'],
    quote: 'In harmony, small things grow; in discord, great things decay.',
    mythicalCreature: 'Siren',
    element: 'Sound',
    powerStats: {
      creativity: 85,
      logic: 70,
      empathy: 90,
      leadership: 75,
      resilience: 70
    }
  },

  'phoenix-soul': {
    id: 'phoenix-soul',
    name: 'The Phoenix Soul',
    emoji: '🔥',
    color: '#dc2626',
    gradient: 'linear-gradient(135deg, #dc2626, #fbbf24)',
    description: 'You embody transformation and rebirth, rising stronger from every challenge with renewed purpose and passion.',
    traits: ['Resilient', 'Transformative', 'Passionate', 'Renewed', 'Inspiring'],
    strengths: [
      'Incredible resilience',
      'Transforms adversity into strength',
      'Inspires others through example',
      'Constant self-renewal'
    ],
    challenges: [
      'Can burn too bright',
      'Difficulty with consistency',
      'May create unnecessary crises'
    ],
    careers: ['Life Coach', 'Motivational Speaker', 'Trauma Counselor', 'Entrepreneur', 'Recovery Specialist'],
    compatibility: ['storm-rider', 'chaos-dancer', 'light-bearer'],
    quote: 'What doesn\'t kill you makes you stronger, and what does kill you makes you reborn.',
    mythicalCreature: 'Phoenix',
    element: 'Rebirth',
    powerStats: {
      creativity: 85,
      logic: 70,
      empathy: 80,
      leadership: 85,
      resilience: 100
    }
  },

  'crystalline-mind': {
    id: 'crystalline-mind',
    name: 'The Crystalline Mind',
    emoji: '💎',
    color: '#06ffa5',
    gradient: 'linear-gradient(135deg, #06ffa5, #00c9ff)',
    description: 'Your thoughts are precise and multifaceted, refracting ideas into brilliant insights with clarity and precision.',
    traits: ['Precise', 'Clear', 'Multifaceted', 'Logical', 'Brilliant'],
    strengths: [
      'Crystal-clear thinking',
      'Exceptional problem decomposition',
      'Creates elegant solutions',
      'Maintains objectivity'
    ],
    challenges: [
      'Can seem cold or distant',
      'Difficulty with ambiguity',
      'May lack emotional awareness'
    ],
    careers: ['Mathematician', 'Jeweler', 'Precision Engineer', 'Chess Grandmaster', 'Theoretical Physicist'],
    compatibility: ['quantum-architect', 'pattern-weaver', 'truth-seeker'],
    quote: 'Clarity is power; precision is perfection.',
    mythicalCreature: 'Crystal Golem',
    element: 'Ice',
    powerStats: {
      creativity: 70,
      logic: 100,
      empathy: 50,
      leadership: 65,
      resilience: 75
    }
  },

  'shadow-dancer': {
    id: 'shadow-dancer',
    name: 'The Shadow Dancer',
    emoji: '🌙',
    color: '#1e293b',
    gradient: 'linear-gradient(135deg, #1e293b, #475569)',
    description: 'You navigate the hidden realms of the psyche, comfortable with darkness and skilled at transformation.',
    traits: ['Mysterious', 'Deep', 'Transformative', 'Intuitive', 'Complex'],
    strengths: [
      'Comfortable with darkness',
      'Deep psychological insight',
      'Transforms shadow into light',
      'Understands hidden motivations'
    ],
    challenges: [
      'Can be too introspective',
      'May struggle with lightness',
      'Tendency toward isolation'
    ],
    careers: ['Depth Psychologist', 'Detective', 'Horror Writer', 'Shadow Work Facilitator', 'Forensic Analyst'],
    compatibility: ['phoenix-soul', 'empathy-sage', 'truth-seeker'],
    quote: 'One does not become enlightened by imagining figures of light, but by making the darkness conscious.',
    mythicalCreature: 'Shadow Wolf',
    element: 'Shadow',
    powerStats: {
      creativity: 85,
      logic: 75,
      empathy: 80,
      leadership: 60,
      resilience: 85
    }
  },

  'light-bearer': {
    id: 'light-bearer',
    name: 'The Light Bearer',
    emoji: '☀️',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    description: 'You illuminate the path for others, bringing hope, clarity, and inspiration wherever you go.',
    traits: ['Inspiring', 'Optimistic', 'Radiant', 'Uplifting', 'Generous'],
    strengths: [
      'Natural inspirator',
      'Brings out the best in others',
      'Maintains positivity',
      'Creates hope from despair'
    ],
    challenges: [
      'May ignore negative realities',
      'Can burn out from giving',
      'Difficulty acknowledging darkness'
    ],
    careers: ['Teacher', 'Humanitarian', 'Inspirational Speaker', 'Charity Director', 'Youth Mentor'],
    compatibility: ['phoenix-soul', 'empathy-sage', 'harmony-weaver'],
    quote: 'Be the light you wish to see in the world.',
    mythicalCreature: 'Angel',
    element: 'Light',
    powerStats: {
      creativity: 80,
      logic: 70,
      empathy: 95,
      leadership: 90,
      resilience: 75
    }
  },

  'memory-keeper': {
    id: 'memory-keeper',
    name: 'The Memory Keeper',
    emoji: '📚',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    description: 'You are the guardian of stories and wisdom, preserving the past to illuminate the future.',
    traits: ['Nostalgic', 'Wise', 'Preserving', 'Storytelling', 'Traditional'],
    strengths: [
      'Exceptional memory',
      'Preserves important knowledge',
      'Connects past to present',
      'Natural storyteller'
    ],
    challenges: [
      'Can live in the past',
      'Resistance to change',
      'May idealize history'
    ],
    careers: ['Librarian', 'Historian', 'Museum Curator', 'Genealogist', 'Documentary Filmmaker'],
    compatibility: ['temporal-sage', 'pattern-weaver', 'truth-seeker'],
    quote: 'Those who cannot remember the past are condemned to repeat it.',
    mythicalCreature: 'Owl',
    element: 'Memory',
    powerStats: {
      creativity: 75,
      logic: 80,
      empathy: 85,
      leadership: 70,
      resilience: 80
    }
  },

  'dream-architect': {
    id: 'dream-architect',
    name: 'The Dream Architect',
    emoji: '💭',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    description: 'You build bridges between imagination and reality, crafting visions that inspire and transform.',
    traits: ['Imaginative', 'Visionary', 'Creative', 'Inspiring', 'Otherworldly'],
    strengths: [
      'Limitless imagination',
      'Creates compelling visions',
      'Inspires others to dream',
      'Manifests ideas into reality'
    ],
    challenges: [
      'Can lose touch with reality',
      'Difficulty with practical matters',
      'May disappoint with execution'
    ],
    careers: ['Film Director', 'Concept Artist', 'Fiction Writer', 'Theme Park Designer', 'Virtual Reality Developer'],
    compatibility: ['digital-alchemist', 'cosmic-explorer', 'creative-innovator'],
    quote: 'Dreams are the seeds of reality waiting to bloom.',
    mythicalCreature: 'Pegasus',
    element: 'Dreams',
    powerStats: {
      creativity: 100,
      logic: 60,
      empathy: 75,
      leadership: 80,
      resilience: 70
    }
  },

  'truth-seeker': {
    id: 'truth-seeker',
    name: 'The Truth Seeker',
    emoji: '🔍',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    description: 'You pursue truth with relentless determination, uncovering reality beneath layers of illusion.',
    traits: ['Investigative', 'Honest', 'Persistent', 'Analytical', 'Courageous'],
    strengths: [
      'Uncovers hidden truths',
      'Exceptional critical thinking',
      'Cannot be deceived easily',
      'Stands for justice'
    ],
    challenges: [
      'Can be too blunt',
      'May struggle with white lies',
      'Difficulty with ambiguity'
    ],
    careers: ['Investigative Journalist', 'Research Scientist', 'Auditor', 'Private Investigator', 'Fact Checker'],
    compatibility: ['pattern-weaver', 'crystalline-mind', 'shadow-dancer'],
    quote: 'The truth will set you free, but first it will make you uncomfortable.',
    mythicalCreature: 'Basilisk',
    element: 'Truth',
    powerStats: {
      creativity: 70,
      logic: 95,
      empathy: 60,
      leadership: 75,
      resilience: 85
    }
  },

  'nature-whisperer': {
    id: 'nature-whisperer',
    name: 'The Nature Whisperer',
    emoji: '🌿',
    color: '#065f46',
    gradient: 'linear-gradient(135deg, #065f46, #047857)',
    description: 'You speak the ancient language of the earth, understanding the wisdom of natural cycles and connections.',
    traits: ['Grounded', 'Intuitive', 'Patient', 'Nurturing', 'Connected'],
    strengths: [
      'Deep connection to nature',
      'Understands natural cycles',
      'Grounding presence',
      'Ecological wisdom'
    ],
    challenges: [
      'Difficulty with technology',
      'Can be too passive',
      'Struggles in urban environments'
    ],
    careers: ['Ecologist', 'Park Ranger', 'Herbalist', 'Environmental Activist', 'Permaculture Designer'],
    compatibility: ['harmony-weaver', 'temporal-sage', 'empathy-sage'],
    quote: 'In every walk with nature, one receives far more than they seek.',
    mythicalCreature: 'Dryad',
    element: 'Earth',
    powerStats: {
      creativity: 75,
      logic: 70,
      empathy: 90,
      leadership: 65,
      resilience: 85
    }
  },

  'code-shaman': {
    id: 'code-shaman',
    name: 'The Code Shaman',
    emoji: '🔮',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    description: 'You bridge the digital and spiritual realms, seeing code as a form of modern magic and creation.',
    traits: ['Technical', 'Spiritual', 'Creative', 'Intuitive', 'Bridging'],
    strengths: [
      'Merges technology with wisdom',
      'Creates elegant code solutions',
      'Sees patterns in complexity',
      'Digital problem solver'
    ],
    challenges: [
      'Can overcomplicate solutions',
      'Struggles with documentation',
      'May seem eccentric'
    ],
    careers: ['Software Architect', 'AI Researcher', 'Blockchain Developer', 'Digital Artist', 'Tech Philosopher'],
    compatibility: ['digital-alchemist', 'quantum-architect', 'pattern-weaver'],
    quote: 'Code is poetry written for machines to perform and humans to understand.',
    mythicalCreature: 'Cyber Dragon',
    element: 'Data',
    powerStats: {
      creativity: 90,
      logic: 85,
      empathy: 65,
      leadership: 70,
      resilience: 80
    }
  },

  'creative-innovator': {
    id: 'creative-innovator',
    name: 'The Creative Innovator',
    emoji: '🎨',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
    description: 'Original archetype - You blend artistic vision with innovative thinking to create groundbreaking solutions.',
    traits: ['Creative', 'Innovative', 'Artistic', 'Original', 'Expressive'],
    strengths: [
      'Exceptional creative thinking',
      'Innovative problem-solving',
      'Artistic expression',
      'Original perspectives'
    ],
    challenges: [
      'Can be scattered',
      'Difficulty with routine',
      'May lack follow-through'
    ],
    careers: ['Artist', 'Designer', 'Inventor', 'Creative Director', 'Innovation Consultant'],
    compatibility: ['digital-alchemist', 'dream-architect', 'cosmic-explorer'],
    quote: 'Creativity is intelligence having fun.',
    mythicalCreature: 'Muse',
    element: 'Color',
    powerStats: {
      creativity: 100,
      logic: 65,
      empathy: 75,
      leadership: 70,
      resilience: 75
    }
  },

  'detail-analyst': {
    id: 'detail-analyst',
    name: 'The Detail-Oriented Analyst',
    emoji: '🔬',
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    description: 'Original archetype - Your meticulous attention to detail and analytical prowess uncover insights others miss.',
    traits: ['Meticulous', 'Analytical', 'Thorough', 'Precise', 'Methodical'],
    strengths: [
      'Exceptional attention to detail',
      'Thorough analysis',
      'Quality assurance',
      'Pattern recognition'
    ],
    challenges: [
      'Can be perfectionistic',
      'May miss big picture',
      'Analysis paralysis'
    ],
    careers: ['Quality Analyst', 'Researcher', 'Accountant', 'Editor', 'Forensic Scientist'],
    compatibility: ['pattern-weaver', 'crystalline-mind', 'truth-seeker'],
    quote: 'The devil is in the details, but so is salvation.',
    mythicalCreature: 'Hawk',
    element: 'Focus',
    powerStats: {
      creativity: 60,
      logic: 95,
      empathy: 65,
      leadership: 60,
      resilience: 75
    }
  }
};

export function calculateArchetype(scores) {
  const {
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    neuroticism,
    adhdScore,
    autismScore
  } = scores;
  
  let bestMatch = null;
  let highestScore = 0;
  
  for (const [id, archetype] of Object.entries(personalityArchetypes)) {
    let score = 0;
    
    // Complex matching algorithm based on trait combinations
    if (id === 'cosmic-explorer') {
      score = (openness * 2 + extraversion + (100 - neuroticism)) / 4;
      if (adhdScore > 60) score += 10;
    } else if (id === 'quantum-architect') {
      score = (conscientiousness * 2 + openness + (100 - neuroticism)) / 4;
      if (autismScore > 60) score += 15;
    } else if (id === 'neural-navigator') {
      score = (agreeableness * 2 + openness + extraversion) / 4;
      if (neuroticism > 50 && neuroticism < 70) score += 10;
    } else if (id === 'digital-alchemist') {
      score = (openness * 1.5 + conscientiousness + extraversion * 0.5) / 3;
      if (adhdScore > 50) score += 10;
    } else if (id === 'temporal-sage') {
      score = (conscientiousness * 1.5 + (100 - neuroticism) + agreeableness * 0.5) / 3;
      if (autismScore > 50) score += 5;
    } else if (id === 'chaos-dancer') {
      score = (extraversion * 1.5 + openness + neuroticism * 0.5) / 3;
      if (adhdScore > 70) score += 20;
    } else if (id === 'empathy-sage') {
      score = (agreeableness * 2.5 + extraversion * 0.5) / 3;
      if (neuroticism > 60) score += 5;
    } else if (id === 'pattern-weaver') {
      score = (conscientiousness * 1.5 + openness + (100 - extraversion) * 0.5) / 3;
      if (autismScore > 70) score += 20;
    } else if (id === 'storm-rider') {
      score = (extraversion * 1.5 + openness + (100 - agreeableness) * 0.5) / 3;
      if (adhdScore > 60) score += 10;
    } else if (id === 'harmony-weaver') {
      score = (agreeableness * 2 + conscientiousness + (100 - neuroticism) * 0.5) / 3.5;
    } else if (id === 'phoenix-soul') {
      score = ((100 - neuroticism) * 1.5 + openness + extraversion) / 3.5;
      if (neuroticism > 70) score += 15; // Paradoxically high for those who've overcome
    } else if (id === 'crystalline-mind') {
      score = (conscientiousness * 2 + (100 - neuroticism) + (100 - extraversion) * 0.5) / 3.5;
      if (autismScore > 65) score += 15;
    } else if (id === 'shadow-dancer') {
      score = (openness + neuroticism + (100 - extraversion)) / 3;
      if (neuroticism > 65) score += 10;
    } else if (id === 'light-bearer') {
      score = (agreeableness * 1.5 + extraversion + (100 - neuroticism)) / 3.5;
    } else if (id === 'memory-keeper') {
      score = (conscientiousness * 1.5 + (100 - extraversion) + agreeableness * 0.5) / 3;
      if (autismScore > 55) score += 10;
    } else if (id === 'dream-architect') {
      score = (openness * 2.5 + extraversion * 0.5) / 3;
      if (adhdScore > 55) score += 10;
    } else if (id === 'truth-seeker') {
      score = (conscientiousness + openness + (100 - agreeableness) * 0.5) / 2.5;
    } else if (id === 'nature-whisperer') {
      score = (agreeableness + openness + (100 - extraversion) * 0.5) / 2.5;
    } else if (id === 'code-shaman') {
      score = (openness + conscientiousness + (100 - extraversion) * 0.5) / 2.5;
      if (autismScore > 60 || adhdScore > 60) score += 15;
    } else if (id === 'creative-innovator') {
      score = (openness * 2 + extraversion * 0.5 + (100 - conscientiousness) * 0.3) / 2.8;
      if (adhdScore > 50) score += 10;
    } else if (id === 'detail-analyst') {
      score = (conscientiousness * 2 + (100 - openness) * 0.3 + (100 - extraversion) * 0.5) / 2.8;
      if (autismScore > 60) score += 15;
    }
    
    // Add randomness for variety (small factor)
    score += Math.random() * 5;
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = id;
    }
  }
  
  return personalityArchetypes[bestMatch];
}

export function getCompatibleArchetypes(archetypeId) {
  const archetype = personalityArchetypes[archetypeId];
  if (!archetype) return [];
  
  return archetype.compatibility.map(id => personalityArchetypes[id]).filter(Boolean);
}

export function getArchetypesByElement(element) {
  return Object.values(personalityArchetypes).filter(a => a.element === element);
}

export function getArchetypesByTrait(trait) {
  return Object.values(personalityArchetypes).filter(a => 
    a.traits.some(t => t.toLowerCase().includes(trait.toLowerCase()))
  );
}
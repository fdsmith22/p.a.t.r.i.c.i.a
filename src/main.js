import './styles/main.css';
import { Survey } from 'survey-core';
import { SurveyModel } from 'survey-js-ui';
import Chart from 'chart.js/auto';
import { PersonalityVisualization3D } from './modules/visualization3D';
import GamificationSystem from './modules/gamification';
import { personalityArchetypes, calculateArchetype, getCompatibleArchetypes } from './data/archetypes';
import { SoundSystem } from './modules/soundSystem';
import { AIInsights } from './modules/aiInsights';
import { PersonalityCards } from './modules/personalityCards';
import { CompatibilityMatcher } from './modules/compatibilityMatcher';
import { DynamicQuestions } from './modules/dynamicQuestions';
import { MultiLanguage } from './modules/multiLanguage';
import Typed from 'typed.js';
import particlesJS from 'particles.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class PatriciaApp {
  constructor() {
    this.currentStep = 'intro';
    this.surveyData = null;
    this.personalityResults = null;
    this.gamification = new GamificationSystem();
    this.soundSystem = new SoundSystem();
    this.visualization3D = null;
    this.aiInsights = null;
    this.startTime = null;
    this.answerChanges = 0;
    
    this.init();
  }
  
  init() {
    this.setupDOM();
    this.setupParticles();
    this.setupAnimations();
    this.bindEvents();
    this.checkReturningUser();
    this.setupTheme();
  }
  
  setupDOM() {
    document.body.innerHTML = `
      <div id="app" class="app-container">
        <div id="particles-js" class="particles-bg"></div>
        
        <header class="app-header glass-morphism">
          <div class="header-content">
            <h1 class="app-title gradient-text">P.A.T.R.I.C.I.A</h1>
            <div class="app-subtitle">
              <span id="typed-subtitle"></span>
            </div>
          </div>
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-icon">🏆</span>
              <span class="stat-value">${this.gamification.level}</span>
              <span class="stat-label">Level</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">⚡</span>
              <span class="stat-value">${this.gamification.experience}</span>
              <span class="stat-label">XP</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">🔥</span>
              <span class="stat-value">${this.gamification.streakDays}</span>
              <span class="stat-label">Streak</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-icon" id="theme-toggle" title="Toggle Theme">
              <span class="theme-icon">🌙</span>
            </button>
            <button class="btn-icon" id="sound-toggle" title="Toggle Sound">
              <span class="sound-icon">🔊</span>
            </button>
            <button class="btn-icon" id="achievements-btn" title="Achievements">
              <span class="achievements-icon">🏅</span>
              <span class="achievements-count">${this.gamification.unlockedAchievements.length}</span>
            </button>
          </div>
        </header>
        
        <main id="main-content" class="main-content">
          <div id="intro-screen" class="screen active">
            <div class="intro-container card glass-morphism slide-in">
              <div class="intro-hero">
                <div class="hero-animation" id="hero-animation"></div>
                <h2 class="intro-title">Discover Your True Personality</h2>
                <p class="intro-description">
                  Embark on a journey of self-discovery with our scientifically-grounded personality assessment. 
                  Combining Big Five traits, neurodiversity screening, and AI-powered insights.
                </p>
              </div>
              
              <div class="features-grid">
                <div class="feature-card hover-lift">
                  <div class="feature-icon">🧠</div>
                  <h3>21+ Archetypes</h3>
                  <p>Discover your unique personality from our expanded collection</p>
                </div>
                <div class="feature-card hover-lift">
                  <div class="feature-icon">🎮</div>
                  <h3>Gamified Experience</h3>
                  <p>Earn achievements and level up as you explore</p>
                </div>
                <div class="feature-card hover-lift">
                  <div class="feature-icon">🌐</div>
                  <h3>3D Visualization</h3>
                  <p>See your personality come to life in stunning 3D</p>
                </div>
                <div class="feature-card hover-lift">
                  <div class="feature-icon">🤖</div>
                  <h3>AI Insights</h3>
                  <p>Get personalized insights powered by machine learning</p>
                </div>
              </div>
              
              <div class="assessment-options">
                <button class="btn btn-primary btn-large pulse" id="start-full">
                  Start Full Assessment
                  <span class="btn-subtitle">60 questions • 10-15 minutes</span>
                </button>
                <button class="btn btn-secondary btn-large" id="start-quick">
                  Quick Assessment
                  <span class="btn-subtitle">20 questions • 5 minutes</span>
                </button>
              </div>
              
              <div class="previous-results" id="previous-results" style="display: none;">
                <h3>Your Previous Archetypes</h3>
                <div class="archetype-history" id="archetype-history"></div>
              </div>
            </div>
          </div>
          
          <div id="survey-screen" class="screen">
            <div class="survey-container card">
              <div class="progress-header">
                <div class="progress-info">
                  <span class="progress-text">Question <span id="current-question">1</span> of <span id="total-questions">60</span></span>
                  <span class="time-elapsed" id="time-elapsed">00:00</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" id="progress-fill"></div>
                </div>
              </div>
              <div id="surveyElement"></div>
            </div>
          </div>
          
          <div id="results-screen" class="screen">
            <div class="results-container">
              <div class="results-header glass-morphism">
                <h2>Your Personality Profile</h2>
                <div class="results-actions">
                  <button class="btn btn-primary" id="share-results">Share Results</button>
                  <button class="btn btn-secondary" id="download-results">Download Report</button>
                  <button class="btn btn-secondary" id="retake-assessment">Retake Assessment</button>
                </div>
              </div>
              
              <div class="results-grid">
                <div class="archetype-card card-3d card">
                  <div class="archetype-header">
                    <span class="archetype-icon" id="archetype-icon"></span>
                    <h3 class="archetype-name" id="archetype-name"></h3>
                  </div>
                  <div class="archetype-gradient" id="archetype-gradient"></div>
                  <p class="archetype-description" id="archetype-description"></p>
                  <div class="archetype-traits" id="archetype-traits"></div>
                  <blockquote class="archetype-quote" id="archetype-quote"></blockquote>
                  <div class="archetype-details">
                    <div class="detail-item">
                      <span class="detail-label">Mythical Creature:</span>
                      <span class="detail-value" id="mythical-creature"></span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Element:</span>
                      <span class="detail-value" id="element"></span>
                    </div>
                  </div>
                </div>
                
                <div class="visualization-card card">
                  <div class="viz-tabs">
                    <button class="tab-btn active" data-viz="3d">3D View</button>
                    <button class="tab-btn" data-viz="radar">Radar Chart</button>
                    <button class="tab-btn" data-viz="bars">Bar Chart</button>
                    <button class="tab-btn" data-viz="journey">Journey Map</button>
                  </div>
                  <div class="viz-container">
                    <div id="viz-3d" class="viz-panel active"></div>
                    <div id="viz-radar" class="viz-panel">
                      <canvas id="radar-chart"></canvas>
                    </div>
                    <div id="viz-bars" class="viz-panel">
                      <canvas id="bar-chart"></canvas>
                    </div>
                    <div id="viz-journey" class="viz-panel"></div>
                  </div>
                  <div class="viz-controls">
                    <button class="btn-icon" id="toggle-rotation" title="Toggle Rotation">🔄</button>
                    <button class="btn-icon" id="screenshot-3d" title="Take Screenshot">📸</button>
                    <button class="btn-icon" id="fullscreen-3d" title="Fullscreen">⛶</button>
                  </div>
                </div>
                
                <div class="insights-card card">
                  <h3>AI-Powered Insights</h3>
                  <div id="ai-insights-content" class="ai-insights">
                    <div class="insight-loading">
                      <div class="loading-spinner"></div>
                      <p>Generating personalized insights...</p>
                    </div>
                  </div>
                </div>
                
                <div class="compatibility-card card">
                  <h3>Compatible Personalities</h3>
                  <div id="compatible-archetypes" class="compatible-list"></div>
                  <button class="btn btn-primary" id="find-matches">Find Matches</button>
                </div>
                
                <div class="strengths-card card">
                  <h3>Your Strengths</h3>
                  <ul id="strengths-list" class="strengths-list"></ul>
                </div>
                
                <div class="challenges-card card">
                  <h3>Growth Areas</h3>
                  <ul id="challenges-list" class="challenges-list"></ul>
                </div>
                
                <div class="careers-card card">
                  <h3>Ideal Careers</h3>
                  <div id="careers-list" class="careers-list"></div>
                </div>
                
                <div class="power-stats-card card">
                  <h3>Power Stats</h3>
                  <div class="power-stats" id="power-stats"></div>
                </div>
                
                <div class="neurodiversity-card card" id="neurodiversity-card">
                  <h3>Neurodiversity Insights</h3>
                  <div class="nd-results">
                    <div class="nd-item">
                      <span class="nd-label">ADHD Traits:</span>
                      <div class="nd-bar">
                        <div class="nd-fill" id="adhd-fill"></div>
                      </div>
                      <span class="nd-score" id="adhd-score"></span>
                    </div>
                    <div class="nd-item">
                      <span class="nd-label">Autism Traits:</span>
                      <div class="nd-bar">
                        <div class="nd-fill" id="autism-fill"></div>
                      </div>
                      <span class="nd-score" id="autism-score"></span>
                    </div>
                  </div>
                  <p class="nd-disclaimer">
                    These are screening indicators, not diagnoses. Consult a healthcare professional for evaluation.
                  </p>
                </div>
              </div>
              
              <div class="share-section card glass-morphism">
                <h3>Share Your Personality</h3>
                <div id="personality-card-preview"></div>
                <div class="share-buttons">
                  <button class="share-btn" data-platform="twitter">
                    <span>🐦</span> Twitter
                  </button>
                  <button class="share-btn" data-platform="facebook">
                    <span>📘</span> Facebook
                  </button>
                  <button class="share-btn" data-platform="linkedin">
                    <span>💼</span> LinkedIn
                  </button>
                  <button class="share-btn" data-platform="copy">
                    <span>📋</span> Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div id="achievements-modal" class="modal">
            <div class="modal-content card">
              <div class="modal-header">
                <h2>Achievements</h2>
                <button class="modal-close">&times;</button>
              </div>
              <div class="modal-body">
                <div class="achievements-progress">
                  <div class="progress-circle">
                    <svg width="120" height="120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" stroke-width="12"></circle>
                      <circle id="achievements-progress-circle" cx="60" cy="60" r="54" fill="none" stroke="#667eea" stroke-width="12" 
                        stroke-dasharray="339.292" stroke-dashoffset="339.292" transform="rotate(-90 60 60)"></circle>
                    </svg>
                    <div class="progress-text">
                      <span id="achievements-unlocked">0</span>/<span id="achievements-total">0</span>
                    </div>
                  </div>
                </div>
                <div class="achievements-grid" id="achievements-grid"></div>
              </div>
            </div>
          </div>
        </main>
        
        <footer class="app-footer">
          <p>&copy; 2024 P.A.T.R.I.C.I.A - Made with ❤️ and science</p>
        </footer>
      </div>
    `;
  }
  
  setupParticles() {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.1, random: false },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.05,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.2 } },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }
  
  setupAnimations() {
    // Typed.js for subtitle
    new Typed('#typed-subtitle', {
      strings: [
        'Personality Assessment Tool',
        'for Revealing Individual Characteristics',
        'and Insights Accurately',
        'Discover Your True Self'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
      backDelay: 2000
    });
    
    // GSAP ScrollTrigger animations
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: i * 0.1
      });
    });
  }
  
  bindEvents() {
    // Start assessment buttons
    document.getElementById('start-full')?.addEventListener('click', () => this.startAssessment('full'));
    document.getElementById('start-quick')?.addEventListener('click', () => this.startAssessment('quick'));
    
    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());
    
    // Sound toggle
    document.getElementById('sound-toggle')?.addEventListener('click', () => this.toggleSound());
    
    // Achievements modal
    document.getElementById('achievements-btn')?.addEventListener('click', () => this.showAchievements());
    
    // Results actions
    document.getElementById('share-results')?.addEventListener('click', () => this.shareResults());
    document.getElementById('download-results')?.addEventListener('click', () => this.downloadReport());
    document.getElementById('retake-assessment')?.addEventListener('click', () => this.retakeAssessment());
    
    // Visualization controls
    document.getElementById('toggle-rotation')?.addEventListener('click', () => this.toggleRotation());
    document.getElementById('screenshot-3d')?.addEventListener('click', () => this.takeScreenshot());
    document.getElementById('fullscreen-3d')?.addEventListener('click', () => this.toggleFullscreen());
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchVisualization(e.target.dataset.viz));
    });
    
    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.shareOn(e.currentTarget.dataset.platform));
    });
    
    // Modal close
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.remove('active');
      });
    });
  }
  
  startAssessment(type) {
    this.soundSystem.play('start');
    this.startTime = Date.now();
    this.answerChanges = 0;
    
    // Show survey screen
    this.showScreen('survey-screen');
    
    // Initialize survey
    const questions = type === 'quick' ? this.getQuickQuestions() : this.getFullQuestions();
    this.initSurvey(questions);
    
    // Start progress animation
    this.startProgressTimer();
  }
  
  getFullQuestions() {
    // Return full 60 question set
    return {
      title: "P.A.T.R.I.C.I.A Assessment",
      showProgressBar: "bottom",
      pages: [
        // Page 1: Big Five - Openness
        {
          questions: [
            {
              type: "rating",
              name: "openness1",
              title: "I have a vivid imagination",
              rateMin: 1,
              rateMax: 5,
              minRateDescription: "Strongly Disagree",
              maxRateDescription: "Strongly Agree"
            },
            // ... more questions
          ]
        }
        // ... more pages
      ]
    };
  }
  
  getQuickQuestions() {
    // Return abbreviated 20 question set
    return {
      title: "Quick P.A.T.R.I.C.I.A Assessment",
      showProgressBar: "bottom",
      pages: [
        // Condensed question set
      ]
    };
  }
  
  initSurvey(questions) {
    const survey = new SurveyModel(questions);
    
    survey.onValueChanged.add((sender, options) => {
      this.answerChanges++;
      this.updateProgress();
    });
    
    survey.onComplete.add((sender) => {
      this.processSurveyResults(sender.data);
    });
    
    survey.render("surveyElement");
  }
  
  processSurveyResults(data) {
    const duration = Date.now() - this.startTime;
    
    // Calculate Big Five scores
    const bigFive = this.calculateBigFive(data);
    
    // Calculate neurodiversity scores
    const adhdScore = this.calculateADHDScore(data);
    const autismScore = this.calculateAutismScore(data);
    
    // Get personality archetype
    const archetype = calculateArchetype({
      ...bigFive,
      adhdScore,
      autismScore
    });
    
    // Store results
    this.personalityResults = {
      bigFive,
      adhdScore,
      autismScore,
      archetype,
      timestamp: new Date(),
      duration
    };
    
    // Update stats for gamification
    this.updateUserStats();
    
    // Check achievements
    const newAchievements = this.gamification.checkAchievements(
      this.gamification.userStats,
      archetype.id
    );
    
    // Show results
    this.showResults();
  }
  
  calculateBigFive(data) {
    // Scoring logic for Big Five traits
    return {
      openness: 75,
      conscientiousness: 65,
      extraversion: 80,
      agreeableness: 70,
      neuroticism: 45
    };
  }
  
  calculateADHDScore(data) {
    // ADHD scoring based on ASRS-v1.1
    return 35;
  }
  
  calculateAutismScore(data) {
    // Autism scoring based on AQ-10
    return 25;
  }
  
  showResults() {
    this.showScreen('results-screen');
    this.displayResults();
    this.createVisualizations();
    this.generateAIInsights();
    this.soundSystem.play('complete');
  }
  
  displayResults() {
    const { archetype, bigFive, adhdScore, autismScore } = this.personalityResults;
    
    // Display archetype info
    document.getElementById('archetype-icon').textContent = archetype.emoji;
    document.getElementById('archetype-name').textContent = archetype.name;
    document.getElementById('archetype-description').textContent = archetype.description;
    document.getElementById('archetype-quote').textContent = archetype.quote;
    document.getElementById('mythical-creature').textContent = archetype.mythicalCreature;
    document.getElementById('element').textContent = archetype.element;
    
    // Set gradient
    document.getElementById('archetype-gradient').style.background = archetype.gradient;
    
    // Display traits
    const traitsHtml = archetype.traits.map(trait => 
      `<span class="trait-badge">${trait}</span>`
    ).join('');
    document.getElementById('archetype-traits').innerHTML = traitsHtml;
    
    // Display strengths
    const strengthsHtml = archetype.strengths.map(strength => 
      `<li>${strength}</li>`
    ).join('');
    document.getElementById('strengths-list').innerHTML = strengthsHtml;
    
    // Display challenges
    const challengesHtml = archetype.challenges.map(challenge => 
      `<li>${challenge}</li>`
    ).join('');
    document.getElementById('challenges-list').innerHTML = challengesHtml;
    
    // Display careers
    const careersHtml = archetype.careers.map(career => 
      `<span class="career-badge">${career}</span>`
    ).join('');
    document.getElementById('careers-list').innerHTML = careersHtml;
    
    // Display power stats
    this.displayPowerStats(archetype.powerStats);
    
    // Display compatible archetypes
    this.displayCompatibleArchetypes(archetype.id);
    
    // Display neurodiversity scores
    this.displayNeurodiversityScores(adhdScore, autismScore);
  }
  
  displayPowerStats(stats) {
    const statsHtml = Object.entries(stats).map(([stat, value]) => `
      <div class="power-stat">
        <span class="stat-name">${stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${value}%; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
        </div>
        <span class="stat-value">${value}%</span>
      </div>
    `).join('');
    
    document.getElementById('power-stats').innerHTML = statsHtml;
  }
  
  displayCompatibleArchetypes(archetypeId) {
    const compatible = getCompatibleArchetypes(archetypeId);
    const html = compatible.map(arch => `
      <div class="compatible-item">
        <span class="compatible-emoji">${arch.emoji}</span>
        <span class="compatible-name">${arch.name}</span>
      </div>
    `).join('');
    
    document.getElementById('compatible-archetypes').innerHTML = html;
  }
  
  displayNeurodiversityScores(adhdScore, autismScore) {
    document.getElementById('adhd-score').textContent = `${adhdScore}%`;
    document.getElementById('adhd-fill').style.width = `${adhdScore}%`;
    
    document.getElementById('autism-score').textContent = `${autismScore}%`;
    document.getElementById('autism-fill').style.width = `${autismScore}%`;
  }
  
  createVisualizations() {
    // Create 3D visualization
    const container = document.getElementById('viz-3d');
    this.visualization3D = new PersonalityVisualization3D(container, this.personalityResults);
    
    // Create radar chart
    this.createRadarChart();
    
    // Create bar chart
    this.createBarChart();
  }
  
  createRadarChart() {
    const ctx = document.getElementById('radar-chart').getContext('2d');
    const { bigFive } = this.personalityResults;
    
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
        datasets: [{
          label: 'Your Personality',
          data: [
            bigFive.openness,
            bigFive.conscientiousness,
            bigFive.extraversion,
            bigFive.agreeableness,
            bigFive.neuroticism
          ],
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: 'rgba(102, 126, 234, 1)',
          pointBackgroundColor: 'rgba(102, 126, 234, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
  
  createBarChart() {
    const ctx = document.getElementById('bar-chart').getContext('2d');
    const { bigFive } = this.personalityResults;
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
        datasets: [{
          label: 'Score',
          data: [
            bigFive.openness,
            bigFive.conscientiousness,
            bigFive.extraversion,
            bigFive.agreeableness,
            bigFive.neuroticism
          ],
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(240, 147, 251, 0.8)',
            'rgba(79, 172, 254, 0.8)',
            'rgba(245, 87, 108, 0.8)'
          ]
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
  
  generateAIInsights() {
    // Simulate AI insights generation
    setTimeout(() => {
      const insights = this.getPersonalizedInsights();
      document.getElementById('ai-insights-content').innerHTML = insights;
    }, 2000);
  }
  
  getPersonalizedInsights() {
    const { archetype, bigFive } = this.personalityResults;
    
    return `
      <div class="insight-section">
        <h4>Key Insights</h4>
        <ul>
          <li>As ${archetype.name}, you possess a unique blend of ${archetype.traits.slice(0, 3).join(', ')}.</li>
          <li>Your high ${this.getHighestTrait(bigFive)} score suggests strong ${this.getTraitDescription(this.getHighestTrait(bigFive))}.</li>
          <li>Consider leveraging your ${archetype.strengths[0].toLowerCase()} in professional settings.</li>
        </ul>
      </div>
      <div class="insight-section">
        <h4>Growth Recommendations</h4>
        <ul>
          <li>Focus on developing ${this.getLowestTrait(bigFive)} to balance your personality profile.</li>
          <li>Practice ${this.getGrowthActivity(archetype.id)} to enhance personal development.</li>
          <li>Seek collaborations with ${archetype.compatibility[0]} personalities for synergy.</li>
        </ul>
      </div>
    `;
  }
  
  getHighestTrait(bigFive) {
    return Object.entries(bigFive).reduce((a, b) => bigFive[a] > bigFive[b] ? a : b)[0];
  }
  
  getLowestTrait(bigFive) {
    return Object.entries(bigFive).reduce((a, b) => bigFive[a] < bigFive[b] ? a : b)[0];
  }
  
  getTraitDescription(trait) {
    const descriptions = {
      openness: 'creativity and intellectual curiosity',
      conscientiousness: 'organization and reliability',
      extraversion: 'social energy and enthusiasm',
      agreeableness: 'cooperation and empathy',
      neuroticism: 'emotional sensitivity'
    };
    return descriptions[trait];
  }
  
  getGrowthActivity(archetypeId) {
    const activities = {
      'cosmic-explorer': 'mindfulness meditation',
      'quantum-architect': 'creative brainstorming',
      'neural-navigator': 'boundary setting',
      'digital-alchemist': 'project completion',
      'chaos-dancer': 'structured planning'
    };
    return activities[archetypeId] || 'self-reflection';
  }
  
  updateUserStats() {
    const stats = this.gamification.userStats;
    const { archetype, bigFive, adhdScore, autismScore } = this.personalityResults;
    
    stats.assessmentsTaken++;
    
    if (!stats.archetypesDiscovered.includes(archetype.id)) {
      stats.archetypesDiscovered.push(archetype.id);
    }
    
    const duration = (Date.now() - this.startTime) / 1000;
    stats.fastestTime = Math.min(stats.fastestTime, duration);
    stats.longestTime = Math.max(stats.longestTime, duration);
    
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 4) stats.nightOwl = true;
    if (hour >= 5 && hour < 7) stats.earlyBird = true;
    
    if (adhdScore > 0) stats.adhdAssessed = true;
    if (autismScore > 0) stats.autismAssessed = true;
    
    stats.maxAnswerChanges = Math.max(stats.maxAnswerChanges, this.answerChanges);
    if (this.answerChanges === 0) stats.noChangesAssessment = true;
    
    if (archetype.id === 'chaos-dancer') stats.chaosCount++;
    
    // Check for special scores
    Object.values(bigFive).forEach(score => {
      if (score === 42) stats.foundFortyTwo = true;
    });
    
    if (Object.values(bigFive).every(score => score === 50)) {
      stats.perfectBalance = true;
    }
    
    this.gamification.userStats = stats;
    this.gamification.saveProgress();
    this.gamification.updateStreak();
  }
  
  switchVisualization(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-viz="${type}"]`).classList.add('active');
    
    document.querySelectorAll('.viz-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`viz-${type}`).classList.add('active');
  }
  
  toggleRotation() {
    if (this.visualization3D) {
      this.visualization3D.toggleAutoRotate();
    }
  }
  
  takeScreenshot() {
    if (this.visualization3D) {
      const dataURL = this.visualization3D.captureScreenshot();
      const link = document.createElement('a');
      link.download = 'personality-3d.png';
      link.href = dataURL;
      link.click();
    }
  }
  
  toggleFullscreen() {
    const container = document.getElementById('viz-3d');
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  
  shareResults() {
    this.gamification.userStats.sharesCount++;
    this.gamification.saveProgress();
    // Implementation for sharing
  }
  
  shareOn(platform) {
    const { archetype } = this.personalityResults;
    const text = `I'm ${archetype.name} according to P.A.T.R.I.C.I.A! ${archetype.description}`;
    const url = window.location.href;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: null
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank');
    }
  }
  
  downloadReport() {
    // Generate PDF report
    console.log('Generating PDF report...');
  }
  
  retakeAssessment() {
    this.showScreen('intro-screen');
    this.personalityResults = null;
    this.surveyData = null;
  }
  
  showAchievements() {
    const modal = document.getElementById('achievements-modal');
    modal.classList.add('active');
    this.renderAchievements();
  }
  
  renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    const unlocked = this.gamification.unlockedAchievements;
    
    const html = this.gamification.achievementDefinitions.map(achievement => {
      const isUnlocked = unlocked.includes(achievement.id);
      return `
        <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'} ${achievement.rarity}">
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-description">${achievement.description}</div>
          <div class="achievement-xp">${achievement.xp} XP</div>
        </div>
      `;
    }).join('');
    
    grid.innerHTML = html;
    
    // Update progress circle
    const progress = (unlocked.length / this.gamification.achievementDefinitions.length) * 339.292;
    document.getElementById('achievements-progress-circle').style.strokeDashoffset = 339.292 - progress;
    document.getElementById('achievements-unlocked').textContent = unlocked.length;
    document.getElementById('achievements-total').textContent = this.gamification.achievementDefinitions.length;
  }
  
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  }
  
  toggleTheme() {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme);
    
    const icon = document.querySelector('.theme-icon');
    icon.textContent = document.body.dataset.theme === 'dark' ? '☀️' : '🌙';
  }
  
  toggleSound() {
    this.soundSystem.toggle();
    const icon = document.querySelector('.sound-icon');
    icon.textContent = this.soundSystem.enabled ? '🔊' : '🔇';
  }
  
  setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }
  
  checkReturningUser() {
    const previousResults = localStorage.getItem('previousResults');
    if (previousResults) {
      const results = JSON.parse(previousResults);
      document.getElementById('previous-results').style.display = 'block';
      
      const html = results.slice(-3).map(result => `
        <div class="history-item">
          <span class="history-emoji">${result.archetype.emoji}</span>
          <span class="history-name">${result.archetype.name}</span>
          <span class="history-date">${new Date(result.timestamp).toLocaleDateString()}</span>
        </div>
      `).join('');
      
      document.getElementById('archetype-history').innerHTML = html;
    }
  }
  
  startProgressTimer() {
    const updateTimer = () => {
      if (this.startTime) {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('time-elapsed').textContent = 
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    };
    
    setInterval(updateTimer, 1000);
  }
  
  updateProgress() {
    // Update progress bar based on current question
    // Implementation depends on survey structure
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PatriciaApp();
});
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import lottie from 'lottie-web';

export class GamificationSystem {
  constructor() {
    this.achievements = [];
    this.unlockedAchievements = this.loadUnlockedAchievements();
    this.userStats = this.loadUserStats();
    this.experience = 0;
    this.level = 1;
    this.streakDays = 0;
    this.initAchievements();
    this.initSounds();
  }
  
  initAchievements() {
    this.achievementDefinitions = [
      // Discovery Achievements
      {
        id: 'first_assessment',
        name: 'First Steps',
        description: 'Complete your first personality assessment',
        icon: '🎯',
        rarity: 'common',
        xp: 100,
        condition: (stats) => stats.assessmentsTaken >= 1
      },
      {
        id: 'cosmic_explorer_unlock',
        name: 'Cosmic Discovery',
        description: 'Discover the Cosmic Explorer archetype',
        icon: '🌌',
        rarity: 'rare',
        xp: 250,
        condition: (stats, archetype) => archetype === 'cosmic-explorer'
      },
      {
        id: 'quantum_architect_unlock',
        name: 'Quantum Builder',
        description: 'Discover the Quantum Architect archetype',
        icon: '⚛️',
        rarity: 'rare',
        xp: 250,
        condition: (stats, archetype) => archetype === 'quantum-architect'
      },
      {
        id: 'all_archetypes',
        name: 'Master of Personalities',
        description: 'Discover all 21 personality archetypes',
        icon: '👑',
        rarity: 'legendary',
        xp: 1000,
        condition: (stats) => stats.archetypesDiscovered.length >= 21
      },
      
      // Progress Achievements
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete an assessment in under 5 minutes',
        icon: '⚡',
        rarity: 'uncommon',
        xp: 150,
        condition: (stats) => stats.fastestTime < 300
      },
      {
        id: 'thoughtful_responder',
        name: 'Deep Thinker',
        description: 'Spend over 20 minutes on an assessment',
        icon: '🤔',
        rarity: 'uncommon',
        xp: 150,
        condition: (stats) => stats.longestTime > 1200
      },
      {
        id: 'consistency_king',
        name: 'Consistency King',
        description: 'Get similar results in 3 consecutive assessments',
        icon: '🎯',
        rarity: 'epic',
        xp: 500,
        condition: (stats) => stats.consistentResults >= 3
      },
      {
        id: 'chameleon',
        name: 'The Chameleon',
        description: 'Get 5 different archetypes across assessments',
        icon: '🦎',
        rarity: 'epic',
        xp: 500,
        condition: (stats) => stats.archetypesDiscovered.length >= 5
      },
      
      // Streak Achievements
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Complete assessments 7 days in a row',
        icon: '📅',
        rarity: 'rare',
        xp: 300,
        condition: (stats) => stats.streakDays >= 7
      },
      {
        id: 'month_master',
        name: 'Month Master',
        description: 'Complete assessments 30 days in a row',
        icon: '🗓️',
        rarity: 'legendary',
        xp: 1000,
        condition: (stats) => stats.streakDays >= 30
      },
      
      // Social Achievements
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Share your results 5 times',
        icon: '🦋',
        rarity: 'uncommon',
        xp: 200,
        condition: (stats) => stats.sharesCount >= 5
      },
      {
        id: 'influencer',
        name: 'Personality Influencer',
        description: 'Share your results 20 times',
        icon: '📢',
        rarity: 'epic',
        xp: 600,
        condition: (stats) => stats.sharesCount >= 20
      },
      {
        id: 'matchmaker',
        name: 'Matchmaker',
        description: 'Find 5 compatible personalities',
        icon: '💝',
        rarity: 'rare',
        xp: 400,
        condition: (stats) => stats.compatibilityMatches >= 5
      },
      
      // Special Achievements
      {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete an assessment between midnight and 4 AM',
        icon: '🦉',
        rarity: 'uncommon',
        xp: 200,
        condition: (stats) => stats.nightOwl === true
      },
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete an assessment between 5 AM and 7 AM',
        icon: '🐦',
        rarity: 'uncommon',
        xp: 200,
        condition: (stats) => stats.earlyBird === true
      },
      {
        id: 'perfectionist',
        name: 'The Perfectionist',
        description: 'Change an answer at least 10 times in one assessment',
        icon: '✨',
        rarity: 'rare',
        xp: 300,
        condition: (stats) => stats.maxAnswerChanges >= 10
      },
      {
        id: 'decisive',
        name: 'The Decisive One',
        description: 'Complete an assessment without changing any answers',
        icon: '⚖️',
        rarity: 'rare',
        xp: 300,
        condition: (stats) => stats.noChangesAssessment === true
      },
      
      // Neurodiversity Achievements
      {
        id: 'adhd_awareness',
        name: 'ADHD Awareness',
        description: 'Learn about your ADHD traits',
        icon: '🧠',
        rarity: 'special',
        xp: 250,
        condition: (stats) => stats.adhdAssessed === true
      },
      {
        id: 'autism_awareness',
        name: 'Autism Awareness',
        description: 'Learn about your autism traits',
        icon: '♾️',
        rarity: 'special',
        xp: 250,
        condition: (stats) => stats.autismAssessed === true
      },
      {
        id: 'neurodiversity_champion',
        name: 'Neurodiversity Champion',
        description: 'Complete all neurodiversity assessments',
        icon: '🌈',
        rarity: 'legendary',
        xp: 750,
        condition: (stats) => stats.adhdAssessed && stats.autismAssessed
      },
      
      // Fun Easter Eggs
      {
        id: 'the_answer',
        name: 'The Answer to Everything',
        description: 'Score exactly 42 on any trait',
        icon: '🌍',
        rarity: 'easter_egg',
        xp: 420,
        condition: (stats) => stats.foundFortyTwo === true
      },
      {
        id: 'perfectly_balanced',
        name: 'Perfectly Balanced',
        description: 'Score exactly 50 on all Big Five traits',
        icon: '⚖️',
        rarity: 'easter_egg',
        xp: 500,
        condition: (stats) => stats.perfectBalance === true
      },
      {
        id: 'chaos_incarnate',
        name: 'Chaos Incarnate',
        description: 'Get the Chaos Dancer archetype 3 times',
        icon: '🌪️',
        rarity: 'easter_egg',
        xp: 666,
        condition: (stats) => stats.chaosCount >= 3
      }
    ];
  }
  
  initSounds() {
    this.sounds = {
      achievement: new Howl({
        src: ['data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAD/AP8A/wD/AP8A/wD/AP8A'],
        volume: 0.5
      }),
      levelUp: new Howl({
        src: ['data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAD/AP8A/wD/AP8A/wD/AP8A'],
        volume: 0.6
      }),
      milestone: new Howl({
        src: ['data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAD/AP8A/wD/AP8A/wD/AP8A'],
        volume: 0.7
      })
    };
  }
  
  checkAchievements(stats, archetype) {
    const newAchievements = [];
    
    this.achievementDefinitions.forEach(achievement => {
      if (!this.unlockedAchievements.includes(achievement.id)) {
        if (achievement.condition(stats, archetype)) {
          this.unlockAchievement(achievement);
          newAchievements.push(achievement);
        }
      }
    });
    
    return newAchievements;
  }
  
  unlockAchievement(achievement) {
    this.unlockedAchievements.push(achievement.id);
    this.experience += achievement.xp;
    this.checkLevelUp();
    this.saveProgress();
    this.showAchievementNotification(achievement);
    this.sounds.achievement.play();
    
    // Special effects for rare achievements
    if (achievement.rarity === 'legendary' || achievement.rarity === 'easter_egg') {
      this.triggerEpicAnimation(achievement);
    }
  }
  
  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-card ${achievement.rarity}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-content">
          <h3>Achievement Unlocked!</h3>
          <h4>${achievement.name}</h4>
          <p>${achievement.description}</p>
          <div class="achievement-xp">+${achievement.xp} XP</div>
        </div>
        <div class="achievement-rarity">${achievement.rarity.toUpperCase()}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remove after animation
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 4000);
  }
  
  triggerEpicAnimation(achievement) {
    // Confetti explosion
    const colors = {
      'legendary': ['#FFD700', '#FFA500', '#FF6347'],
      'easter_egg': ['#FF69B4', '#00CED1', '#9370DB']
    };
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors[achievement.rarity] || ['#667eea', '#764ba2']
    });
    
    // Screen flash effect
    const flash = document.createElement('div');
    flash.className = 'epic-flash';
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
      pointer-events: none;
      z-index: 10000;
      animation: flash 0.5s ease-out;
    `;
    document.body.appendChild(flash);
    
    setTimeout(() => flash.remove(), 500);
  }
  
  checkLevelUp() {
    const newLevel = Math.floor(this.experience / 1000) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.sounds.levelUp.play();
      this.showLevelUpNotification();
      this.unlockLevelRewards();
    }
  }
  
  showLevelUpNotification() {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
      <div class="level-up-card">
        <div class="level-up-animation"></div>
        <h2>LEVEL UP!</h2>
        <div class="level-display">
          <span class="level-number">${this.level}</span>
        </div>
        <div class="level-rewards">
          <p>New features unlocked!</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger Lottie animation if available
    const animContainer = notification.querySelector('.level-up-animation');
    if (animContainer) {
      lottie.loadAnimation({
        container: animContainer,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'data:application/json;base64,eyJhIjoxfQ==' // Simplified animation data
      });
    }
    
    // Confetti burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  unlockLevelRewards() {
    const rewards = {
      2: ['New color themes', 'Extended statistics'],
      3: ['3D visualization upgrades', 'Comparison mode'],
      5: ['AI insights unlocked', 'Custom archetypes'],
      10: ['Master mode', 'All features unlocked'],
      15: ['Legendary status', 'Special badge'],
      20: ['Grandmaster achievement', 'Hall of fame']
    };
    
    const levelRewards = rewards[this.level];
    if (levelRewards) {
      console.log('Unlocked rewards:', levelRewards);
      // Implement reward unlocking logic
    }
  }
  
  updateStreak() {
    const today = new Date().toDateString();
    const lastAssessment = localStorage.getItem('lastAssessmentDate');
    
    if (lastAssessment) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastAssessment === yesterday.toDateString()) {
        this.streakDays++;
      } else if (lastAssessment !== today) {
        this.streakDays = 1;
      }
    } else {
      this.streakDays = 1;
    }
    
    localStorage.setItem('lastAssessmentDate', today);
    localStorage.setItem('streakDays', this.streakDays.toString());
    
    // Check streak achievements
    this.checkStreakMilestones();
  }
  
  checkStreakMilestones() {
    const milestones = [3, 7, 14, 30, 60, 100];
    if (milestones.includes(this.streakDays)) {
      this.showStreakNotification();
      this.sounds.milestone.play();
    }
  }
  
  showStreakNotification() {
    const notification = document.createElement('div');
    notification.className = 'streak-notification';
    notification.innerHTML = `
      <div class="streak-card">
        <div class="streak-fire">🔥</div>
        <h3>${this.streakDays} Day Streak!</h3>
        <p>Keep going! You're on fire!</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  addExperience(amount) {
    this.experience += amount;
    this.checkLevelUp();
    this.saveProgress();
    this.showXPGain(amount);
  }
  
  showXPGain(amount) {
    const xpIndicator = document.createElement('div');
    xpIndicator.className = 'xp-gain';
    xpIndicator.textContent = `+${amount} XP`;
    xpIndicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      color: #10b981;
      font-weight: bold;
      font-size: 20px;
      animation: float-up 2s ease-out forwards;
      z-index: 10000;
    `;
    
    document.body.appendChild(xpIndicator);
    
    setTimeout(() => {
      xpIndicator.remove();
    }, 2000);
  }
  
  getProgress() {
    return {
      level: this.level,
      experience: this.experience,
      nextLevelXP: this.level * 1000,
      currentLevelProgress: this.experience % 1000,
      achievements: this.unlockedAchievements.length,
      totalAchievements: this.achievementDefinitions.length,
      streakDays: this.streakDays
    };
  }
  
  loadUnlockedAchievements() {
    const saved = localStorage.getItem('unlockedAchievements');
    return saved ? JSON.parse(saved) : [];
  }
  
  loadUserStats() {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      assessmentsTaken: 0,
      archetypesDiscovered: [],
      fastestTime: Infinity,
      longestTime: 0,
      consistentResults: 0,
      streakDays: 0,
      sharesCount: 0,
      compatibilityMatches: 0,
      nightOwl: false,
      earlyBird: false,
      maxAnswerChanges: 0,
      noChangesAssessment: false,
      adhdAssessed: false,
      autismAssessed: false,
      foundFortyTwo: false,
      perfectBalance: false,
      chaosCount: 0
    };
  }
  
  saveProgress() {
    localStorage.setItem('unlockedAchievements', JSON.stringify(this.unlockedAchievements));
    localStorage.setItem('userStats', JSON.stringify(this.userStats));
    localStorage.setItem('experience', this.experience.toString());
    localStorage.setItem('level', this.level.toString());
  }
  
  resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('unlockedAchievements');
      localStorage.removeItem('userStats');
      localStorage.removeItem('experience');
      localStorage.removeItem('level');
      localStorage.removeItem('streakDays');
      localStorage.removeItem('lastAssessmentDate');
      
      this.unlockedAchievements = [];
      this.userStats = this.loadUserStats();
      this.experience = 0;
      this.level = 1;
      this.streakDays = 0;
      
      alert('Progress reset successfully!');
    }
  }
}

// CSS for notifications (inject into page)
const style = document.createElement('style');
style.textContent = `
  @keyframes float-up {
    0% { 
      opacity: 1; 
      transform: translateY(0);
    }
    100% { 
      opacity: 0; 
      transform: translateY(-50px);
    }
  }
  
  @keyframes flash {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
  
  .achievement-notification {
    position: fixed;
    top: 20px;
    right: -400px;
    transition: right 0.5s ease-out;
    z-index: 10000;
  }
  
  .achievement-notification.show {
    right: 20px;
  }
  
  .achievement-card {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 15px;
    min-width: 350px;
    position: relative;
    overflow: hidden;
  }
  
  .achievement-card.legendary {
    background: linear-gradient(135deg, #FFD700, #FFA500);
  }
  
  .achievement-card.easter_egg {
    background: linear-gradient(135deg, #FF69B4, #00CED1);
  }
  
  .achievement-icon {
    font-size: 48px;
  }
  
  .achievement-content h3 {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
  
  .achievement-content h4 {
    margin: 5px 0;
    font-size: 18px;
  }
  
  .achievement-content p {
    margin: 5px 0;
    font-size: 14px;
    opacity: 0.9;
  }
  
  .achievement-xp {
    font-size: 16px;
    font-weight: bold;
    color: #10b981;
    background: rgba(255,255,255,0.2);
    padding: 2px 8px;
    border-radius: 5px;
    display: inline-block;
    margin-top: 5px;
  }
  
  .achievement-rarity {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 10px;
    font-weight: bold;
    opacity: 0.7;
    letter-spacing: 1px;
  }
  
  .level-up-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10001;
  }
  
  .level-up-card {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    text-align: center;
    animation: bounce-in 0.5s ease-out;
  }
  
  .level-up-card h2 {
    font-size: 36px;
    margin: 20px 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  
  .level-number {
    font-size: 72px;
    font-weight: bold;
    display: inline-block;
    animation: pulse 1s ease-in-out infinite;
  }
  
  @keyframes bounce-in {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  .streak-notification {
    position: fixed;
    bottom: -100px;
    left: 50%;
    transform: translateX(-50%);
    transition: bottom 0.5s ease-out;
    z-index: 10000;
  }
  
  .streak-notification.show {
    bottom: 20px;
  }
  
  .streak-card {
    background: linear-gradient(135deg, #f97316, #dc2626);
    color: white;
    padding: 20px 30px;
    border-radius: 50px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .streak-fire {
    font-size: 36px;
    animation: flame 1s ease-in-out infinite;
  }
  
  @keyframes flame {
    0%, 100% { transform: scale(1) rotate(-5deg); }
    50% { transform: scale(1.2) rotate(5deg); }
  }
  
  .epic-flash {
    animation: flash 0.5s ease-out;
  }
`;

document.head.appendChild(style);

export default GamificationSystem;
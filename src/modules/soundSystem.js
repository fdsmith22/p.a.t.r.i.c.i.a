import { Howl, Howler } from 'howler';

export class SoundSystem {
  constructor() {
    this.enabled = this.loadSoundPreference();
    this.sounds = {};
    this.ambientMusic = null;
    this.currentAmbient = null;
    this.initSounds();
  }
  
  initSounds() {
    // UI Sounds
    this.sounds.click = new Howl({
      src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
      volume: 0.3
    });
    
    this.sounds.hover = new Howl({
      src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
      volume: 0.2
    });
    
    this.sounds.start = new Howl({
      src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
      volume: 0.5
    });
    
    this.sounds.complete = new Howl({
      src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
      volume: 0.6
    });
    
    this.sounds.achievement = new Howl({
      src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
      volume: 0.7
    });
    
    this.sounds.error = new Howl({
      src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
      volume: 0.4
    });
    
    this.sounds.notification = new Howl({
      src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
      volume: 0.5
    });
    
    // Ambient tracks
    this.ambientTracks = {
      intro: new Howl({
        src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
        volume: 0.2,
        loop: true
      }),
      assessment: new Howl({
        src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
        volume: 0.15,
        loop: true
      }),
      results: new Howl({
        src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
        volume: 0.2,
        loop: true
      }),
      cosmic: new Howl({
        src: ['data:audio/wav;base64,UklGRjYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRIAAAD//wIA/f8FAAYA+//6/wcABgD4//r/BwAGAPj/+v8='],
        volume: 0.18,
        loop: true
      })
    };
    
    // Set global volume
    Howler.volume(this.enabled ? 1 : 0);
  }
  
  play(soundName, options = {}) {
    if (!this.enabled && !options.force) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      if (options.volume !== undefined) {
        sound.volume(options.volume);
      }
      if (options.rate !== undefined) {
        sound.rate(options.rate);
      }
      sound.play();
    }
  }
  
  playAmbient(trackName) {
    if (!this.enabled) return;
    
    // Stop current ambient if playing
    if (this.currentAmbient) {
      this.fadeOut(this.currentAmbient);
    }
    
    const track = this.ambientTracks[trackName];
    if (track) {
      this.fadeIn(track);
      this.currentAmbient = track;
    }
  }
  
  stopAmbient() {
    if (this.currentAmbient) {
      this.fadeOut(this.currentAmbient);
      this.currentAmbient = null;
    }
  }
  
  fadeIn(sound, duration = 1000) {
    sound.volume(0);
    sound.play();
    sound.fade(0, sound._volume || 0.2, duration);
  }
  
  fadeOut(sound, duration = 1000) {
    const currentVolume = sound.volume();
    sound.fade(currentVolume, 0, duration);
    setTimeout(() => {
      sound.stop();
    }, duration);
  }
  
  playSequence(sounds, interval = 200) {
    sounds.forEach((soundName, index) => {
      setTimeout(() => {
        this.play(soundName);
      }, index * interval);
    });
  }
  
  playChord(notes, volume = 0.3) {
    if (!this.enabled) return;
    
    notes.forEach(note => {
      const frequency = this.noteToFrequency(note);
      this.playTone(frequency, 500, volume);
    });
  }
  
  playTone(frequency, duration = 200, volume = 0.3) {
    if (!this.enabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }
  
  noteToFrequency(note) {
    const notes = {
      'C4': 261.63,
      'D4': 293.66,
      'E4': 329.63,
      'F4': 349.23,
      'G4': 392.00,
      'A4': 440.00,
      'B4': 493.88,
      'C5': 523.25
    };
    return notes[note] || 440;
  }
  
  playPersonalitySound(archetypeId) {
    const sounds = {
      'cosmic-explorer': ['C5', 'E4', 'G4', 'B4'],
      'quantum-architect': ['C4', 'F4', 'A4', 'C5'],
      'neural-navigator': ['D4', 'F4', 'A4', 'D5'],
      'digital-alchemist': ['E4', 'G4', 'B4', 'E5'],
      'chaos-dancer': ['C4', 'D4', 'F4', 'G4', 'B4'],
      'empathy-sage': ['F4', 'A4', 'C5', 'E5'],
      'harmony-weaver': ['C4', 'E4', 'G4', 'C5']
    };
    
    const chord = sounds[archetypeId] || ['C4', 'E4', 'G4'];
    this.playChord(chord);
  }
  
  createBinaural(frequency = 40, duration = 10000) {
    if (!this.enabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create two oscillators for left and right channels
    const oscillatorL = audioContext.createOscillator();
    const oscillatorR = audioContext.createOscillator();
    
    // Create gain nodes
    const gainL = audioContext.createGain();
    const gainR = audioContext.createGain();
    
    // Create stereo panner nodes
    const pannerL = audioContext.createStereoPanner();
    const pannerR = audioContext.createStereoPanner();
    
    // Set frequencies (binaural beat)
    const baseFrequency = 200;
    oscillatorL.frequency.value = baseFrequency;
    oscillatorR.frequency.value = baseFrequency + frequency;
    
    // Set panning
    pannerL.pan.value = -1; // Full left
    pannerR.pan.value = 1; // Full right
    
    // Connect nodes
    oscillatorL.connect(gainL);
    gainL.connect(pannerL);
    pannerL.connect(audioContext.destination);
    
    oscillatorR.connect(gainR);
    gainR.connect(pannerR);
    pannerR.connect(audioContext.destination);
    
    // Set volume
    gainL.gain.value = 0.1;
    gainR.gain.value = 0.1;
    
    // Start and stop
    oscillatorL.start();
    oscillatorR.start();
    
    setTimeout(() => {
      oscillatorL.stop();
      oscillatorR.stop();
    }, duration);
  }
  
  toggle() {
    this.enabled = !this.enabled;
    Howler.volume(this.enabled ? 1 : 0);
    this.saveSoundPreference();
    
    if (!this.enabled && this.currentAmbient) {
      this.currentAmbient.stop();
    }
  }
  
  setVolume(volume) {
    Howler.volume(volume);
  }
  
  loadSoundPreference() {
    const saved = localStorage.getItem('soundEnabled');
    return saved === null ? true : saved === 'true';
  }
  
  saveSoundPreference() {
    localStorage.setItem('soundEnabled', this.enabled.toString());
  }
  
  playEasterEgg(type) {
    const sequences = {
      'konami': ['click', 'click', 'hover', 'hover', 'notification', 'achievement'],
      'secret': ['notification', 'click', 'achievement'],
      'mario': this.playMarioSound.bind(this)
    };
    
    const sequence = sequences[type];
    if (Array.isArray(sequence)) {
      this.playSequence(sequence, 150);
    } else if (typeof sequence === 'function') {
      sequence();
    }
  }
  
  playMarioSound() {
    const notes = [
      { note: 'E4', duration: 100 },
      { note: 'E4', duration: 100 },
      { note: 'E4', duration: 200 },
      { note: 'C4', duration: 100 },
      { note: 'E4', duration: 200 },
      { note: 'G4', duration: 400 }
    ];
    
    let delay = 0;
    notes.forEach(({ note, duration }) => {
      setTimeout(() => {
        this.playTone(this.noteToFrequency(note), duration);
      }, delay);
      delay += duration;
    });
  }
  
  createSpatialSound(soundName, position = { x: 0, y: 0, z: 0 }) {
    if (!this.enabled) return;
    
    const sound = this.sounds[soundName];
    if (!sound) return;
    
    // Calculate volume based on distance
    const distance = Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2);
    const volume = Math.max(0, 1 - (distance / 10));
    
    // Calculate stereo panning based on x position
    const pan = Math.max(-1, Math.min(1, position.x / 5));
    
    sound.volume(volume);
    sound.stereo(pan);
    sound.play();
  }
  
  createAdaptiveMusic(personalityData) {
    // Adjust music based on personality traits
    const { openness, extraversion, neuroticism } = personalityData.bigFive;
    
    // Higher openness = more experimental sounds
    // Higher extraversion = faster tempo
    // Higher neuroticism = calmer music
    
    const tempo = 60 + (extraversion * 0.6); // 60-120 BPM
    const complexity = openness / 100; // 0-1
    const intensity = 1 - (neuroticism / 100); // 0-1
    
    // Apply adaptive parameters to ambient music
    if (this.currentAmbient) {
      this.currentAmbient.rate(tempo / 80); // Adjust playback rate
      this.currentAmbient.volume(0.1 + intensity * 0.2); // Adjust volume
    }
  }
}
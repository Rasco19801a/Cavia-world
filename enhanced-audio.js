// Enhanced Audio System with Web Audio API
// Provides better sound quality, effects, and music mixing

class EnhancedAudioSystem {
    constructor() {
        this.context = null;
        this.sounds = new Map();
        this.music = new Map();
        this.masterVolume = 0.7;
        this.soundVolume = 0.8;
        this.musicVolume = 0.5;
        this.isEnabled = true;
        
        this.initAudioContext();
        this.createSounds();
    }
    
    async initAudioContext() {
        try {
            // Create audio context
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.context.destination);
            
            // Create separate gain nodes for sounds and music
            this.soundGain = this.context.createGain();
            this.soundGain.gain.value = this.soundVolume;
            this.soundGain.connect(this.masterGain);
            
            this.musicGain = this.context.createGain();
            this.musicGain.gain.value = this.musicVolume;
            this.musicGain.connect(this.masterGain);
            
            console.log('Enhanced audio system initialized');
        } catch (error) {
            console.warn('Web Audio API not supported, falling back to basic audio');
            this.context = null;
        }
    }
    
    // Generate procedural sounds using Web Audio API
    createSounds() {
        if (!this.context) return;
        
        // Coin pickup sound
        this.sounds.set('coin', this.createCoinSound());
        
        // Happy sound (for interactions)
        this.sounds.set('happy', this.createHappySound());
        
        // Walking sound
        this.sounds.set('walk', this.createWalkSound());
        
        // Menu click sound
        this.sounds.set('click', this.createClickSound());
        
        // Eating sound
        this.sounds.set('eat', this.createEatSound());
        
        // Ambient background music
        this.createBackgroundMusic();
    }
    
    createCoinSound() {
        return () => {
            if (!this.context || !this.isEnabled) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            // Create a pleasant coin pickup sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, this.context.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.soundGain);
            
            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.3);
        };
    }
    
    createHappySound() {
        return () => {
            if (!this.context || !this.isEnabled) return;
            
            // Create a happy chirp sound
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator1.type = 'sine';
            oscillator1.frequency.setValueAtTime(400, this.context.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.1);
            
            oscillator2.type = 'sine';
            oscillator2.frequency.setValueAtTime(500, this.context.currentTime + 0.1);
            oscillator2.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.soundGain);
            
            oscillator1.start();
            oscillator1.stop(this.context.currentTime + 0.15);
            oscillator2.start(this.context.currentTime + 0.1);
            oscillator2.stop(this.context.currentTime + 0.3);
        };
    }
    
    createWalkSound() {
        return () => {
            if (!this.context || !this.isEnabled) return;
            
            // Create a soft walking sound
            const noiseBuffer = this.createNoiseBuffer(0.1);
            const source = this.context.createBufferSource();
            const filter = this.context.createBiquadFilter();
            const gainNode = this.context.createGain();
            
            source.buffer = noiseBuffer;
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            
            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
            
            source.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.soundGain);
            
            source.start();
            source.stop(this.context.currentTime + 0.1);
        };
    }
    
    createClickSound() {
        return () => {
            if (!this.context || !this.isEnabled) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(300, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.soundGain);
            
            oscillator.start();
            oscillator.stop(this.context.currentTime + 0.1);
        };
    }
    
    createEatSound() {
        return () => {
            if (!this.context || !this.isEnabled) return;
            
            // Create a crunchy eating sound
            const noiseBuffer = this.createNoiseBuffer(0.3);
            const source = this.context.createBufferSource();
            const filter = this.context.createBiquadFilter();
            const gainNode = this.context.createGain();
            
            source.buffer = noiseBuffer;
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            filter.Q.value = 5;
            
            gainNode.gain.setValueAtTime(0.15, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
            
            source.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.soundGain);
            
            source.start();
            source.stop(this.context.currentTime + 0.3);
        };
    }
    
    createNoiseBuffer(duration) {
        const bufferSize = this.context.sampleRate * duration;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }
    
    createBackgroundMusic() {
        if (!this.context) return;
        
        // Create a simple ambient background music
        this.backgroundMusic = {
            oscillators: [],
            playing: false
        };
        
        // Create a gentle ambient drone
        const frequencies = [220, 330, 440, 660]; // A major chord progression
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = freq;
            
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            
            gainNode.gain.value = 0.05 * (1 - index * 0.2); // Decrease volume for higher frequencies
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.musicGain);
            
            this.backgroundMusic.oscillators.push({
                oscillator,
                gainNode,
                filter
            });
        });
    }
    
    startBackgroundMusic() {
        if (!this.context || !this.isEnabled || this.backgroundMusic.playing) return;
        
        this.backgroundMusic.oscillators.forEach(({ oscillator, gainNode }) => {
            oscillator.start();
            
            // Add subtle volume modulation for ambiance
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(gainNode.gain.value || 0.05, this.context.currentTime + 2);
        });
        
        this.backgroundMusic.playing = true;
    }
    
    stopBackgroundMusic() {
        if (!this.context || !this.backgroundMusic.playing) return;
        
        this.backgroundMusic.oscillators.forEach(({ oscillator, gainNode }) => {
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 1);
            oscillator.stop(this.context.currentTime + 1.1);
        });
        
        this.backgroundMusic.playing = false;
        
        // Recreate oscillators for next time
        setTimeout(() => {
            this.createBackgroundMusic();
        }, 1200);
    }
    
    // Play sound effects
    playSound(name) {
        if (!this.isEnabled) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound();
        }
    }
    
    // Volume controls
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.context.currentTime);
        }
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        if (this.soundGain) {
            this.soundGain.gain.setValueAtTime(this.soundVolume, this.context.currentTime);
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.setValueAtTime(this.musicVolume, this.context.currentTime);
        }
    }
    
    // Enable/disable audio
    toggle() {
        this.isEnabled = !this.isEnabled;
        
        if (!this.isEnabled && this.backgroundMusic.playing) {
            this.stopBackgroundMusic();
        } else if (this.isEnabled && !this.backgroundMusic.playing) {
            this.startBackgroundMusic();
        }
        
        return this.isEnabled;
    }
    
    // Create spatial audio effect (for 3D positioning)
    playSpatialSound(name, x, y, listenerX = 320, listenerY = 240) {
        if (!this.context || !this.isEnabled) return;
        
        // Calculate distance and panning
        const distance = Math.sqrt(Math.pow(x - listenerX, 2) + Math.pow(y - listenerY, 2));
        const maxDistance = 300;
        const volume = Math.max(0, 1 - (distance / maxDistance));
        const pan = (x - listenerX) / 320; // Normalize to -1 to 1
        
        // Create panner node
        const panner = this.context.createStereoPanner();
        panner.pan.value = Math.max(-1, Math.min(1, pan));
        
        // Create a temporary gain node for this sound
        const tempGain = this.context.createGain();
        tempGain.gain.value = volume * 0.5;
        
        // Connect: sound -> tempGain -> panner -> soundGain
        tempGain.connect(panner);
        panner.connect(this.soundGain);
        
        // Override the sound to use our spatial setup
        const originalSoundGain = this.soundGain;
        this.soundGain = tempGain;
        
        this.playSound(name);
        
        // Restore original sound gain
        this.soundGain = originalSoundGain;
    }
    
    // Add reverb effect
    createReverb() {
        if (!this.context) return null;
        
        const convolver = this.context.createConvolver();
        const bufferSize = this.context.sampleRate * 2; // 2 second reverb
        const buffer = this.context.createBuffer(2, bufferSize, this.context.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < bufferSize; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
            }
        }
        
        convolver.buffer = buffer;
        return convolver;
    }
    
    // Resume audio context (needed for user interaction requirement)
    async resumeContext() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
    }
}
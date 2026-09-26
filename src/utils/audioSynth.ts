/**
 * Web Audio API nature sound synthesizer
 * 100% offline, zero network dependencies, never breaks or 404s
 */

export type SoundType = 'rain' | 'fire' | 'stream' | 'chime';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentSound: SoundType | null = null;
  private masterGain: GainNode | null = null;
  private intervalIds: number[] = [];
  private activeNodes: (AudioNode | AudioBufferSourceNode)[] = [];
  private volume: number = 0.5;

  private initContext() {
    try {
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (!this.masterGain && this.ctx) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentSound(): SoundType | null {
    return this.currentSound;
  }

  public stop() {
    this.intervalIds.forEach(id => window.clearInterval(id));
    this.intervalIds = [];

    if (this.activeNodes.length > 0 && this.masterGain && this.ctx) {
      // Smooth fade out
      const fadeTime = 0.3;
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + fadeTime);
      setTimeout(() => {
        this.activeNodes.forEach(node => {
          try {
            if ('stop' in node && typeof (node as AudioBufferSourceNode).stop === 'function') {
              (node as AudioBufferSourceNode).stop();
            }
            node.disconnect();
          } catch {
            // ignore
          }
        });
        this.activeNodes = [];
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
      }, fadeTime * 1000);
    }

    this.currentSound = null;
  }

  public play(type: SoundType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentSound === type) {
      this.stop();
      return;
    }

    this.stop();

    setTimeout(() => {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      this.currentSound = type;
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.5);

      switch (type) {
        case 'rain':
          this.playRain();
          break;
        case 'fire':
          this.playFire();
          break;
        case 'stream':
          this.playStream();
          break;
        case 'chime':
          this.playChimes();
          break;
      }
    }, 200);
  }

  private createNoiseBuffer(duration = 3): AudioBuffer {
    const bufferSize = this.ctx!.sampleRate * duration;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise approximation for soothing rain/water
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }

  private playRain() {
    if (!this.ctx || !this.masterGain) return;

    const noiseBuffer = this.createNoiseBuffer(5);
    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start();
    this.activeNodes.push(source, filter, gain);

    // Random soft droplets
    const dropletInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentSound !== 'rain') return;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 700 + Math.random() * 600;
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, this.ctx.currentTime + 0.08);

      dropGain.gain.setValueAtTime(0.04 * Math.random(), this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(dropGain);
      dropGain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    }, 450);

    this.intervalIds.push(dropletInterval);
  }

  private playFire() {
    if (!this.ctx || !this.masterGain) return;

    // Low rumble
    const noiseBuffer = this.createNoiseBuffer(4);
    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.65, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();
    this.activeNodes.push(source, filter, gain);

    // Crackle pops
    const crackleInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentSound !== 'fire') return;
      if (Math.random() > 0.4) {
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(180 + Math.random() * 400, this.ctx.currentTime);
        popGain.gain.setValueAtTime(0.08 * (0.4 + Math.random() * 0.6), this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

        popOsc.connect(popGain);
        popGain.connect(this.masterGain);
        popOsc.start();
        popOsc.stop(this.ctx.currentTime + 0.05);
      }
    }, 120);

    this.intervalIds.push(crackleInterval);
  }

  private playStream() {
    if (!this.ctx || !this.masterGain) return;

    const noiseBuffer = this.createNoiseBuffer(6);
    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // Gently modulate filter for water babble
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.25, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    lfo.start();
    source.start();
    this.activeNodes.push(source, filter, gain, lfo, lfoGain);
  }

  private playChimes() {
    if (!this.ctx || !this.masterGain) return;

    const chimeFrequencies = [528, 660, 792, 1056, 1320];

    const playOneChime = () => {
      if (!this.ctx || !this.masterGain || this.currentSound !== 'chime') return;
      const freq = chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.3);
    };

    // Play immediately
    playOneChime();

    // Repeat naturally
    const chimeInterval = window.setInterval(() => {
      playOneChime();
    }, 2800);

    this.intervalIds.push(chimeInterval);
  }
}

export const audioSynth = new AudioSynthesizer();

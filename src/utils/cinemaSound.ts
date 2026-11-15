type AudioContextConstructor = typeof AudioContext;

let sharedContext: AudioContext | null = null;

const getAudioContext = () => {
  if (sharedContext) return sharedContext;
  const Context: AudioContextConstructor | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext;
  if (!Context) return null;
  sharedContext = new Context();
  return sharedContext;
};

const createNoiseBuffer = (context: AudioContext, seconds: number) => {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index++) data[index] = Math.random() * 2 - 1;
  return buffer;
};

const playFilteredNoise = (
  context: AudioContext,
  start: number,
  seconds: number,
  shape: (filter: BiquadFilterNode, gain: GainNode, start: number) => void,
) => {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = createNoiseBuffer(context, seconds);
  shape(filter, gain, start);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(start);
  source.stop(start + seconds);
};

export const playWhoosh = () => {
  try {
    const context = getAudioContext();
    if (!context) return;
    const now = context.currentTime;
    playFilteredNoise(context, now, 0.7, (filter, gain, start) => {
      filter.type = 'bandpass';
      filter.Q.value = 0.9;
      filter.frequency.setValueAtTime(260, start);
      filter.frequency.exponentialRampToValueAtTime(2200, start + 0.32);
      filter.frequency.exponentialRampToValueAtTime(500, start + 0.7);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.045, start + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);
    });
  } catch {
    return;
  }
};

export const playProjectorRoll = () => {
  try {
    const context = getAudioContext();
    if (!context) return;
    const now = context.currentTime;
    const clicks = 14;
    for (let index = 0; index < clicks; index++) {
      const start = now + index * 0.055;
      const fade = 1 - index / clicks;
      playFilteredNoise(context, start, 0.012, (filter, gain, clickStart) => {
        filter.type = 'highpass';
        filter.frequency.value = 1800;
        gain.gain.setValueAtTime(0.05 * fade, clickStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, clickStart + 0.012);
      });
    }
  } catch {
    return;
  }
};

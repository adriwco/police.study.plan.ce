import { afterEach, describe, expect, it, vi } from 'vitest';

const createAudioMock = () => {
  const param = () => ({
    value: 0,
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  });
  const node = () => ({ connect: vi.fn() });
  const sources: { start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> }[] =
    [];
  class FakeAudioContext {
    currentTime = 0;
    sampleRate = 8000;
    destination = {};
    createBuffer = (_channels: number, length: number) => ({
      getChannelData: () => new Float32Array(length),
    });
    createBufferSource = () => {
      const source = { ...node(), buffer: null, start: vi.fn(), stop: vi.fn() };
      sources.push(source);
      return source;
    };
    createBiquadFilter = () => ({ ...node(), type: '', Q: param(), frequency: param() });
    createGain = () => ({ ...node(), gain: param() });
  }
  return { FakeAudioContext, sources };
};

describe('cinemaSound', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('não falha quando o navegador não tem Web Audio', async () => {
    vi.stubGlobal('AudioContext', undefined);
    const { playWhoosh, playProjectorRoll } = await import('@/utils/cinemaSound');
    expect(() => playWhoosh()).not.toThrow();
    expect(() => playProjectorRoll()).not.toThrow();
  });

  it('toca o deslize como um ruído filtrado único', async () => {
    const { FakeAudioContext, sources } = createAudioMock();
    vi.stubGlobal('AudioContext', FakeAudioContext);
    const { playWhoosh } = await import('@/utils/cinemaSound');
    playWhoosh();
    expect(sources).toHaveLength(1);
    expect(sources[0].start).toHaveBeenCalledWith(0);
  });

  it('toca o projetor como uma sequência de cliques', async () => {
    const { FakeAudioContext, sources } = createAudioMock();
    vi.stubGlobal('AudioContext', FakeAudioContext);
    const { playProjectorRoll } = await import('@/utils/cinemaSound');
    playProjectorRoll();
    expect(sources).toHaveLength(14);
  });
});

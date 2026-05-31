const SAMPLE_RATE = 22050;
const DURATION_SECONDS = 2;
const AMPLITUDE = 0.28;

const encoder = new TextEncoder();

const writeString = (view: DataView, offset: number, value: string) => {
  const bytes = encoder.encode(value);

  bytes.forEach((byte, index) => {
    view.setUint8(offset + index, byte);
  });
};

const createToneWavBuffer = (trackId: number) => {
  const frequency = 220 + trackId * 55;
  const sampleCount = SAMPLE_RATE * DURATION_SECONDS;
  const bytesPerSample = 2;
  const dataSize = sampleCount * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const envelope = 1 - sampleIndex / sampleCount;
    const sample =
      Math.sin((2 * Math.PI * frequency * sampleIndex) / SAMPLE_RATE) *
      AMPLITUDE *
      envelope;

    view.setInt16(44 + sampleIndex * bytesPerSample, sample * 32767, true);
  }

  return buffer;
};

export async function GET(
  _request: Request,
  context: RouteContext<"/api/audio/[id]">,
) {
  const { id } = await context.params;
  const trackId = Number(id);
  const safeTrackId = Number.isFinite(trackId) ? trackId : 1;
  const buffer = createToneWavBuffer(safeTrackId);

  return new Response(buffer, {
    headers: {
      "Content-Type": "audio/wav",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

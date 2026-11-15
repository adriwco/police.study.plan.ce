export const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dark;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 5; octave++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  float t = u_time * 0.045;

  float haze = fbm(uv * aspect * 1.7 + vec2(t, -t * 0.6));

  vec2 source = vec2(1.08, 1.12);
  vec2 delta = uv - source;
  float angle = atan(delta.y, delta.x);
  float rays = fbm(vec2(angle * 7.0, t * 2.4));
  float beam = smoothstep(1.45, 0.0, length(delta * aspect * 0.8)) * (0.45 + 0.55 * rays);

  vec2 leakCenter = vec2(0.92 + 0.06 * sin(t * 3.1), 0.86 + 0.05 * cos(t * 2.3));
  float leak = smoothstep(0.75, 0.0, distance(uv * aspect, leakCenter * aspect));

  vec3 warm = mix(vec3(0.96, 0.58, 0.28), vec3(1.0, 0.72, 0.42), u_dark);
  vec3 cool = mix(vec3(0.42, 0.52, 0.55), vec3(0.55, 0.68, 0.78), u_dark);
  vec3 color = mix(cool, warm, clamp(leak + beam * 0.4, 0.0, 1.0));

  float alpha = clamp(beam * 0.55 + leak * 0.4 + haze * 0.18, 0.0, 1.0);
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

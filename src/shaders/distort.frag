uniform float uTime;
uniform float uDistort;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float noise = sin(uv.x * 10.0 + uTime) * cos(uv.y * 10.0 + uTime) * uDistort;
  uv.x += noise * 0.05;
  uv.y += noise * 0.05;

  vec3 color1 = vec3(0.48, 0.18, 0.75);
  vec3 color2 = vec3(0.0, 0.96, 1.0);
  vec3 color = mix(color1, color2, uv.x + noise);

  gl_FragColor = vec4(color, 1.0);
}

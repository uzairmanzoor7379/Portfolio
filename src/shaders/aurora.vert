uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec3 pos = position;
  float elevation = sin(pos.x * 2.0 + uTime * 0.5) * 0.15
                  + cos(pos.y * 3.0 + uTime * 0.3) * 0.1
                  + sin((pos.x + uMouse.x) * 1.5 + uTime * 0.7) * 0.05;
  pos.z += elevation;
  vElevation = elevation;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

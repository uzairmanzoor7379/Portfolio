uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vElevation;

// High-quality noise function
float noise(vec2 p) {
    return sin(p.x * 0.5) * sin(p.y * 0.5);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p * 2.0 + uTime * 0.1;
        a *= 0.5;
    }
    return v;
}

void main() {
    // Scale UVs for more detail on large plane
    vec2 uv = vUv * 2.0;
    uv += uMouse * 0.05;
    
    // Create multiple layers of "ribbon" noise
    float n1 = fbm(uv + uTime * 0.2);
    float n2 = fbm(uv * 1.5 - uTime * 0.15);
    
    // Isolate ribbons using absolute values and power
    float ribbon = pow(1.0 - abs(n1 - n2), 8.0);
    
    // Define colors with high vibrancy
    vec3 cyan   = vec3(0.0, 0.96, 1.0);   // Primary
    vec3 violet = vec3(0.5, 0.0, 1.0);    // Secondary
    vec3 amber  = vec3(1.0, 0.4, 0.0);    // Accents
    
    // Mix colors based on UV and noise
    vec3 color = mix(cyan, violet, uv.y * 0.5);
    color = mix(color, amber, ribbon * 0.4);
    
    // Final intensity and subtle pulse
    float finalMask = ribbon * 0.6 + (vElevation * 2.0);
    
    // Subtle technical scanlines
    float scanline = sin(vUv.y * 400.0) * 0.04;
    color -= scanline;
    
    // Apply soft vignette
    float edge = smoothstep(0.0, 0.4, vUv.x) * smoothstep(1.0, 0.6, vUv.x) *
                 smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
                 
    gl_FragColor = vec4(color * finalMask, 0.4 * edge);
}

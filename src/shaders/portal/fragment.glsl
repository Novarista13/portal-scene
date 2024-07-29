uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;

#include ../includes/perlinNoise3D

void main() {
  // displace the uv
  vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime * 0.1));

  // perlin noise
  float strength = cnoise(vec3(displacedUv * 5.0, uTime * 0.2));

  // outer glow
  float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.4;
  strength += outerGlow;

  // apply cool step
  strength += step(-0.2, strength) * 0.8;

  // clamp the value from 0 to 1
  strength = clamp(strength, 0.0, 1.0);

  // final Color
  vec3 color = mix(uColorStart, uColorEnd, strength);

  gl_FragColor = vec4(color, 1.0);
}
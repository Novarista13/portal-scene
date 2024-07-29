uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;


attribute float aScale;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // to make fireflies 'dance'
  modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  gl_PointSize = uSize * aScale * uPixelRatio; // to get same size on all screens
  gl_PointSize *= (1.0/ -viewPosition.z); // activating sizeAttenuation
}
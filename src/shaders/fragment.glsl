uniform sampler2D uTexture;
uniform float progress;

varying vec2 vUv;
varying float vFrontShadow;

float pi = 3.14159265359;

void main() {
  // Create a 2D rotation matrix
  float cosAngle = cos(-pi/2.);
  float sinAngle = sin(-pi/2.);
  mat2 rotationMatrix = mat2(
    cosAngle, -sinAngle,
    sinAngle, cosAngle
  );
  // Rotate the UV coordinates
  vec2 rotatedUV = rotationMatrix * (vUv - 0.5) + 0.5;

  gl_FragColor = texture2D(uTexture, rotatedUV);

  gl_FragColor.rgb *=vFrontShadow;
}
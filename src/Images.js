import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

// Function to create a mesh for each image
export function createImageComponent(texture) {
  const planeGeometry = new THREE.PlaneGeometry(1, 1, 80, 80);
  const planeMaterial = new THREE.ShaderMaterial({
    extensions: {
      derivatives: "#extension GL_OES_standard_derivatives : enable",
    },
    uniforms: {
      uTexture: { value: texture },
      uYScrollPosition: { value: 0 },
      uAngle: { value: 0 },
      uProgress: { value: 0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(planeGeometry, planeMaterial);

  return mesh;
}

export function updateImageUniforms(mesh, yScrollPosition) {
  mesh.material.uniforms.uYScrollPosition.value = yScrollPosition;
  // Update the uniforms for Roll Up and Roll Down
  if (yScrollPosition >= 0) {
    mesh.material.uniforms.uProgress.value = -yScrollPosition + 1.2;
    mesh.material.uniforms.uAngle.value = 0;
  }
  if (yScrollPosition < 0) {
    mesh.material.uniforms.uProgress.value = yScrollPosition + 1.2;
    mesh.material.uniforms.uAngle.value = Math.PI / 2;
  }
}

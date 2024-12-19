import * as THREE from "three";

const geometry = new THREE.CylinderGeometry(10, 10, 10, 300, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
export function background(scene) {
  scene.add(mesh);
  return mesh;
}

export function updateBackground(yScrollPosition) {
  const factor = 0.1;
  mesh.rotation.y = -yScrollPosition * factor;
}
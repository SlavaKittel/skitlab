import * as THREE from "three";

// <<<< S-3D LOGO >>>>
const logoModelGroup = new THREE.Group();
let logoModelArray = [];
let rotationSpeeds = [];

// <<<< CYLINDER BACKGROUND >>>>
// Texture Cylinbder Loader
function nameBoundaryTexture(name) {
  const loader = new THREE.TextureLoader();
  return loader.load(`./texture/TilesMosaicPennyround001/${name}.png`);
}
const colorTexture = nameBoundaryTexture("TilesMosaicPennyround001_BUMP_1K");
colorTexture.encoding = THREE.LinearEncoding;
colorTexture.needsUpdate = true;
colorTexture.colorSpace = THREE.SRGBColorSpace;
const displacementTexture = nameBoundaryTexture(
  "TilesMosaicPennyround001_DISP_1K"
);
const bumpTexture = nameBoundaryTexture("TilesMosaicPennyround001_BUMP_1K");
const normalTexture = nameBoundaryTexture("TilesMosaicPennyround001_NRM_1K");
const roughnessTexture = nameBoundaryTexture(
  "TilesMosaicPennyround001_GLOSS_1K"
);
const aoTexture = nameBoundaryTexture("TilesMosaicPennyround001_AO_1K");

const repeatGorundTextures = (texture) => {
  const repeat = 3;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = repeat * 18.5;
  texture.repeat.y = repeat;
};
repeatGorundTextures(colorTexture);
repeatGorundTextures(displacementTexture);
repeatGorundTextures(normalTexture);
repeatGorundTextures(roughnessTexture);
repeatGorundTextures(aoTexture);
repeatGorundTextures(bumpTexture);

// Mesh Cylinder Geometry
const geometry = new THREE.CylinderGeometry(30, 30, 10, 100, 100);
const material = new THREE.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0.5,
  map: colorTexture,
  displacementMap: displacementTexture,
  normalMap: normalTexture,
  roughnessMap: roughnessTexture,
  aoMap: aoTexture,
  bumpMap: bumpTexture,
  displacementScale: 0.1,
  side: THREE.DoubleSide,
});
const meshCylinder = new THREE.Mesh(geometry, material);
meshCylinder.rotation.order = "XZY";
meshCylinder.position.z = 27;

export function getBackground(scene_, glb_) {
  // <<<< S-3D LOGO >>>>
  let logoModel = glb_.scene;

  logoModel.traverse((child) => {
    if (child.isMesh) {
      child.material.metalness = 0.3;
      child.material.roughness = 0.5;
      child.material.needsUpdate = true;
    }
  });

  let count = 10;
  for (let i = 0; i < count; i += 1) {
    const angle = Math.PI * 2 * (i / count) + 0.9;
    const radius = 8;

    const logoModelClone = logoModel.clone();
    logoModelClone.position.set(
      (0.5 - Math.random()) * 1,
      0.5 - Math.random() * 3 + 1,
      (0.5 - Math.random()) * 1
    );
    logoModelClone.position.x = radius * Math.cos(angle);
    logoModelClone.position.z = radius * Math.sin(angle);
    logoModelClone.lookAt(new THREE.Vector3(0, logoModelClone.position.y, 0));

    // Add random rotation speed
    const randomSpeed = Math.random() * 0.01 + 0.01;
    const direction = Math.random() > 0.5 ? 1 : -1;
    rotationSpeeds.push(randomSpeed * direction);

    logoModelArray.push(logoModelClone);
    logoModelGroup.add(logoModelClone);
  }
  logoModelGroup.position.z = 6;

  // Cylinder background
  scene_.add(meshCylinder);
  // S-3D Logo
  scene_.add(logoModelGroup);
}

export function updateBackground(yScrollPosition, pointerCoords, deltaTime) {
  // Update Cylinder Bakcground
  const factorRotation = 0.01;
  meshCylinder.rotation.y = yScrollPosition * factorRotation;
  meshCylinder.position.x = -pointerCoords.x * 0.07;
  meshCylinder.position.y = -pointerCoords.y * 0.07;

  // Update S-3D Logo
  logoModelGroup.rotation.y = yScrollPosition * 0.5;
  logoModelGroup.position.x = -pointerCoords.x * 0.2;
  logoModelGroup.position.y = -pointerCoords.y * 0.2;

  logoModelArray.forEach((logoModel, index) => {
    logoModel.rotation.z += rotationSpeeds[index] * deltaTime * 10;
  });
}

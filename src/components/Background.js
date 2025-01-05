import * as THREE from "three";

// <<<< CUBES >>>>
const geometryCubes = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const materialCubes = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 0.7,
  roughness: 0.9,
});
let newCubes = [];
let meshCubeArray = [];
let rotationSpeeds = [];

let count = 20;
for (let i = 0; i < count; i += 1) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 8;
  newCubes.push({
    key: "instance_" + Math.random(),
    position: [
      (0.5 - Math.random()) * 1,
      0.5 - Math.random() * 2,
      (0.5 - Math.random()) * 1,
    ],
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    rotation: [Math.random() * 0.1, 0.5 - Math.random(), 0.5 - Math.random()],
  });
}

const cubeGroup = new THREE.Group();
newCubes.forEach((cube) => {
  const randomSpeed = Math.random() * 0.01 + 0.01;
  const direction = Math.random() > 0.5 ? 1 : -1;
  const meshCube = new THREE.Mesh(geometryCubes, materialCubes);

  // Set position and rotation
  meshCube.position.set(...cube.position);
  meshCube.rotation.set(...cube.rotation);
  meshCube.translateX(cube.x);
  meshCube.translateZ(cube.y);

  // Random rotation speed
  rotationSpeeds.push(randomSpeed * direction);

  meshCubeArray.push(meshCube);
  cubeGroup.add(meshCube);
});
cubeGroup.position.z = 6;

// <<<< CYLINDER BACKGROUND >>>>
// Texture Cylinbder Loader
function nameBoundaryTexture(name) {
  const loader = new THREE.TextureLoader();
  return loader.load(`./texture/TilesMosaicPennyround001/${name}.png`);
}
const colorTexture = nameBoundaryTexture("TilesMosaicPennyround001_COL_1K");
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
  const repeat = 1.5;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = repeat * 37;
  texture.repeat.y = repeat;
};
repeatGorundTextures(colorTexture);
repeatGorundTextures(displacementTexture);
repeatGorundTextures(normalTexture);
repeatGorundTextures(roughnessTexture);
repeatGorundTextures(aoTexture);
repeatGorundTextures(bumpTexture);

// Mesh Cylinder Geometry
const geometry = new THREE.CylinderGeometry(30, 30, 5, 100, 100);
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
meshCylinder.rotation.z = THREE.MathUtils.degToRad(-5);
meshCylinder.position.z = 27;

export function getBackground(scene) {
  // Cylinder background
  scene.add(meshCylinder);
  // Cubes
  scene.add(cubeGroup);
}

export function updateBackground(yScrollPosition, pointerCoords, deltaTime) {
  const factorRotation = 0.01;
  meshCylinder.rotation.y = yScrollPosition * factorRotation;
  meshCylinder.position.x = -pointerCoords.x * 0.02;
  meshCylinder.position.y = -pointerCoords.y * 0.02;

  // Update Cubes
  cubeGroup.rotation.y = yScrollPosition * 0.5;
  cubeGroup.position.x = -pointerCoords.x * 0.1;
  cubeGroup.position.y = -pointerCoords.y * 0.1;

  meshCubeArray.forEach((meshCube, index) => {
    meshCube.rotation.y += rotationSpeeds[index] * deltaTime * 10;
    meshCube.rotation.z += rotationSpeeds[index] * deltaTime * 10;
    meshCube.rotation.x += rotationSpeeds[index] * deltaTime * 10;
  });
}

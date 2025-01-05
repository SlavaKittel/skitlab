import * as THREE from "three";
import vertexShader from "./../shaders/vertex.glsl?raw";
import fragmentShader from "./../shaders/fragment.glsl?raw";

// Props and variables
let newImagesMesh = [];
let newPlanesMesh = [];
let scene;
let camera;
let renderer;
let mouseBall;
let indexOfImage = 0;
let pointerCoords = new THREE.Vector2();

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const images = ["/img/test1.jpg", "/img/test2.webp", "/img/test3.jpg"];
const textureImages = images.map((src) => textureLoader.load(src));

// Marker
const marker = new THREE.Mesh(
  new THREE.SphereGeometry(0.03, 16, 8),
  new THREE.MeshBasicMaterial({ color: "red", wireframe: true })
);
// scene.add(marker);

// Helped Planes
const planeGroup = new THREE.Group();
const planes = [
  { color: "red", x: 1.2 },
  { color: "green", x: 0 },
  { color: "violet", x: -1.2 },
];
planes.forEach((plane, index) => {
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 80, 80),
    new THREE.MeshBasicMaterial({ color: plane.color, wireframe: true })
  );
  planeMesh.position.x = plane.x;
  planeMesh.userData.index = index;
  planeGroup.add(planeMesh);
  newPlanesMesh.push(planeMesh);
});

// Raycaster
const raycaster = new THREE.Raycaster();
function renderIntersects() {
  if (!planeGroup) return;
  raycaster.setFromCamera(pointerCoords, camera);
  const intersectsImages = raycaster.intersectObjects(newImagesMesh);
  const intersects = raycaster.intersectObjects([planeGroup]);
  let pickObject;
  if (intersects.length) {
    let { x, y, z } = intersects[0].point;
    const markerX = x - intersects[0].object.position.x
    const markerY = y - intersects[0].object.position.y
    const markerZ = z - intersects[0].object.position.z
    marker.position.set(markerX, markerY, markerZ);

    // Assignment prop index of the Helped Plane
    pickObject = intersects[0].object;
    indexOfImage = pickObject.userData.index;
  }
  // TODO add links
  if (intersectsImages.length) {
    mouseBall.style.width = "50px";
    mouseBall.style.height = "50px";
    mouseBall.style.background = "#E3E8F2";
    mouseBall.style.color = "#ff004d";
    // console.log(pickObject.userData.index)
  } else if (!intersectsImages.length) {
    mouseBall.style.width = "20px";
    mouseBall.style.height = "20px";
    mouseBall.style.background = "#000000";
    mouseBall.style.color = "transparent";
    // console.log('No Intersects')
  }
  renderer.render(scene, camera);
}

export function getImages(_scene, _camera, _renderer, _mouseBall) {
  scene = _scene;
  camera = _camera;
  renderer = _renderer;
  mouseBall = _mouseBall;

  // need for logic
  scene.add(planeGroup);
  planeGroup.visible = false;

  textureImages.map((texture) => {
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
        uMousePos: { value: new THREE.Vector3() },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(mesh);
    newImagesMesh.push(mesh);
    return mesh;
  });
}

export function updateImages(yScrollPosition, _pointerCoords) {
  pointerCoords = _pointerCoords;
  window.requestAnimationFrame(renderIntersects);

  const yScrollForEach = (index) => {
    const range = 3.76;
    const sizeBetweenfactor = 1.25;
    const sizeBetweenImages = index * sizeBetweenfactor;
    const loopRange =
      ((((-yScrollPosition - sizeBetweenImages) % range) + range) % range) -
      range / 2;
    return loopRange;
  };

  // Update Helped Planes
  newPlanesMesh.forEach((planeMesh, index) => {
    // Update rotation and position based on scroll
    planeMesh.position.z =
      -(
        Math.PI -
        Math.sqrt(Math.pow(yScrollForEach(index), 2) + Math.pow(Math.PI, 2))
      ) * 2;
    planeMesh.rotation.z = Math.PI / 2;
    planeMesh.rotation.y = -yScrollForEach(index) / 1.9;
    planeMesh.position.x = yScrollForEach(index);
    planeMesh.position.y = -Math.pow(2.0, yScrollForEach(index) * 5 - 14) * 300;
  });

  // Update Images
  newImagesMesh.forEach((imageMesh, index) => {
    if (index === indexOfImage)
      imageMesh.material.uniforms.uMousePos.value.copy(marker.position.clone());

    // Update Each Images
    imageMesh.material.uniforms.uYScrollPosition.value = yScrollForEach(index);
    // Update the uniforms for Roll Up and Roll Down
    if (yScrollForEach(index) >= 0) {
      imageMesh.material.uniforms.uProgress.value = -yScrollForEach(index) + 1.2;
      imageMesh.material.uniforms.uAngle.value = 0;
    }
    if (yScrollForEach(index) < 0) {
      imageMesh.material.uniforms.uProgress.value = yScrollForEach(index) + 1.2;
      imageMesh.material.uniforms.uAngle.value = Math.PI / 2;
    }

    // Update rotation and position based on scroll
    imageMesh.position.z =
      -(
        Math.PI -
        Math.sqrt(Math.pow(yScrollForEach(index), 2) + Math.pow(Math.PI, 2))
      ) * 2;
    imageMesh.rotation.z = Math.PI / 2;
    imageMesh.rotation.y = -yScrollForEach(index) / 1.9;
    imageMesh.position.x = yScrollForEach(index);
    imageMesh.position.y = -Math.pow(2.0, yScrollForEach(index) * 5 - 14) * 300;
  });
}

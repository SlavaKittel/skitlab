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
let indexOfImageArray = [];
let pointerCoords = new THREE.Vector2();

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const images = ["/img/test1.jpg", "/img/test2.webp", "/img/test3.jpg"];
const textureImages = images.map((src) => textureLoader.load(src));

// Markers for bell shape effect
const markerCount = images.length;
const markers = [];
Array.from({ length: markerCount }).forEach((_, index) => {
  const getColor = () => {
    if (index === 0) return "red";
    if (index === 1) return "green";
    if (index === 2) return "violet";
  };
  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 16, 8),
    new THREE.MeshBasicMaterial({ color: getColor() })
  );
  markers.push(marker);
});

// Helped Planes
const planeGroup = new THREE.Group();
const planes = [{ color: "red" }, { color: "green" }, { color: "violet" }];
planes.forEach((plane, index) => {
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 2.5, 80, 80),
    new THREE.MeshBasicMaterial({ color: plane.color, wireframe: true })
  );
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
  if (intersects.length) {
    // Assignment prop index of the Helped Plane
    indexOfImageArray = intersects.map((intersect) => {
      const { index } = intersect.object.userData;
      const marker = markers[index];
      if (marker) {
        let { x, y, z } = intersect.point;
        const markerX = x - intersect.object.position.x;
        const markerY = y - intersect.object.position.y;
        const markerZ = z - intersect.object.position.z;
        marker.position.set(markerX, markerY, markerZ);
      }
      return index;
    });
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

  // Need for intersect with helped planes for bell shape effect
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
        uMousePos: { value: new THREE.Vector3(-1, 1, 0) },
        uIsMouse: { value: false },
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

  // Infinity loop scroll usign percentage
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
    // Update Markers position for each Image
    if (indexOfImageArray.includes(index) && markers[index]) {
      imageMesh.material.uniforms.uMousePos.value.copy(
        markers[index].position.clone()
      );
    }
    console.log(imageMesh.material.uniforms.uMousePos.value);

    // Update Each Images
    imageMesh.material.uniforms.uYScrollPosition.value = yScrollForEach(index);
    // Update the uniforms for Roll Up and Roll Down
    if (yScrollForEach(index) >= 0) {
      imageMesh.material.uniforms.uProgress.value =
        -yScrollForEach(index) + 1.2;
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

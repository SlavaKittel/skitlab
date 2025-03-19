import * as THREE from "three";
import vertexShader from "./../shaders/vertex.glsl?raw";
import fragmentShader from "./../shaders/fragment.glsl?raw";
import { scrollYForEach } from "../utils/helped";
import { state } from "../store/store";
import { isMobile } from "../utils/helped";

// Props and variables
let newImagesMesh = [];
let newPlanesMesh = [];
let newMousePlanesMesh = [];
let imagesMeshIntersectIndex = null;
let scene;
let camera;
let renderer;
let mouseBall;
let indexOfImageArray = [];
let pointerCoords = new THREE.Vector2();

// Video Texture
// TODO change component on Videos or something
const videos = ["/video/skit1.mp4", "/video/skit2.mp4", "/video/skit3.mp4"];
const videoTextures = videos.map((src) => {
  const video = document.createElement("video");
  video.src = src;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.play().catch((error) => {
    console.error(`Error playing video ${src}:`, error);
  });

  // Create a VideoTexture for this video
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;

  return videoTexture;
});

// Markers for bell shape effect
const markerCount = videos.length;
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

// Helped Mouse Planes
const mousePlaneGroup = new THREE.Group();
const mousePlanes = [{ color: "red" }, { color: "green" }, { color: "violet" }];
mousePlanes.forEach((plane, index) => {
  const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 80, 80),
    new THREE.MeshBasicMaterial({ color: plane.color, wireframe: true })
  );
  planeMesh.userData.index = index;
  mousePlaneGroup.add(planeMesh);
  newMousePlanesMesh.push(planeMesh);
});

// Links
const urls = ["https://google.com", "https://example.com", "https://mail.com"];
window.addEventListener("click", () => {
  if (state.isOpenAboutUs) return;
  if (imagesMeshIntersectIndex !== null && urls[imagesMeshIntersectIndex]) {
    window.open(urls[imagesMeshIntersectIndex], "_blank");
  }
});

// Raycaster
const raycaster = new THREE.Raycaster();
function renderIntersects() {
  if (!planeGroup) return;
  raycaster.setFromCamera(pointerCoords, camera);
  const intersectsImages = raycaster.intersectObjects(newMousePlanesMesh);
  const intersectsHelpedPlanes = raycaster.intersectObjects([planeGroup]);
  if (intersectsHelpedPlanes.length) {
    // Assignment prop index of the Helped Plane
    indexOfImageArray = intersectsHelpedPlanes.map((intersect) => {
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
  if (intersectsImages.length && !state.isOpenAboutUs && !isMobile()) {
    mouseBall.style.width = "55px";
    mouseBall.style.height = "55px";
    mouseBall.style.background = "unset";
    mouseBall.querySelector("img").style.opacity = 1;
    imagesMeshIntersectIndex = intersectsImages[0].object.userData.index;
  } else if (!intersectsImages.length && !isMobile()) {
    mouseBall.style.width = "20px";
    mouseBall.style.height = "20px";
    mouseBall.style.background = "#ffffff3e";
    mouseBall.querySelector("img").style.opacity = 0;
    imagesMeshIntersectIndex = null;
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

  // Need for mouse click, avoid complex caluclation for raycast
  scene.add(mousePlaneGroup);
  mousePlaneGroup.visible = false;

  videoTextures.forEach((texture, index) => {
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 80, 80);
    const planeMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      uniforms: {
        uTexture: { value: texture },
        uAngle: { value: 0 },
        uProgress: { value: 0 },
        uMousePos: { value: new THREE.Vector3(-1, 1, 0) },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.userData.index = index;

    scene.add(mesh);
    newImagesMesh.push(mesh);
  });
}

// Update function
export function updateImages(currentScrollY, _pointerCoords) {
  pointerCoords = _pointerCoords;
  window.requestAnimationFrame(renderIntersects);

  // Update Helped Planes
  newPlanesMesh.forEach((planeMesh, index) => {
    const scrollY = scrollYForEach(index, currentScrollY);

    // Update rotation and position based on scroll
    planeMesh.position.z =
      -(Math.PI - Math.sqrt(Math.pow(scrollY, 2) + Math.pow(Math.PI, 2))) * 2;
    planeMesh.rotation.z = Math.PI / 2;
    planeMesh.rotation.y = -scrollY / 1.9;
    planeMesh.position.x = scrollY;
    planeMesh.position.y = -Math.pow(2.0, scrollY * 5 - 14) * 300;
  });

  // Update Helped Planes for Mouse
  newMousePlanesMesh.forEach((planeMesh, index) => {
    const scrollY = scrollYForEach(index, currentScrollY);
    const width = planeMesh.geometry.parameters.width;
    const height = planeMesh.geometry.parameters.height;
    let scaleY = 1;
    let scaleX = 1;
    const range = 1.14;
    const normalizedValueY = 1 - -scrollY / range;
    const normalizedValueX = 1 + -scrollY / range;

    // Update scale based on scroll
    if (scrollY < 0) scaleY = 1 - Math.pow(1 - normalizedValueY, 2.4);
    if (scrollY < -range) scaleY = 0;
    if (scrollY > 0) scaleX = 1 - Math.pow(1 - normalizedValueX, 2.5);
    planeMesh.scale.y = scaleY;
    planeMesh.scale.x = scaleX;

    // Update rotation and position based on scroll
    planeMesh.position.z =
      -(Math.PI - Math.sqrt(Math.pow(scrollY, 2) + Math.pow(Math.PI, 2))) * 2;
    planeMesh.rotation.z = Math.PI / 2;
    planeMesh.rotation.y = -scrollY / 1.9;
    planeMesh.position.x = scrollY - (1 - scaleY) * width * 0.5;
    planeMesh.position.y =
      -Math.pow(2.0, scrollY * 5 - 14) * 300 - (1 - scaleX) * height * 0.5;
  });

  // Update Images
  newImagesMesh.forEach((imageMesh, index) => {
    const scrollY = scrollYForEach(index, currentScrollY);

    // Update Mouse position or marker position
    if (indexOfImageArray.includes(index) && markers[index]) {
      imageMesh.material.uniforms.uMousePos.value.copy(
        markers[index].position.clone()
      );
    }

    // Adjust scroll-based parameters
    if (scrollY >= 0) {
      imageMesh.material.uniforms.uProgress.value = -scrollY + 1.2;
      imageMesh.material.uniforms.uAngle.value = 0;
    }
    if (scrollY < 0) {
      imageMesh.material.uniforms.uProgress.value = scrollY + 1.2;
      imageMesh.material.uniforms.uAngle.value = Math.PI / 2;
    }

    // Update image mesh position based on scroll
    imageMesh.position.z =
      -(Math.PI - Math.sqrt(Math.pow(scrollY, 2) + Math.pow(Math.PI, 2))) * 2;
    imageMesh.rotation.z = Math.PI / 2;
    imageMesh.rotation.y = -scrollY / 1.9;
    imageMesh.position.x = scrollY;
    imageMesh.position.y = -Math.pow(2.0, scrollY * 5 - 14) * 300;
  });
}

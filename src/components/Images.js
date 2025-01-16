import * as THREE from "three";
import vertexShader from "./../shaders/vertex.glsl?raw";
import fragmentShader from "./../shaders/fragment.glsl?raw";
import { scrollYForEach } from "../utils/helped";

// Props and variables
let newImagesMesh = [];
let newPlanesMesh = [];
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

// Links
const urls = ["https://google.com", "https://example.com", "https://mail.com"];
window.addEventListener("click", () => {
  if (imagesMeshIntersectIndex !== null && urls[imagesMeshIntersectIndex]) {
    window.open(urls[imagesMeshIntersectIndex], "_blank");
  }
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
    mouseBall.style.background = "unset";
    mouseBall.style.color = "#ff004d";
    imagesMeshIntersectIndex = intersectsImages[0].object.userData.index;
  } else if (!intersectsImages.length) {
    mouseBall.style.width = "20px";
    mouseBall.style.height = "20px";
    mouseBall.style.background = "#000000";
    mouseBall.style.color = "transparent";
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

  videoTextures.map((texture, index) => {
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
    mesh.userData.index = index;
    newImagesMesh.push(mesh);
    return mesh;
  });
}

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

  // Update Images
  newImagesMesh.forEach((imageMesh, index) => {
    const scrollY = scrollYForEach(index, currentScrollY);

    // Update Markers position for each Image
    if (indexOfImageArray.includes(index) && markers[index]) {
      imageMesh.material.uniforms.uMousePos.value.copy(
        markers[index].position.clone()
      );
    }

    // Update Each Images
    imageMesh.material.uniforms.uYScrollPosition.value = scrollY;
    // Update the uniforms for Roll Up and Roll Down
    if (scrollY >= 0) {
      imageMesh.material.uniforms.uProgress.value = -scrollY + 1.2;
      imageMesh.material.uniforms.uAngle.value = 0;
    }
    if (scrollY < 0) {
      imageMesh.material.uniforms.uProgress.value = scrollY + 1.2;
      imageMesh.material.uniforms.uAngle.value = Math.PI / 2;
    }

    // Update rotation and position based on scroll
    imageMesh.position.z =
      -(Math.PI - Math.sqrt(Math.pow(scrollY, 2) + Math.pow(Math.PI, 2))) * 2;
    imageMesh.rotation.z = Math.PI / 2;
    imageMesh.rotation.y = -scrollY / 1.9;
    imageMesh.position.x = scrollY;
    imageMesh.position.y = -Math.pow(2.0, scrollY * 5 - 14) * 300;
  });
}

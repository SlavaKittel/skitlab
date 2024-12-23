import * as THREE from "three";
import vertexShader from "./../shaders/vertex.glsl?raw";
import fragmentShader from "./../shaders/fragment.glsl?raw";

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const images = ["/img/test1.jpg", "/img/test2.webp", "/img/test3.jpg"];
const textureImages = images.map((src) => textureLoader.load(src));

let newImagesMesh = [];

export function getImages(scene) {
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

export function updateImages(yScrollPosition) {
  newImagesMesh.forEach((imageMesh, index) => {
    const yScrollForEach = () => {
      const range = 3.76;
      const sizeBetweenfactor = 1.25;
      const sizeBetweenImages = index * sizeBetweenfactor;
      const loopRange =
        ((((yScrollPosition - sizeBetweenImages) % range) + range) % range) -
        range / 2;
      return loopRange;
    };

    // Update Each Images
    imageMesh.material.uniforms.uYScrollPosition.value = yScrollForEach();
    // Update the uniforms for Roll Up and Roll Down
    if (yScrollForEach() >= 0) {
      imageMesh.material.uniforms.uProgress.value = -yScrollForEach() + 1.2;
      imageMesh.material.uniforms.uAngle.value = 0;
    }
    if (yScrollForEach() < 0) {
      imageMesh.material.uniforms.uProgress.value = yScrollForEach() + 1.2;
      imageMesh.material.uniforms.uAngle.value = Math.PI / 2;
    }

    // Update rotation and position based on scroll
    imageMesh.position.z =
      -(
        Math.PI -
        Math.sqrt(Math.pow(yScrollForEach(), 2) + Math.pow(Math.PI, 2))
      ) * 2;
    imageMesh.rotation.z = Math.PI / 2;
    imageMesh.rotation.y = -yScrollForEach() / 1.9;
  });
}

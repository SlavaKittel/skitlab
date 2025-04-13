import * as THREE from "three";
import { scrollYForEach } from "../utils/helped";

let newLightArray = [];
export function getLights(scene) {
  const lights = [
    { color: 0xffffff, intensivity: 1 },
    { color: 0xffffff, intensivity: 1 },
    { color: 0xffffff, intensivity: 1 },
  ];
  lights.forEach((light) => {
    const pointLight = new THREE.PointLight(
      light.color,
      light.intensivity,
      400
    );
    newLightArray.push(pointLight);
    scene.add(pointLight);
  });
}

export function updateLights(currentScrollY) {
  newLightArray.forEach((light, index) => {
    const scrollY = scrollYForEach(index, currentScrollY);
    const normalizedValue = (scrollY + 1.87) / 3.76;
    function easeInQuart(x) {
      return x === 1 ? 1 : 1 - Math.pow(2, -5 * x);
    }
    const easedValue = easeInQuart(normalizedValue);
    const newScorllY = easedValue * 3.76 - 1.87;

    light.position.x = newScorllY * 4.2 - 5.1;
    light.position.y = -Math.pow(2, scrollY * 7 - 12) * 100;
    light.position.z = -2.5;
  });
}

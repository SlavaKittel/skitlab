import { breakpoints } from "./mixin";
import { eventBus } from "../store/store";

const { mobile } = breakpoints;

document.getElementById("burgerMenuBtn").addEventListener("click", () => {
  const burgeMenuSvg = document.getElementById("burgeMenuSvg");
  burgeMenuSvg.classList.toggle("active");
  const burgerMenuContent = document.getElementById("burgerMenuContent");
  burgerMenuContent.classList.toggle("active");
});

window.addEventListener("resize", () => {
  // TODO add check if menu is open
  if (window.innerWidth > mobile) {
    burgeMenuSvg.classList.remove("active");
    burgerMenuContent.classList.remove("active");
  }
});

// TODO maybe for best performance we can move logic in click listener to the top
const canvasApp = document.getElementById("app");
eventBus.addEventListener("menuToggle", (event) => {
  if (event.detail) {
    canvasApp.classList.add("blur-active");
  } else {
    canvasApp.classList.remove("blur-active");
  }
});

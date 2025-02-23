import {
  eventBus,
  toggleAboutUsState,
  toggleMenuState,
  state,
} from "../store/store";

import { breakpoints } from "./mixin";

// Constants
let isMobile = window.innerWidth < breakpoints.tablet;
const burgerMenuBtn = document.getElementById("burgerMenuBtn");
const burgerMenuSvg = document.getElementById("burgerMenuSvg");
const burgerMenuContent = document.getElementById("burgerMenuContent");
const canvasApp = document.getElementById("app");
const aboutUsPage = document.getElementById("aboutUsPage");
const aboutUsBtns = document.querySelectorAll(".about-us-btn");
const aboutUsBtn = document.getElementById("aboutUsBtn");

function toggleBurgerMenu() {
  burgerMenuSvg.classList.toggle("active");
  burgerMenuContent.classList.toggle("active");
}

window.addEventListener("resize", () => {
  isMobile = window.innerWidth < breakpoints.tablet;
});

// Burger Menu State
burgerMenuBtn.addEventListener("click", () => {
  toggleMenuState();
  toggleBurgerMenu();
});

// About Us State
aboutUsBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!state.isOpenAboutUs && isMobile) {
      toggleAboutUsState();
      toggleMenuState();
      toggleBurgerMenu();
    } else if (state.isOpenAboutUs && isMobile) {
      toggleMenuState();
      toggleBurgerMenu();
    } else {
      toggleAboutUsState();
    }
  });
});

// Event Bus About Us and Burger Menu Toggle
eventBus.addEventListener("aboutUsToggle", (event) => {
  if (event.detail) {
    aboutUsPage.style.display = "block";
    aboutUsBtn.classList.add("active");
    document.body.appendChild(aboutUsPage);
    requestAnimationFrame(() => {
      aboutUsPage.classList.add("active"); // Trigger the animation!! (best solution)
    });
  } else {
    aboutUsPage.classList.remove("active");
    aboutUsBtn.classList.remove("active");
    setTimeout(() => {
      if (aboutUsPage.parentNode && !aboutUsPage.classList.contains("active")) {
        aboutUsPage.style.display = "none";
        aboutUsPage.parentNode.removeChild(aboutUsPage);
      }
    }, 300);
  }
});
// TODO delete from DOM burgerMenuContent??
eventBus.addEventListener("menuToggle", (event) => {
  if (event.detail) {
    canvasApp.classList.add("blur-active");
    aboutUsPage.classList.add("blur-active");
  } else {
    canvasApp.classList.remove("blur-active");
    aboutUsPage.classList.remove("blur-active");
  }
});

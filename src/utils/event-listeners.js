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
const mouseBall = document.querySelector(".mouse-ball");
const portfolioBtns = document.querySelectorAll(".portfolio-btn");
const portfolioBtn = document.getElementById("portfolioBtn");
const hoveredBtns = document.querySelectorAll(
  ".contact-us-btn, .social-btn, .about-us-btn, .logo, .portfolio-btn"
);
const contactUsBtns = document.querySelectorAll(".contact-us-btn");
const linkedin = document.getElementById("linkedin");
const linktree = document.getElementById("linktree");
const mainLogo = document.getElementById("mainLogo");

function toggleBurgerMenu() {
  burgerMenuSvg.classList.toggle("active");
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

// Desktop Portofolio button
portfolioBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleAboutUsState();
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
eventBus.addEventListener("menuToggle", (event) => {
  if (event.detail) {
    canvasApp.classList.add("blur-active");
    aboutUsPage.classList.add("blur-active");
    document.body.appendChild(burgerMenuContent);
    requestAnimationFrame(() => {
      burgerMenuContent.classList.add("active");
    });
  } else {
    canvasApp.classList.remove("blur-active");
    aboutUsPage.classList.remove("blur-active");
    burgerMenuContent.classList.remove("active");
    setTimeout(() => {
      if (burgerMenuContent.parentNode && !burgerMenuContent.classList.contains("active")) {
        burgerMenuContent.parentNode.removeChild(burgerMenuContent);
      }
    }, 2000);
  }
});

// Buttons mouse custom cursor pointer
hoveredBtns.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    mouseBall.classList.add("hovered");
  });
  btn.addEventListener("mouseleave", () => {
    mouseBall.classList.remove("hovered");
  });
});

// Hovered buttons
function socialBtnHovered(e) {
  e.addEventListener("mouseenter", () => {
    e.style.background = "var(--red)";
    e.style.border = "1px solid var(--red)";
  });
  e.addEventListener("mouseleave", () => {
    e.style.background = "unset";
    e.style.border = "1px solid var(--gray)";
  });
}
socialBtnHovered(linkedin);
socialBtnHovered(linktree);
socialBtnHovered(portfolioBtn);

aboutUsBtn.addEventListener("mouseenter", () => {
  aboutUsBtn.style.color = "var(--redHover)";
});
aboutUsBtn.addEventListener("mouseleave", () => {
  aboutUsBtn.style.color = "var(--bright)";
});

contactUsBtns.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    btn.style.background = "var(--redHover)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.background = "var(--red)";
  });
});

mainLogo.addEventListener("mouseenter", () => {
  mainLogo.src = 'img/skit-logo-red.svg';
});
mainLogo.addEventListener("mouseleave", () => {
  mainLogo.src = 'img/skit-logo.svg';
});

import {
  eventBus,
  toggleAboutUsState,
  toggleMenuState,
  state,
  setHasTouched,
} from "../store/store";

import { isMobile, calculateAndSetAngle } from "./helped";

import { breakpoints } from "./mixin";

// Constants
let isMobileTablet = window.innerWidth < breakpoints.tablet;
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
const portfolioBtnSpecial = document.getElementById("portfolioBtnSpecial");
const welcomeBlock = document.getElementById("welcomeBlock");
const descriptionBlock = document.getElementById("descriptionBlock");
const hoveredBtns = document.querySelectorAll(
  ".contact-us-btn, .social-btn, .about-us-btn, .logo, .portfolio-btn"
);
const contactUsBtns = document.querySelectorAll(".contact-us-btn");
const linkedin = document.getElementById("linkedin");
const linktree = document.getElementById("linktree");
const mainLogo = document.getElementById("mainLogo");
const textScroll = document.getElementById("textScroll");
const textClick = document.getElementById("textClick");

function toggleBurgerMenu() {
  burgerMenuSvg.classList.toggle("active");
}

window.addEventListener("resize", () => {
  isMobileTablet = window.innerWidth < breakpoints.tablet;
});

// Burger Menu State
burgerMenuBtn.addEventListener("click", () => {
  toggleMenuState();
  toggleBurgerMenu();
});

// About Us State
aboutUsBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!state.isOpenAboutUs && isMobileTablet) {
      toggleAboutUsState();
      toggleMenuState();
      toggleBurgerMenu();
    } else if (state.isOpenAboutUs && isMobileTablet) {
      toggleMenuState();
      toggleBurgerMenu();
    } else {
      toggleAboutUsState();
    }
  });
});

// Portofolio button toggle
portfolioBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleAboutUsState();
  });
});

// Portofolio button specail toggle
portfolioBtnSpecial.addEventListener("click", () => {
  toggleMenuState();
  toggleBurgerMenu();
  toggleAboutUsState({ forceClose: true });
});

// Event Bus About Us and Burger Menu Toggle
eventBus.addEventListener("aboutUsToggle", (event) => {
  if (event.detail) {
    aboutUsPage.style.display = "block";
    aboutUsBtn.classList.add("active");
    document.body.appendChild(aboutUsPage);
    requestAnimationFrame(() => {
      aboutUsPage.classList.add("active"); // Trigger the animation!! (best solution)
      calculateAndSetAngle(welcomeBlock, "--welcomeAngle");
      calculateAndSetAngle(descriptionBlock, "--descriptionAngle");
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
burgerMenuContent.parentNode.removeChild(burgerMenuContent);
eventBus.addEventListener("menuToggle", (event) => {
  if (event.detail) {
    canvasApp.classList.add("blur-active");
    aboutUsPage.classList.add("blur-active");
    aboutUsPage.style.pointerEvents = "none";
    document.body.appendChild(burgerMenuContent);
    requestAnimationFrame(() => {
      burgerMenuContent.classList.add("active");
    });
  } else {
    canvasApp.classList.remove("blur-active");
    aboutUsPage.classList.remove("blur-active");
    aboutUsPage.style.pointerEvents = "all";
    burgerMenuContent.classList.remove("active");
    setTimeout(() => {
      if (
        burgerMenuContent.parentNode &&
        !burgerMenuContent.classList.contains("active")
      ) {
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
if (!isMobile()) {
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
    mainLogo.src = "img/skit-logo-red.svg";
  });
  mainLogo.addEventListener("mouseleave", () => {
    mainLogo.src = "img/skit-logo.svg";
  });
}

// Mouse Ball hide on mobile
document.body.appendChild(mouseBall);
if (isMobile()) {
  mouseBall.parentNode.removeChild(mouseBall);
  mouseBall.style.display = "none";
}

// Footer mobile text
if (isMobile()) {
  textScroll.style.opacity = 1;
  window.addEventListener("touchmove", () => {
    textScroll.style.opacity = 0;
    setHasTouched(true);
  });
} else {
  textScroll.style.display = "none";
  textClick.style.display = "none";
}

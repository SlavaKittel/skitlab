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
  ".contact-us-btn, .social-btn, .about-us-btn, .main-logo, .portfolio-btn"
);
const contactUsBtns = document.querySelectorAll(".contact-us-btn");
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
    aboutUsBtn.classList.add("active");
    aboutUsPage.classList.add("active");
    calculateAndSetAngle(descriptionBlock, "--descriptionAngle");
    calculateAndSetAngle(welcomeBlock, "--welcomeAngle");
  } else {
    aboutUsPage.classList.remove("active");
    aboutUsBtn.classList.remove("active");
  }
});
burgerMenuContent.parentNode.removeChild(burgerMenuContent);
eventBus.addEventListener("menuToggle", (event) => {
  if (event.detail) {
    canvasApp.classList.add("blur-active");
    aboutUsPage.classList.add("blur-active");
    textScroll.classList.add("blur-active");
    textClick.classList.add("blur-active");
    aboutUsPage.style.pointerEvents = "none";
    document.body.appendChild(burgerMenuContent);
    requestAnimationFrame(() => {
      burgerMenuContent.classList.add("active");
    });
  } else {
    canvasApp.classList.remove("blur-active");
    aboutUsPage.classList.remove("blur-active");
    textScroll.classList.remove("blur-active");
    textClick.classList.remove("blur-active");
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
  function socialBtnHovered(name) {
    const imgElement = document.getElementById(`${name}`);
    const srcElement = document.getElementById(`${name}Img`);

    imgElement.addEventListener("mouseenter", () => {
      imgElement.style.background = "var(--primaryHover)";
      imgElement.style.border = "1px solid var(--primaryHover)";
      srcElement.src = `img/${name}.svg`;
    });

    imgElement.addEventListener("mouseleave", () => {
      imgElement.style.background = "unset";
      imgElement.style.border = "1px solid var(--primaryPressed)";
      srcElement.src = `img/${name}-gradient.svg`;
    });
  }
  socialBtnHovered('linkedin');
  socialBtnHovered('linktree');

  portfolioBtn.addEventListener("mouseenter", () => {
    portfolioBtn.style.background = "var(--primaryHover)";
    portfolioBtn.style.border = "1px solid var(--primaryHover)";

    portfolioBtn.firstElementChild.style.background = "var(--background)";
    portfolioBtn.firstElementChild.style.backgroundClip = "text";
    portfolioBtn.firstElementChild.style.color = "transparent";
  
  });
  portfolioBtn.addEventListener("mouseleave", () => {
    portfolioBtn.style.background = "transparent";
    portfolioBtn.style.border = "1px solid var(--primaryPressed)";

    portfolioBtn.firstElementChild.style.background = "var(--primaryGradient)";
    portfolioBtn.firstElementChild.style.backgroundClip = "text";
    portfolioBtn.firstElementChild.style.color = "transparent";
  });

  aboutUsBtn.addEventListener("mouseenter", () => {
    aboutUsBtn.style.background = "var(--primaryHover)";
    aboutUsBtn.style.backgroundClip = "text";
  });
  aboutUsBtn.addEventListener("mouseleave", () => {
    aboutUsBtn.style.background = "var(--primaryGradient)";
    aboutUsBtn.style.backgroundClip = "text";
  });

  contactUsBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.background = "var(--primaryHover)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "var(--primaryGradient)";
    });
  });

  mainLogo.addEventListener("mouseenter", () => {
    mainLogo.src = "img/skit-logo-gradient.svg";
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

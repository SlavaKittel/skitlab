import { breakpoints } from "./mixin";
const { mobile } = breakpoints;

document.getElementById("burgerMenu").addEventListener("click", () => {
  const burgeMenuSvg = document.getElementById("burgeMenuSvg");
  burgeMenuSvg.classList.toggle("active");
  const burgerMenuContent = document.getElementById("burgerMenuContent");
  burgerMenuContent.classList.toggle("active");
});

window.addEventListener("resize", () => {
  if (window.innerWidth > mobile) {
    burgeMenuSvg.classList.remove("active");
    burgerMenuContent.classList.remove("active");
  }
});

//  Minimal Global State

// isOpenMenu
export const eventBus = new EventTarget();
export const state = {
    isOpenMenu: false,
    isOpenAboutUs: false,
  };

export function toggleMenuState() {
  state.isOpenMenu = !state.isOpenMenu;
  eventBus.dispatchEvent(new CustomEvent("menuToggle", { detail: state.isOpenMenu }));
}
export function toggleAboutUsState({ forceClose = false} = {}) {
  state.isOpenAboutUs = forceClose ? false : !state.isOpenAboutUs;
  eventBus.dispatchEvent(new CustomEvent("aboutUsToggle", { detail: state.isOpenAboutUs }));
}


// hasTouch
export let hasTouched = false;
export function setHasTouched(value) {
  hasTouched = value;
}

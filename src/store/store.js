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
export function toggleAboutUsState() {
  state.isOpenAboutUs = !state.isOpenAboutUs;
  eventBus.dispatchEvent(new CustomEvent("aboutUsToggle", { detail: state.isOpenAboutUs }));
}

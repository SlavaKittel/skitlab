//  Minimal Global State
export const eventBus = new EventTarget();
export const state = {
    isOpenMenu: false
  };

export function toggleMenuState() {
  state.isOpenMenu = !state.isOpenMenu;
  eventBus.dispatchEvent(new CustomEvent("menuToggle", { detail: state.isOpenMenu }));
}

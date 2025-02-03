// TODO add isMobile
export function isMobile() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

// TODO need to choose a better fuction
export function isMobileOrTablet() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const userAgent = navigator.userAgent.toLowerCase();

  return isTouchDevice && (userAgent.includes('android') || userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('mobile') || userAgent.includes('tablet'));
}

export function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export function scrollYForEach(index, currentScrollY) {
  const range = 3.76;
  const sizeBetweenfactor = 1.25;
  const sizeBetweenImages = index * sizeBetweenfactor;
  const loopRange =
    ((((-currentScrollY - sizeBetweenImages) % range) + range) % range) -
    range / 2;
  return loopRange;
}

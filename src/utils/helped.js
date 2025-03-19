// TODO need to choose a better fuction
export function isMobile() {
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

export function calculateAndSetAngle(element, propertyName) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const angleInRadians = Math.atan2(rect.height, rect.width);
  const angleInDegrees = angleInRadians * (180 / Math.PI);
  const flippedAngleInDegrees = 180 - angleInDegrees;
  document.documentElement.style.setProperty(
    propertyName,
    `${flippedAngleInDegrees}deg`
  );
}

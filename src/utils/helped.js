// TODO add isMobile
export function isMobile() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
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

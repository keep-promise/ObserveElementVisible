export interface observerObj {
  observe: (el: HTMLElement) => any
  unobserve: (el: HTMLElement) => any
}
export interface CheckInviewOptions {
  preLoad: number
  preLoadTop: number
}
export function ObserveElementVisible(
  el: HTMLElement,
  callback: (visible: boolean) => any,
  options: CheckInviewOptions
): observerObj {
  let observerObj
  const hasObserver = checkIntersectionObserver()
  if (hasObserver) {
    observerObj = new window.IntersectionObserver((entries) => {
      callback(!isHidden(el) && checkInView(entries[0].boundingClientRect, options))
    })
  } else {
    let throttleFn = throttle(callback, 200)
    let eventFn = (e: Event) => throttleFn(!isHidden(el) && checkInView(getRect(el), options))
    observerObj = {
      observe(el: HTMLElement) {
        // 立即触发一次
        callback(isHidden(el) && checkInView(getRect(el), options))
        window.addEventListener('scroll', eventFn)
      },
      unobserve() {
        window.removeEventListener('scroll', eventFn)
      }
    }
  }
  observerObj.unobserve(el)
  observerObj.observe(el)
  return observerObj
}

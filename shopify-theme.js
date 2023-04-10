var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};


// js/common/behavior/custom-cursor.js
var _abortController, _onPointerLeave, onPointerLeave_fn, _onPointerMove, onPointerMove_fn;
var CustomCursor = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onPointerLeave);
    __privateAdd(this, _onPointerMove);
    __privateAdd(this, _abortController, void 0);
  }
  connectedCallback() {
    __privateSet(this, _abortController, new AbortController());
    this.parentElement.addEventListener("pointermove", __privateMethod(this, _onPointerMove, onPointerMove_fn).bind(this), { passive: true, signal: __privateGet(this, _abortController).signal });
    this.parentElement.addEventListener("pointerleave", __privateMethod(this, _onPointerLeave, onPointerLeave_fn).bind(this), { signal: __privateGet(this, _abortController).signal });
  }
  disconnectedCallback() {
    __privateGet(this, _abortController).abort();
  }
};
_abortController = new WeakMap();
_onPointerLeave = new WeakSet();
onPointerLeave_fn = function() {
  this.classList.remove("is-visible", "is-half-start", "is-half-end");
};
_onPointerMove = new WeakSet();
onPointerMove_fn = function(event) {
  if (event.target.matches("button, a[href], button :scope, a[href] :scope")) {
    return this.classList.remove("is-visible");
  }
  const parentBoundingRect = this.parentElement.getBoundingClientRect(), parentXCenter = (parentBoundingRect.left + parentBoundingRect.right) / 2, isOnStartHalfPart = event.pageX < parentXCenter;
  this.classList.toggle("is-half-start", isOnStartHalfPart);
  this.classList.toggle("is-half-end", !isOnStartHalfPart);
  this.classList.add("is-visible");
  const mouseY = event.clientY - parentBoundingRect.y - this.clientHeight / 2, mouseX = event.clientX - parentBoundingRect.x - this.clientWidth / 2;
  this.style.translate = `${mouseX.toFixed(3)}px ${mouseY.toFixed(3)}px`;
  this.style.transform = `${mouseX.toFixed(3)}px ${mouseY.toFixed(3)}px`;
};
if (!window.customElements.get("custom-cursor")) {
  window.customElements.define("custom-cursor", CustomCursor);
}

// js/common/behavior/gesture-area.js
var _domElement, _thresholdDistance, _thresholdTime, _signal, _firstClientX, _tracking, _start, _touchStart, touchStart_fn, _preventTouch, preventTouch_fn, _gestureStart, gestureStart_fn, _gestureMove, gestureMove_fn, _gestureEnd, gestureEnd_fn;
var GestureArea = class {
  constructor(domElement, { thresholdDistance = 80, thresholdTime = 500, signal = null } = {}) {
    __privateAdd(this, _touchStart);
    __privateAdd(this, _preventTouch);
    __privateAdd(this, _gestureStart);
    __privateAdd(this, _gestureMove);
    __privateAdd(this, _gestureEnd);
    __privateAdd(this, _domElement, void 0);
    __privateAdd(this, _thresholdDistance, void 0);
    __privateAdd(this, _thresholdTime, void 0);
    __privateAdd(this, _signal, void 0);
    __privateAdd(this, _firstClientX, void 0);
    __privateAdd(this, _tracking, false);
    __privateAdd(this, _start, {});
    __privateSet(this, _domElement, domElement);
    __privateSet(this, _thresholdDistance, thresholdDistance);
    __privateSet(this, _thresholdTime, thresholdTime);
    __privateSet(this, _signal, signal);
    __privateGet(this, _domElement).addEventListener("touchstart", __privateMethod(this, _touchStart, touchStart_fn).bind(this), { passive: true, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("touchmove", __privateMethod(this, _preventTouch, preventTouch_fn).bind(this), { passive: false, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerdown", __privateMethod(this, _gestureStart, gestureStart_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointermove", __privateMethod(this, _gestureMove, gestureMove_fn).bind(this), { passive: false, signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerup", __privateMethod(this, _gestureEnd, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointerleave", __privateMethod(this, _gestureEnd, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
    __privateGet(this, _domElement).addEventListener("pointercancel", __privateMethod(this, _gestureEnd, gestureEnd_fn).bind(this), { signal: __privateGet(this, _signal) });
  }
};
_domElement = new WeakMap();
_thresholdDistance = new WeakMap();
_thresholdTime = new WeakMap();
_signal = new WeakMap();
_firstClientX = new WeakMap();
_tracking = new WeakMap();
_start = new WeakMap();
_touchStart = new WeakSet();
touchStart_fn = function(event) {
  __privateSet(this, _firstClientX, event.touches[0].clientX);
};
_preventTouch = new WeakSet();
preventTouch_fn = function(event) {
  if (Math.abs(event.touches[0].clientX - __privateGet(this, _firstClientX)) > 10) {
    event.preventDefault();
  }
};
_gestureStart = new WeakSet();
gestureStart_fn = function(event) {
  __privateSet(this, _tracking, true);
  __privateSet(this, _start, {
    time: (/* @__PURE__ */ new Date()).getTime(),
    x: event.clientX,
    y: event.clientY
  });
};
_gestureMove = new WeakSet();
gestureMove_fn = function(event) {
  if (__privateGet(this, _tracking)) {
    event.preventDefault();
  }
};
_gestureEnd = new WeakSet();
gestureEnd_fn = function(event) {
  if (!__privateGet(this, _tracking)) {
    return;
  }
  __privateSet(this, _tracking, false);
  const now = (/* @__PURE__ */ new Date()).getTime(), deltaTime = now - __privateGet(this, _start).time, deltaX = event.clientX - __privateGet(this, _start).x, deltaY = event.clientY - __privateGet(this, _start).y;
  if (deltaTime > __privateGet(this, _thresholdTime)) {
    return;
  }
  let matchedEvent;
  if (deltaX === 0 && deltaY === 0 && !event.target.matches("a, button, a :scope, button :scope")) {
    matchedEvent = "tap";
  } else if (deltaX > __privateGet(this, _thresholdDistance) && Math.abs(deltaY) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swiperight";
  } else if (-deltaX > __privateGet(this, _thresholdDistance) && Math.abs(deltaY) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipeleft";
  } else if (deltaY > __privateGet(this, _thresholdDistance) && Math.abs(deltaX) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipedown";
  } else if (-deltaY > __privateGet(this, _thresholdDistance) && Math.abs(deltaX) < __privateGet(this, _thresholdDistance)) {
    matchedEvent = "swipeup";
  }
  if (matchedEvent) {
    __privateGet(this, _domElement).dispatchEvent(new CustomEvent(matchedEvent, { bubbles: true, composed: true, detail: { originalEvent: event } }));
  }
};

// js/common/behavior/height-observer.js
var HeightObserver = class extends HTMLElement {
  constructor() {
    super();
    if (window.ResizeObserver) {
      new ResizeObserver(this._updateCustomProperties.bind(this)).observe(this);
    }
  }
  connectedCallback() {
    if (!window.ResizeObserver) {
      document.documentElement.style.setProperty(`--${this.getAttribute("variable")}-height`, `${this.clientHeight.toFixed(1)}px`);
    }
  }
  _updateCustomProperties(entries) {
    requestAnimationFrame(() => {
      entries.forEach((entry) => {
        if (entry.target === this) {
          const height = entry.borderBoxSize ? entry.borderBoxSize.length > 0 ? entry.borderBoxSize[0].blockSize : entry.borderBoxSize.blockSize : entry.target.clientHeight;
          document.documentElement.style.setProperty(`--${this.getAttribute("variable")}-height`, `${Math.round(height)}px`);
        }
      });
    });
  }
};
if (!window.customElements.get("height-observer")) {
  window.customElements.define("height-observer", HeightObserver);
}

// js/common/behavior/safe-sticky.js
import { inView as inView2 } from "//cdn.shopify.com/s/files/1/0595/8290/6521/t/11/assets/vendor.min.js?v=136053555471622566971680660743";
var _resizeObserver, _checkPositionListener, _initialTop, _lastKnownY, _currentTop, _position, _recalculateStyles, recalculateStyles_fn, _checkPosition, checkPosition_fn;
var SafeSticky = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _recalculateStyles);
    __privateAdd(this, _checkPosition);
    __privateAdd(this, _resizeObserver, new ResizeObserver(__privateMethod(this, _recalculateStyles, recalculateStyles_fn).bind(this)));
    __privateAdd(this, _checkPositionListener, throttle(__privateMethod(this, _checkPosition, checkPosition_fn).bind(this)));
    __privateAdd(this, _initialTop, 0);
    __privateAdd(this, _lastKnownY, 0);
    /* we could initialize it to window.scrollY but this avoids a costly reflow */
    __privateAdd(this, _currentTop, 0);
    __privateAdd(this, _position, "relative");
  }
  connectedCallback() {
    inView2(this, () => {
      __privateGet(this, _resizeObserver).observe(this);
      window.addEventListener("scroll", __privateGet(this, _checkPositionListener));
      return () => {
        __privateGet(this, _resizeObserver).unobserve(this);
        window.removeEventListener("scroll", __privateGet(this, _checkPositionListener));
      };
    }, { margin: "500px" });
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", __privateGet(this, _checkPositionListener));
  }
};
_resizeObserver = new WeakMap();
_checkPositionListener = new WeakMap();
_initialTop = new WeakMap();
_lastKnownY = new WeakMap();
_currentTop = new WeakMap();
_position = new WeakMap();
_recalculateStyles = new WeakSet();
recalculateStyles_fn = function() {
  this.style.removeProperty("top");
  const computedStyles = getComputedStyle(this);
  __privateSet(this, _initialTop, parseInt(computedStyles.top));
  __privateSet(this, _position, computedStyles.position);
  __privateMethod(this, _checkPosition, checkPosition_fn).call(this);
};
_checkPosition = new WeakSet();
checkPosition_fn = function() {
  if (__privateGet(this, _position) !== "sticky") {
    return this.style.removeProperty("top");
  }
  let bounds = this.getBoundingClientRect(), maxTop = bounds.top + window.scrollY - this.offsetTop + __privateGet(this, _initialTop), minTop = this.clientHeight - window.innerHeight + 20;
  if (window.scrollY < __privateGet(this, _lastKnownY)) {
    __privateSet(this, _currentTop, __privateGet(this, _currentTop) - (window.scrollY - __privateGet(this, _lastKnownY)));
  } else {
    __privateSet(this, _currentTop, __privateGet(this, _currentTop) + (__privateGet(this, _lastKnownY) - window.scrollY));
  }
  __privateSet(this, _currentTop, Math.min(Math.max(__privateGet(this, _currentTop), -minTop), maxTop, __privateGet(this, _initialTop)));
  __privateSet(this, _lastKnownY, window.scrollY);
  this.style.top = `${Math.round(__privateGet(this, _currentTop))}px`;
};
if (!window.customElements.get("safe-sticky")) {
  window.customElements.define("safe-sticky", SafeSticky);
}

// js/common/behavior/scroll-area.js
var ScrollArea = class {
  constructor(element, abortController2 = null) {
    this._element = element;
    this._allowTriggerNearingStartEvent = false;
    this._allowTriggerLeavingStartEvent = true;
    this._allowTriggerNearingEndEvent = true;
    this._allowTriggerLeavingEndEvent = false;
    new ResizeObserver(throttle(this._checkIfScrollable.bind(this))).observe(element);
    this._element.addEventListener("scroll", throttle(this._onScroll.bind(this)), { signal: abortController2?.signal });
  }
  get scrollNearingThreshold() {
    return 125;
  }
  get scrollDirection() {
    if (this._element.scrollWidth > this._element.clientWidth) {
      return "inline";
    } else if (this._element.scrollHeight > this._element.clientHeight) {
      return "block";
    } else {
      return "none";
    }
  }
  _checkIfScrollable() {
    this._element.classList.toggle("is-scrollable", this.scrollDirection !== "none");
  }
  _onScroll() {
    clearTimeout(this._scrollTimeout);
    this._lastScrollPosition = this._lastScrollPosition ?? (this.scrollDirection === "inline" ? Math.abs(this._element.scrollLeft) : Math.abs(this._element.scrollTop));
    let direction;
    if (this.scrollDirection === "inline") {
      direction = this._lastScrollPosition > Math.abs(this._element.scrollLeft) ? "start" : "end";
      this._lastScrollPosition = Math.abs(this._element.scrollLeft);
    } else {
      direction = this._lastScrollPosition > Math.abs(this._element.scrollTop) ? "start" : "end";
      this._lastScrollPosition = Math.abs(this._element.scrollTop);
    }
    const scrollPosition = Math.round(Math.abs(this.scrollDirection === "inline" ? this._element.scrollLeft : this._element.scrollTop)), scrollMinusSize = Math.round(this.scrollDirection === "inline" ? this._element.scrollWidth - this._element.clientWidth : this._element.scrollHeight - this._element.clientHeight);
    if (direction === "start" && this._allowTriggerNearingStartEvent && scrollPosition <= this.scrollNearingThreshold) {
      this._allowTriggerNearingStartEvent = false;
      this._allowTriggerLeavingStartEvent = true;
      this._element.dispatchEvent(new CustomEvent("scroll:edge-nearing", { bubbles: true, detail: { position: "start" } }));
    } else if (direction === "end" && scrollPosition > this.scrollNearingThreshold) {
      this._allowTriggerNearingStartEvent = true;
      if (this._allowTriggerLeavingStartEvent) {
        this._allowTriggerLeavingStartEvent = false;
        this._element.dispatchEvent(new CustomEvent("scroll:edge-leaving", { bubbles: true, detail: { position: "start" } }));
      }
    }
    if (direction === "end" && this._allowTriggerNearingEndEvent && scrollMinusSize <= scrollPosition + this.scrollNearingThreshold) {
      this._allowTriggerNearingEndEvent = false;
      this._allowTriggerLeavingEndEvent = true;
      this._element.dispatchEvent(new CustomEvent("scroll:edge-nearing", { bubbles: true, detail: { position: "end" } }));
    } else if (direction === "start" && scrollMinusSize > scrollPosition + this.scrollNearingThreshold) {
      this._allowTriggerNearingEndEvent = true;
      if (this._allowTriggerLeavingEndEvent) {
        this._allowTriggerLeavingEndEvent = false;
        this._element.dispatchEvent(new CustomEvent("scroll:edge-leaving", { bubbles: true, detail: { position: "end" } }));
      }
    }
    if (window.onscrollend === void 0) {
      this._scrollTimeout = setTimeout(() => {
        this._element.dispatchEvent(new CustomEvent("scrollend", { bubbles: true, composed: true }));
      }, 75);
    }
  }
};

// js/common/behavior/scroll-progress.js
var ScrollProgress = class extends HTMLElement {
  connectedCallback() {
    this.scrolledElement.addEventListener("scroll", throttle(this._updateScrollProgress.bind(this)));
    if (window.ResizeObserver) {
      new ResizeObserver(this._updateScrollProgress.bind(this)).observe(this.scrolledElement);
    }
  }
  get scrolledElement() {
    return this._scrolledElement = this._scrolledElement || document.getElementById(this.getAttribute("observes"));
  }
  _updateScrollProgress() {
    const scrollLeft = document.dir === "ltr" ? this.scrolledElement.scrollLeft : Math.abs(this.scrolledElement.scrollLeft), advancement = (scrollLeft + this.scrolledElement.clientWidth) / this.scrolledElement.scrollWidth;
    this.style.setProperty("--scroll-progress", Math.max(0, Math.min(advancement, 1)).toFixed(6));
  }
};
if (!window.customElements.get("scroll-progress")) {
  window.customElements.define("scroll-progress", ScrollProgress);
}

// js/common/behavior/scroll-shadow.js
var template = `
  <style>
    :host {
      display: inline-block;
      contain: layout;
      position: relative;
    }
    
    :host([hidden]) {
      display: none;
    }
    
    s {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: none;
      background-image:
        var(--scroll-shadow-top, linear-gradient(to bottom, rgb(var(--background)), rgb(var(--background) / 0))),
        var(--scroll-shadow-bottom, linear-gradient(to top, rgb(var(--background)), rgb(var(--background) / 0))),
        var(--scroll-shadow-left, linear-gradient(to right, rgb(var(--background)), rgb(var(--background) / 0))),
        var(--scroll-shadow-right, linear-gradient(to left, rgb(var(--background)), rgb(var(--background) / 0)));
      background-position: top, bottom, left, right;
      background-repeat: no-repeat;
      background-size: 100% var(--top, 0), 100% var(--bottom, 0), var(--left, 0) 100%, var(--right, 0) 100%;
    }
  </style>
  <slot></slot>
  <s></s>
`;
var Updater = class {
  constructor(targetElement) {
    this.scheduleUpdate = throttle(() => this.update(targetElement, getComputedStyle(targetElement)));
    this.resizeObserver = new ResizeObserver(this.scheduleUpdate.bind(this));
  }
  start(element) {
    if (this.element) {
      this.stop();
    }
    if (element) {
      element.addEventListener("scroll", this.scheduleUpdate);
      this.resizeObserver.observe(element);
      this.element = element;
    }
  }
  stop() {
    if (!this.element) {
      return;
    }
    this.element.removeEventListener("scroll", this.scheduleUpdate);
    this.resizeObserver.unobserve(this.element);
    this.element = null;
  }
  update(targetElement, style) {
    if (!this.element) {
      return;
    }
    const maxSize = style.getPropertyValue("--scroll-shadow-size") ? parseInt(style.getPropertyValue("--scroll-shadow-size")) : 0;
    const scroll2 = {
      top: Math.max(this.element.scrollTop, 0),
      bottom: Math.max(this.element.scrollHeight - this.element.offsetHeight - this.element.scrollTop, 0),
      left: Math.max(this.element.scrollLeft, 0),
      right: Math.max(this.element.scrollWidth - this.element.offsetWidth - this.element.scrollLeft, 0)
    };
    requestAnimationFrame(() => {
      for (const position of ["top", "bottom", "left", "right"]) {
        targetElement.style.setProperty(
          `--${position}`,
          `${scroll2[position] > maxSize ? maxSize : scroll2[position]}px`
        );
      }
    });
  }
};
var ScrollShadow = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = template;
    this.updater = new Updater(this.shadowRoot.lastElementChild);
  }
  connectedCallback() {
    this.shadowRoot.querySelector("slot").addEventListener("slotchange", this.start);
    this.start();
  }
  disconnectedCallback() {
    this.updater.stop();
  }
  start() {
    if (this.firstElementChild) {
      this.updater.start(this.firstElementChild);
    }
  }
};
if ("ResizeObserver" in window && !window.customElements.get("scroll-shadow")) {
  window.customElements.define("scroll-shadow", ScrollShadow);
}

// js/common/carousel/effect-carousel.js
import { timeline as timeline3, inView as inView3 } from "//cdn.shopify.com/s/files/1/0595/8290/6521/t/11/assets/vendor.min.js?v=136053555471622566971680660743";

// js/common/carousel/base-carousel.js
var BaseCarousel = class extends HTMLElement {
  connectedCallback() {
    this._abortController = new AbortController();
    this._reloaded = false;
    if (Shopify.designMode) {
      this.closest(".shopify-section").addEventListener("shopify:section:select", (event) => this._reloaded = event.detail.load);
    }
    if (this.items.length > 1) {
      if (Shopify.designMode) {
        this.addEventListener("shopify:block:select", (event) => this.select(this.items.indexOf(event.target), { animate: !event.detail.load }));
      }
      if (this.hasAttribute("adaptive-height")) {
        this.addEventListener("carousel:settle", this._adjustHeight);
        this._adjustHeight();
      }
      this.addEventListener("carousel:select", this._preloadImages, { signal: this._abortController.signal });
      this.addEventListener("carousel:filter", this._filterItems, { signal: this._abortController.signal });
      this.addEventListener("control:prev", this.previous, { signal: this._abortController.signal });
      this.addEventListener("control:next", this.next, { signal: this._abortController.signal });
      this.addEventListener("control:select", (event) => this.select(event.detail.index), { signal: this._abortController.signal });
    }
    if (this.selectedIndex === 0) {
      this._dispatchEvent("carousel:select", 0);
    } else {
      this.select(this.selectedIndex, { animate: false, force: true });
    }
  }
  disconnectedCallback() {
    this._abortController.abort();
  }
  get items() {
    if (this.hasAttribute("reversed")) {
      return this._items = this._items || Array.from(this.hasAttribute("selector") ? this.querySelectorAll(this.getAttribute("selector")) : this.children).reverse();
    } else {
      return this._items = this._items || Array.from(this.hasAttribute("selector") ? this.querySelectorAll(this.getAttribute("selector")) : this.children);
    }
  }
  get visibleItems() {
    return this.items.filter((item) => item.offsetParent !== null);
  }
  get selectedIndex() {
    return this._selectedIndex = this._selectedIndex ?? parseInt(this.getAttribute("initial-index") || 0);
  }
  get selectedIndexAmongVisible() {
    return this.visibleItems.indexOf(this.selectedSlide);
  }
  get loop() {
    return false;
  }
  get selectedSlide() {
    return this.items[this.selectedIndex];
  }
  get previousSlide() {
    return this.visibleItems[this.loop ? (this.selectedIndexAmongVisible - 1 + this.visibleItems.length) % this.visibleItems.length : Math.max(this.selectedIndexAmongVisible - 1, 0)];
  }
  get nextSlide() {
    return this.visibleItems[this.loop ? (this.selectedIndexAmongVisible + 1 + this.visibleItems.length) % this.visibleItems.length : Math.min(this.selectedIndexAmongVisible + 1, this.visibleItems.length - 1)];
  }
  previous(animate11 = true) {
    this.select(this.items.indexOf(this.previousSlide), { direction: "previous", animate: animate11 });
  }
  next(animate11 = true) {
    this.select(this.items.indexOf(this.nextSlide), { direction: "next", animate: animate11 });
  }
  _transitionTo(fromSlide, toSlide, options = {}) {
  }
  _adjustHeight() {
    if (this.hasAttribute("adaptive-height") && this.selectedSlide.clientHeight !== this.clientHeight) {
      this.style.maxHeight = `${this.selectedSlide.clientHeight}px`;
    }
  }
  _filterItems(event) {
    this.items.forEach((item, index) => item.hidden = event.detail.filteredIndexes.includes(index));
  }
  _preloadImages() {
    [this.previousSlide, this.nextSlide].forEach((item) => {
      if (item) {
        Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach((img) => img.setAttribute("loading", "eager"));
      }
    });
  }
  _dispatchEvent(eventName, index) {
    this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: { slide: this.items[index], index } }));
  }
};

// js/common/carousel/effect-carousel.js
var EffectCarousel = class extends BaseCarousel {
  connectedCallback() {
    super.connectedCallback();
    if (this.items.length > 1) {
      if (this.swipeable) {
        new GestureArea(this, { signal: this._abortController.signal });
        this.addEventListener("swipeleft", this.next, { signal: this._abortController.signal });
        this.addEventListener("swiperight", this.previous, { signal: this._abortController.signal });
      }
      if (this.hasAttribute("autoplay")) {
        this._player = new Player(this.getAttribute("autoplay"));
        this._player.addEventListener("player:end", this.next.bind(this));
        inView3(this, () => this._player.resume(true));
        if (Shopify.designMode) {
          this.addEventListener("shopify:block:select", () => this._player.stop(), { signal: this._abortController.signal });
          this.addEventListener("shopify:block:deselect", () => this._player.start(), { signal: this._abortController.signal });
        }
      }
    }
  }
  get player() {
    return this._player;
  }
  get loop() {
    return true;
  }
  get swipeable() {
    return this.getAttribute("swipeable") !== "false";
  }
  async select(index, { direction, animate: animate11 = true } = {}) {
    const indexBeforeChange = this.selectedIndex;
    this._selectedIndex = index;
    this._dispatchEvent("carousel:select", index);
    if (!direction) {
      direction = index > indexBeforeChange ? "next" : "previous";
    }
    if (index !== indexBeforeChange) {
      const [fromSlide, toSlide] = [this.items[indexBeforeChange], this.items[index]];
      this._dispatchEvent("carousel:change", index);
      this.player?.pause();
      await this._transitionTo(fromSlide, toSlide, { direction, animate: animate11 });
      this.player?.resume(true);
      this._dispatchEvent("carousel:settle", index);
    }
  }
  /**
   * Perform a simple fade animation. For more complex animations, you should implement your own custom elements
   * that extends the EffectCarousel, and implement your own transition. You should make sure to return a promise
   * that resolves when the animation is finished
   */
  _transitionTo(fromSlide, toSlide, { direction = "next", animate: animate11 = true } = {}) {
    fromSlide.classList.remove("is-selected");
    toSlide.classList.add("is-selected");
    const timelineControls = timeline3([
      [fromSlide, { opacity: [1, 0], visibility: ["visible", "hidden"], zIndex: 0 }, { zIndex: { easing: "step-end" } }],
      [toSlide, { opacity: [0, 1], visibility: ["hidden", "visible"], zIndex: 1 }, { at: "<", zIndex: { easing: "step-end" } }]
    ], { duration: animate11 ? 0.3 : 0 });
    return timelineControls.finished;
  }
};
if (!window.customElements.get("effect-carousel")) {
  window.customElements.define("effect-carousel", EffectCarousel);
}

// js/common/carousel/scroll-carousel.js
var ScrollCarousel = class extends BaseCarousel {
  constructor() {
    super();
    if (window.ResizeObserver) {
      new ResizeObserver(throttle(this._adjustHeight.bind(this))).observe(this);
    }
  }
  connectedCallback() {
    this._hasPendingProgrammaticScroll = false;
    this._scrollArea = new ScrollArea(this, this._abortController);
    super.connectedCallback();
    this.addEventListener("scroll", throttle(this._onCarouselScroll.bind(this)), { signal: this._abortController.signal });
    this.addEventListener("scrollend", this._onScrollSettled, { signal: this._abortController.signal });
  }
  get itemOffset() {
    return this.visibleItems.length < 2 ? 0 : this.visibleItems[1].offsetLeft - this.visibleItems[0].offsetLeft;
  }
  get slidesPerPage() {
    return this.visibleItems.length < 2 ? 1 : Math.floor((this.clientWidth - this.visibleItems[0].offsetLeft) / (Math.abs(this.itemOffset) - (parseInt(getComputedStyle(this).gap) || 0)));
  }
  get totalPages() {
    return this.visibleItems.length < 2 ? 1 : this.visibleItems.length - this.slidesPerPage + 1;
  }
  select(index, { animate: animate11 = true, force = false } = {}) {
    const indexBeforeChange = this.selectedIndex;
    if (!this.offsetParent || this._scrollArea.scrollDirection === "none") {
      return this._selectedIndex = index;
    }
    const indexAmongVisible = this.visibleItems.indexOf(this.items[index]);
    index = this.items.indexOf(this.visibleItems[Math.min(this.totalPages, indexAmongVisible)]);
    this._selectedIndex = index;
    this._dispatchEvent("carousel:select", index);
    if (index !== indexBeforeChange || force) {
      const [fromSlide, toSlide] = [this.items[indexBeforeChange], this.items[index]];
      this._dispatchEvent("carousel:change", index);
      this._transitionTo(fromSlide, toSlide, { animate: animate11 });
    }
  }
  /**
   * Transition using the scrollTo method. To prevent the intersection observer to caught up the change, we set up
   * a "hasPendingProgrammaticScroll" variable to true, that is set back to false once the scroll has settled
   */
  _transitionTo(fromSlide, toSlide, { animate: animate11 = true } = {}) {
    fromSlide.classList.remove("is-selected");
    toSlide.classList.add("is-selected");
    let slideAlign = this._extractSlideAlign(toSlide), scrollAmount = 0;
    switch (slideAlign) {
      case "start":
        scrollAmount = this.itemOffset * this.visibleItems.indexOf(toSlide);
        break;
      case "center":
        scrollAmount = toSlide.offsetLeft - (this.clientWidth / 2 - (parseInt(getComputedStyle(this).scrollPaddingInline) || 0)) + toSlide.clientWidth / 2;
        break;
    }
    this._hasPendingProgrammaticScroll = animate11;
    this.scrollTo({ left: scrollAmount, behavior: animate11 ? "smooth" : "auto" });
  }
  /**
   * Update the index when manually scrolling (which allows to update the controls)
   */
  _onCarouselScroll() {
    if (this._hasPendingProgrammaticScroll || this._scrollArea.scrollDirection === "none") {
      return;
    }
    const newIndex = this.items.indexOf(this.visibleItems[Math.round(this.scrollLeft / this.itemOffset)]);
    if (newIndex !== this.selectedIndex) {
      this._selectedIndex = newIndex;
      this._dispatchEvent("carousel:select", this.selectedIndex);
      this._dispatchEvent("carousel:change", this.selectedIndex);
    }
  }
  /**
   * On the scroll has settled we dispatch the event (which covers both programmatic scroll and swipe)
   */
  _onScrollSettled() {
    this._hasPendingProgrammaticScroll = false;
    this._dispatchEvent("carousel:settle", this.selectedIndex);
  }
  _adjustHeight() {
    this.style.maxHeight = null;
    if (this._scrollArea.scrollDirection !== "none") {
      super._adjustHeight();
    }
  }
  _extractSlideAlign(slide) {
    return getComputedStyle(slide).scrollSnapAlign === "center" ? "center" : "start";
  }
};
if (!window.customElements.get("scroll-carousel")) {
  window.customElements.define("scroll-carousel", ScrollCarousel);
}



// js/common/animation/heading.js
import { stagger as stagger2 } from "//cdn.shopify.com/s/files/1/0595/8290/6521/t/11/assets/vendor.min.js?v=136053555471622566971680660743";
function getHeadingKeyframe(element, options = {}) {
  if (!element) {
    return [];
  }
  const splitLines = element.querySelector("split-lines")?.lines;
  if (window.themeVariables.settings.headingApparition === "fade" || !splitLines) {
    return [element, { opacity: [0, 1] }, { duration: 0.2, ...options }];
  } else {
    element.style.opacity = "1";
    switch (window.themeVariables.settings.headingApparition) {
      case "split_fade":
        return [splitLines, { transform: ["translateY(0.5em)", "translateY(0)"], opacity: [0, 1] }, { duration: 0.3, delay: stagger2(0.1), ...options }];
      case "split_clip":
        return [splitLines, { clipPath: ["inset(0 0 100% 0)", "inset(0 0 -0.3em 0)"], transform: ["translateY(100%)", "translateY(0)"], opacity: [0, 1] }, { duration: 0.7, delay: stagger2(0.15), easing: [0.22, 1, 0.36, 1], ...options }];
      case "split_rotation":
        const rotatedSpans = splitLines.map((line) => line.querySelector("span"));
        rotatedSpans.forEach((span) => span.style.transformOrigin = "top left");
        splitLines.forEach((line) => line.style.clipPath = "inset(0 0 -0.3em 0)");
        return [rotatedSpans, { transform: ["translateY(0.5em) rotateZ(5deg)", "translateY(0) rotateZ(0)"], opacity: [0, 1] }, { duration: 0.4, delay: stagger2(0.1), ...options }];
    }
  }
}



export {
  CustomCursor,
  EffectCarousel,
  GestureArea,
  HeightObserver,
  SafeSticky,
  ScrollArea,
  getHeadingKeyframe,
  ScrollCarousel,
  ScrollProgress,
  ScrollShadow
};

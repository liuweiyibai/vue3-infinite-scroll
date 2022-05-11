/*!
  * vue3-infinite-scroll v0.0.1
  * (c) 2022 
  * @license MIT
  */
import { nextTick } from 'vue';

const ctx = Symbol('@@InfiniteScroll');

function throttle(func, wait) {
    let timer = null;
    let callbackArgs;
    const context = this;
    const later = () => {
        func.apply(context, callbackArgs);
        timer = null;
    };
    return function (...args) {
        if (!timer) {
            callbackArgs = args;
            timer = setTimeout(later, wait);
        }
    };
}
const getScrollTop = function (element) {
    if (element === window) {
        return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
    }
    return element.scrollTop;
};
const getComputedStyle = document.defaultView.getComputedStyle;
const getScrollEventTarget = function (element) {
    let currentNode = element;
    while (currentNode &&
        currentNode.tagName !== 'HTML' &&
        currentNode.tagName !== 'BODY' &&
        currentNode.nodeType === 1) {
        const overflowY = getComputedStyle(currentNode).overflowY;
        if (overflowY === 'scroll' || overflowY === 'auto') {
            return currentNode;
        }
        currentNode = currentNode.parentNode;
    }
    return window;
};
const getVisibleHeight = function (element) {
    if (element === window) {
        return document.documentElement.clientHeight;
    }
    return element.clientHeight;
};
const getElementTop = function (element) {
    if (element === window) {
        return getScrollTop(window);
    }
    return element.getBoundingClientRect().top + getScrollTop(window);
};
const isAttached = function (element) {
    let currentNode = element.parentNode;
    while (currentNode) {
        if (currentNode.tagName === 'HTML') {
            return true;
        }
        if (currentNode.nodeType === 11) {
            return false;
        }
        currentNode = currentNode.parentNode;
    }
    return false;
};
const doBind = function () {
    if (this.binded)
        return;
    this.binded = true;
    const directive = this;
    const element = directive.el;
    directive.scrollEventTarget = getScrollEventTarget(element);
    directive.scrollListener = throttle(doCheck.bind(directive), directive.throttleDelay);
    directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener);
    if (directive.immediateCheck) {
        doCheck.call(directive);
    }
};
const doCheck = function (force) {
    const scrollEventTarget = this.scrollEventTarget;
    const element = this.el;
    const distance = this.distance;
    if (force !== true && this.disabled)
        return;
    const viewportScrollTop = getScrollTop(scrollEventTarget);
    const viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget);
    let shouldTrigger = false;
    if (scrollEventTarget === element) {
        shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance;
    }
    else {
        const elementBottom = getElementTop(element) -
            getElementTop(scrollEventTarget) +
            element.offsetHeight +
            viewportScrollTop;
        shouldTrigger = viewportBottom + distance >= elementBottom;
    }
    if (shouldTrigger && this.expression) {
        this.expression();
    }
};
const Directive = {
    mounted(el, binding) {
        let throttleDelay = binding.value.throttleDelay;
        if (isNaN(throttleDelay) || throttleDelay < 0) {
            throttleDelay = 200;
        }
        let distance = binding.value.distance;
        if (isNaN(distance)) {
            distance = 0;
        }
        let immediateCheck = binding.value.immediateCheck;
        if (typeof immediateCheck !== 'boolean') {
            immediateCheck = true;
        }
        let disabled = binding.value.disabled;
        if (typeof disabled !== 'boolean') {
            disabled = false;
        }
        el[ctx] = {
            el: el,
            expression: binding.value.callback,
            throttleDelay,
            disabled,
            distance,
            immediateCheck,
        };
        nextTick(() => {
            if (isAttached(el)) {
                doBind.call(el[ctx]);
            }
            el[ctx].bindTryCount = 0;
            const tryBind = function () {
                if (el[ctx].bindTryCount > 10)
                    return;
                el[ctx].bindTryCount++;
                if (isAttached(el)) {
                    doBind.call(el[ctx]);
                }
                else {
                    setTimeout(tryBind, 50);
                }
            };
            tryBind();
        });
    },
    updated(el, binding) {
        const directive = el[ctx];
        let disabled = binding.value.disabled;
        if (typeof disabled !== 'boolean') {
            disabled = false;
        }
        if (!disabled && directive.immediateCheck) {
            doCheck.call(directive);
        }
        directive.disabled = disabled;
    },
    unmounted(el) {
        if (el && el[ctx] && el[ctx].scrollEventTarget)
            el[ctx].scrollEventTarget.removeEventListener('scroll', el[ctx].scrollListener);
    },
};

const install = (app) => {
    app.directive('InfiniteScroll', Directive);
};

export { install as default, install };

/* jshint ignore:start */
var infiniteScrollDirective = function($rootScope, $window, $interval, THROTTLE_MILLISECONDS) {
    return {
      scope: {
        infiniteScroll: '&',
        infiniteScrollContainer: '=',
        infiniteScrollDistance: '=',
        infiniteScrollDisabled: '=',
        infiniteScrollUseDocumentBottom: '=',
        infiniteScrollListenForEvent: '@',
      },
      link: function(scope, elem, attrs) {
        var changeContainer, checkInterval, checkWhenEnabled, container, handleInfiniteScrollContainer, handleInfiniteScrollDisabled, handleInfiniteScrollDistance, handleInfiniteScrollUseDocumentBottom, handler, height, immediateCheck, offsetTop, pageYOffset, scrollDistance, scrollEnabled, throttle, unregisterEventListener, useDocumentBottom, windowElement;
        windowElement = angular.element($window);
        scrollDistance = null;
        scrollEnabled = null;
        checkWhenEnabled = null;
        container = null;
        immediateCheck = true;
        useDocumentBottom = false;
        unregisterEventListener = null;
        checkInterval = false;
        height = function(elem) {
          elem = elem[0] || elem;
          if (isNaN(elem.offsetHeight)) {
            return elem.document.documentElement.clientHeight;
          } else {
            return elem.offsetHeight;
          }
        };
        offsetTop = function(elem) {
          if (!elem[0].getBoundingClientRect || elem.css('none')) {
            return;
          }
          return elem[0].getBoundingClientRect().top + pageYOffset(elem);
        };
        pageYOffset = function(elem) {
          elem = elem[0] || elem;
          if (isNaN(window.pageYOffset)) {
            return elem.document.documentElement.scrollTop;
          } else {
            return elem.ownerDocument.defaultView.pageYOffset;
          }
        };
        handler = function() {
          var containerBottom, containerTopOffset, elementBottom, remaining, shouldScroll;
          if (container === windowElement) {
            containerBottom = height(container) + pageYOffset(container[0].document.documentElement);
            elementBottom = offsetTop(elem) + height(elem);
          } else {
            containerBottom = height(container);
            containerTopOffset = 0;
            if (offsetTop(container) !== void 0) {
              containerTopOffset = offsetTop(container);
            }
            elementBottom = offsetTop(elem) - containerTopOffset + height(elem);
          }
          if (useDocumentBottom) {
            elementBottom = height((elem[0].ownerDocument || elem[0].document).documentElement);
          }
          remaining = elementBottom - containerBottom;
          shouldScroll = remaining <= height(container) * scrollDistance + 1;
          if (shouldScroll) {
            checkWhenEnabled = true;
            if (scrollEnabled) {
              if (scope.$$phase || $rootScope.$$phase) {
                return scope.infiniteScroll();
              } else {
                return scope.$apply(scope.infiniteScroll);
              }
            }
          } else {
            if (checkInterval) {
              $interval.cancel(checkInterval);
            }
            checkWhenEnabled = false;
            return checkWhenEnabled;
          }
        };
        throttle = function(func, wait) {
          var later, previous, timeout;
          timeout = null;
          previous = 0;
          later = function() {
            previous = new Date().getTime();
            $interval.cancel(timeout);
            timeout = null;
            return func.call();
          };
          return function() {
            var now, remaining;
            now = new Date().getTime();
            remaining = wait - (now - previous);
            if (remaining <= 0) {
              $interval.cancel(timeout);
              timeout = null;
              previous = now;
              return func.call();
            } else {
              if (!timeout) {
                timeout = $interval(later, remaining, 1);
                return timeout;
              }
            }
          };
        };
        if (THROTTLE_MILLISECONDS !== null) {
          handler = throttle(handler, THROTTLE_MILLISECONDS);
        }
        scope.$on('$destroy', function() {
          container.unbind('scroll', handler);
          if (unregisterEventListener !== null) {
            unregisterEventListener();
            unregisterEventListener = null;
            return unregisterEventListener;
          }
        });
        handleInfiniteScrollDistance = function(v) {
          scrollDistance = parseFloat(v) || 0;
          return scrollDistance;
        };
        scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
        handleInfiniteScrollDistance(scope.infiniteScrollDistance);
        handleInfiniteScrollDisabled = function(v) {
          scrollEnabled = !v;
          if (scrollEnabled && checkWhenEnabled) {
            checkWhenEnabled = false;
            return handler();
          }
        };
        scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
        handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);
        handleInfiniteScrollUseDocumentBottom = function(v) {
          useDocumentBottom = v;
          return useDocumentBottom;
        };
        scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);
        handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);
        changeContainer = function(newContainer) {
          /*jshint unused:true, eqnull:true */
          if (container != null) {
            container.unbind('scroll', handler);
          }
          container = newContainer;
          /*jshint unused:true, eqnull:true */
          if (newContainer != null) {
            return container.bind('scroll', handler);
          }
        };
        changeContainer(windowElement);
        if (scope.infiniteScrollListenForEvent) {
          unregisterEventListener = $rootScope.$on(scope.infiniteScrollListenForEvent, handler);
        }
        handleInfiniteScrollContainer = function(newContainer) {
          /*jshint unused:true, eqnull:true */
          if ((newContainer == null) || newContainer.length === 0) {
            return;
          }
          if (newContainer.nodeType && newContainer.nodeType === 1) {
            newContainer = angular.element(newContainer);
          } else if (typeof newContainer.append === 'function') {
            newContainer = angular.element(newContainer[newContainer.length - 1]);
          } else if (typeof newContainer === 'string') {
            newContainer = angular.element(document.querySelector(newContainer));
          }
          /*jshint unused:true, eqnull:true */
          if (newContainer != null) {
            return changeContainer(newContainer);
          } else {
            throw new Error("invalid infinite-scroll-container attribute.");
          }
        };
        scope.$watch('infiniteScrollContainer', handleInfiniteScrollContainer);
        handleInfiniteScrollContainer(scope.infiniteScrollContainer || []);
        /*jshint unused:true, eqnull:true */
        if (attrs.infiniteScrollParent != null) {
          changeContainer(angular.element(elem.parent()));
        }
        /*jshint unused:true, eqnull:true */
        if (attrs.infiniteScrollImmediateCheck != null) {
          immediateCheck = scope.$eval(attrs.infiniteScrollImmediateCheck);
        }
        checkInterval = $interval((function() {
          if (immediateCheck) {
            handler();
          }
          return $interval.cancel(checkInterval);
        }));
        return checkInterval;
      }
    };
  };
/* jshint ignore:end */
module.exports = infiniteScrollDirective;

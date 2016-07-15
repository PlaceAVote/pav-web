var finishedRenderDirective = function() {
  return {
    priority: -1000,
    restrict: 'A',
    link: function() {
      var readyEvent = new Event('angularReady');
      document.body.dispatchEvent(readyEvent);
    },
  };
};
module.exports = finishedRenderDirective;

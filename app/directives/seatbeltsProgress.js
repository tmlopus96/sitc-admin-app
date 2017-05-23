var app = angular.module('adminApp')

app.directive('sitcSeatbeltProgress', function($log) {
  return {
    restrict: 'E',
    templateUrl: 'app/views/directives/seatbeltProgress.html',
    scope: {
      numSeatbelts: '=',
      numCrew: '=',
      minTeers: '=',
      optimalTeers: '=',
      maxTeers: '='
    },
    link: seatbeltsLink
  }

    function seatbeltsLink (scope, element, attrs, controller) {

      // test values
      scope.min = scope.minTeers
      scope.opt = scope.optimalTeers
      scope.max = scope.maxTeers
      scope.current = scope.numSeatbelts

      $log.log("Current: " + scope.current)

      // width vars
      scope.min_progBarWidth = 0
      scope.min_fillBarWidth = 0
      scope.opt_progBarWidth = 0
      scope.opt_fillBarWidth = 0
      scope.max_progBarWidth = 0
      scope.max_fillBarWidth = 0

      configProgBars()

      scope.$watch(
        function () {
          return scope.numSeatbelts
        },
        function(newVal, oldVal) {
          // $log.log("The seatbelts watch callback ran!")
          scope.current = scope.numSeatbelts
          configProgBars()
        }
      )

      function configProgBars () {
        // -- Prog bars
        scope.min_progBarWidth = (scope.min / scope.max) * 100
        scope.opt_progBarWidth = ((scope.opt - scope.min) / scope.max) * 100
        scope.max_progBarWidth = 100 - (scope.min_progBarWidth + scope.opt_progBarWidth)

        var progBarElems = element.children().first().children().first().next().children()

        progBarElems.first().css({'width':`${scope.min_progBarWidth}%`})
        progBarElems.first().next().css({'width':`${scope.opt_progBarWidth}%`})
        progBarElems.first().next().next().css({'width':`${scope.max_progBarWidth}%`})

        // -- Fill bars
        // min fill bar
        if (scope.current >= scope.min) {
          scope.min_fillBarWidth = 100
        }
        else {
          scope.min_fillBarWidth = (scope.current / scope.min) * 100
        }
        // $log.log("scope.min_fillBarWidth: " + scope.min_fillBarWidth)
        progBarElems.first().find(document.querySelectorAll('.seatbelt-prog-bar-fill')).css({'width': `${scope.min_fillBarWidth}%`})

        // opt fill bar
        if (scope.current >= scope.opt) {
          scope.opt_fillBarWidth = 100
        }
        else {
          scope.opt_fillBarWidth = ((scope.current - scope.min) / (scope.opt - scope.min)) * 100
        }
        progBarElems.first().next().find(document.querySelectorAll('.seatbelt-prog-bar-fill')).css({'width': `${scope.opt_fillBarWidth}%`})

        // max fill bar
        if (scope.current >= scope.max) {
          scope.max_fillBarWidth = 100
        }
        else {
          scope.max_fillBarWidth = ((scope.current - scope.opt) / (scope.max - scope.opt)) * 100
        }
        progBarElems.first().next().next().find(document.querySelectorAll('.seatbelt-prog-bar-fill')).css({'width': `${scope.max_fillBarWidth}%`})
      }
    }
})

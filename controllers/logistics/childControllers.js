var app = angular.module('adminApp')

app.controller('ProjectSiteSelectionController', ['$scope', '$log', '$mdInkRipple', '$mdToast', 'getProjectSites', 'toggleSiteActive', function($scope, $log, $mdInkRipple, $mdToast, getProjectSites, toggleSiteActive) {

  //TEST var
  $scope.foo = ''

  getProjectSites().then(function(sites_result) {
    $scope.projectSites = sites_result
    Object.keys($scope.projectSites).forEach(function(siteId) {
      if ($scope.projectSites[siteId].isActive == '1') {
        $scope.projectSites[siteId].isActive = 1
        $scope.activeSites.push(siteId)
      } else {
        $scope.projectSites[siteId].isActive = 0
      }
    })
  })

  $scope.toggleActive = function(siteId) {
    var togglePromise = toggleSiteActive(siteId, $scope.projectSites[siteId].isActive)
    togglePromise.then(function success() {
        if ($scope.projectSites[siteId].isActive) {
          $scope.activeSites.push(siteId)
        } else {
          var index = $scope.activeSites.indexOf(siteId)
          $scope.activeSites.splice(index, 1)
        }
        $log.log('activeSites: ' + $scope.activeSites.toString())
      }, function failure() {
        $mdToast.show($mdToast.simple().textContent('Failed to update database. Please try again.').highlightClass('md-warn'))
      }
    )


  }

  $scope.inkRipple = function(ev) {
    var row = angular.element(ev.target).parent().parent().parent()
    $mdInkRipple.attach($scope, row, {dimBackground: true})
  }


}])

app.controller('ActiveCrewSelectionController', ['$scope', function($scope) {

}])

app.controller('ActiveGroupsSelectionController', ['$scope', function($scope) {

}])

app.controller('VolunteerCarsAllocationController', ['$scope', function($scope) {

}])

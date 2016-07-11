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

app.controller('ActiveCrewSelectionController', ['$scope', '$log', 'getCrew', function($scope, $log, getCrew) {
  $scope.crew = []
  $scope.selectedCrew = ''

  getCrew().then(function(crew_result) {
    $scope.crew = crew_result
    Object.keys($scope.crew).forEach(function(personId) {
      if ($scope.crew[personId].isOnLogistics == '1') {
        $scope.crew[personId].isOnLogistics = 1
        $scope.activeCrew.push(personId)
      } else {
        $scope.crew[personId].isOnLogistics = 0
      }
    })
  })

  $scope.filterSearch = function(rawQuery) {
    var matches = []
    var query = rawQuery.toLowerCase()
    Object.keys($scope.crew).forEach(function(personId) {
      if ($scope.crew[personId].firstName.toLowerCase().indexOf(query) > -1) {
        matches.push(personId)
      } else if ($scope.crew[personId].lastName.toLowerCase().indexOf(query) > -1 ) {
        matches.push(personId)
      }
    })

    return matches
  }

  $scope.testFunc = function(personId) {
    if (typeof personId !== 'undefined') {
      $log.log('selected ' + $scope.crew[parseInt(personId)].firstName)
      $scope.selectedItem = ''
      $scope.searchText = ''
    }
  }


}])

app.controller('ActiveGroupsSelectionController', ['$scope', function($scope) {

}])

app.controller('VolunteerCarsAllocationController', ['$scope', function($scope) {

}])

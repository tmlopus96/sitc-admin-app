var app = angular.module('adminApp')

app.controller('ProjectSiteSelectionController', ['$scope', '$log', '$mdInkRipple', '$mdToast', 'getProjectSites', 'toggleSiteActive', function($scope, $log, $mdInkRipple, $mdToast, getProjectSites, toggleSiteActive) {

  //TEST var
  $scope.foo = ''

  /*
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
  */

  $scope.toggleActive = function(siteId) {
    var togglePromise = updateActiveCrew(siteId, $scope.projectSites[siteId].isActive)
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

app.controller('ActiveCrewSelectionController', ['$scope', '$log', 'getCrew', 'updateActiveCrew', function($scope, $log, getCrew, updateActiveCrew) {
  $scope.crew = []
  $scope.selectedCrew = ''
  $scope.allCrewIsShowing = false

  getCrew().then(function(crew_result) {
    $scope.crew = crew_result
    Object.keys($scope.crew).forEach(function(personId) {
      $scope.crew[personId].numPassengers = parseInt($scope.crew[personId].numPassengers) //not loading into number input for some reason
      if ($scope.crew[personId].isOnLogistics == '1' || $scope.crew[personId.isOnLogistics == 1]) {
        $scope.crew[personId].isOnLogistics = 1
        $scope.activeCrew.push(parseInt(personId))
      } else {
        $scope.crew[personId].isOnLogistics = 0
      }
    })
  })

  $scope.toggleActive = function(personId, activeStatus) {
    if (typeof personId !== 'undefined') {
      personId = parseInt(personId)
      if (typeof activeStatus === 'undefined') { //activeStatus has been set by checkbox and not passed as a parameter
        activeStatus = $scope.crew[personId].isOnLogistics
      } else { //activeStatus has been passed and isOnLogistics has not been updated
        $scope.crew[personId].isOnLogistics = activeStatus
      }
      $log.log('selected ' + $scope.crew[parseInt(personId)].firstName)

      //initialize assignment with permanent values
      if (activeStatus == 1) {
        var paramsToUpdate = {}
        paramsToUpdate['site'] = $scope.crew[personId].assignedSite
        paramsToUpdate['project'] = $scope.crew[personId].assignedProject
      }

      var togglePromise = updateActiveCrew(personId, activeStatus, paramsToUpdate)
      togglePromise.then(function success() {
        if ($scope.crew[personId].isOnLogistics == 1) {
          $scope.activeCrew.push(personId)
          $scope.crew[personId].assignedToSite_id = $scope.crew[personId].assignedSite
          $scope.crew[personId].assignedToProject = $scope.crew[personId].assignedProject
        } else {
          var index = $scope.activeCrew.indexOf(personId)
          $scope.activeCrew.splice(index, 1)
        }
        $log.log('activeCrew: ' + $scope.activeCrew.toString())
      }, function failure() {
        $mdToast.show($mdToast.simple().textContent('Failed to update database. Please try again.').highlightClass('md-warn'))
      })
      $scope.selectedItem = ''
      $scope.searchText = ''
    }
  }

  $scope.updateAssignment = function(personId, paramToUpdate) {
    $log.log('new site is: ' + paramToUpdate.site)
    var updatePromise = updateActiveCrew(personId, 1, paramToUpdate)
    updatePromise.then(function success() {
    }, function failure() {
      $mdToast.show($mdToast.simple().textContent('Failed to update database. Please try again.').highlightClass('md-warn'))
    })
  }

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
}])

app.controller('ActiveGroupsSelectionController', ['$scope', function($scope) {

}])

app.controller('VolunteerCarsAllocationController', ['$scope', function($scope) {

}])

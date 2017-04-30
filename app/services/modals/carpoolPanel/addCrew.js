var app = angular.module('adminApp')

app.factory('addCrewPanelModal', ['$log', '$mdDialog', '$http', '$q', 'updateActiveCrew', function($log, $mdDialog, $http, $q, updateActiveCrew) {

  return function (carpoolSite, myCrew, myCarpoolSites, myProjectSites) {

    return $mdDialog.show({
      templateUrl: 'app/views/modals/carpoolPanel/crew.html',
      clickOutsideToClose: true,
      controller: 'AddCrewPanelModalController',
      locals: {
        myCarpoolSite: carpoolSite,
        crew: myCrew,
        carpoolSites: myCarpoolSites,
        projectSites: myProjectSites
      }
    })

  }

}])

/*
 * AddTeerCarModalController
 * Controls navigation between the 3 app tabs
 */
app.controller('AddCrewPanelModalController', ['$scope', '$log', '$mdDialog', 'myCarpoolSite', 'crew', 'carpoolSites', 'projectSites', function($scope, $log, $mdDialog, myCarpoolSite, crew, carpoolSites, projectSites) {

  $scope.myCarpoolSite = myCarpoolSite
  $scope.crew = crew
  $scope.carpoolSites = carpoolSites
  $scope.projectSites = projectSites
  $scope.selectedCrew = ''

  $scope.inactiveCrew = []
  Object.keys($scope.crew).forEach(function (personId) {
    if ($scope.crew[personId].isOnLogistics != 1) {
      $scope.inactiveCrew.push(personId)
    }
  })

  $scope.returnSelectedPerson = function (personId) {
    $log.log("resolving promise with personId " + personId)
    $mdDialog.hide(personId)
  }

  $scope.filterSearch = function(rawQuery) {
    var inactiveMatches = []
    var activeMatches = []
    var matches = []
    var query = rawQuery.toLowerCase()
    Object.keys($scope.crew).forEach(function(personId) {
      if ($scope.crew[personId].firstName.toLowerCase().indexOf(query) > -1 || $scope.crew[personId].lastName.toLowerCase().indexOf(query) > -1) {
        if ($scope.crew[personId].carpoolSite_id == null || $scope.crew[personId].carpoolSite_id == '') {
          inactiveMatches.push($scope.crew[personId])
        } else if ($scope.crew[personId].carpoolSite_id) {
          activeMatches.push($scope.crew[personId])
        }
      }

      matches = inactiveMatches.concat(activeMatches)
      return matches
    })

    return matches
  }

}])

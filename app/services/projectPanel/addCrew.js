var app = angular.module('adminApp')

app.factory('addCrewProjectPanelModal', ['$log', '$mdDialog', '$http', '$q', 'updateActiveCrew', function($log, $mdDialog, $http, $q, updateActiveCrew) {

  return function (projectSite, myCrew, myCarpoolSites, myProjectSites) {

    return $mdDialog.show({
      templateUrl: 'app/views/modals/projectPanel/crew.html',
      clickOutsideToClose: true,
      controller: 'AddCrewProjectPanelModalController',
      locals: {
        myProjectSite: projectSite,
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
app.controller('AddCrewProjectPanelModalController', ['$scope', '$log', '$mdDialog', 'myProjectSite', 'crew', 'carpoolSites', 'projectSites', function($scope, $log, $mdDialog, myProjectSite, crew, carpoolSites, projectSites) {

  $scope.myProjectSite = myProjectSite
  $scope.crew = crew
  $scope.carpoolSites = carpoolSites
  $scope.projectSites = projectSites
  $scope.selectedCrew = ''

  $scope.noSiteAssignment = []
  $scope.hasSiteAssignment = []
  $scope.notOnLogistics = []
  Object.keys($scope.crew).forEach(function (personId) {
    if ($scope.crew[personId].isOnLogistics != 1) {
      $scope.notOnLogistics.push(personId)
    }
    else if ($scope.crew[personId].assignedToSite_id == null || $scope.crew[personId].assignedToSite_id == '') {
      $scope.noSiteAssignment.push(personId)
    }
    else {
      $scope.hasSiteAssignment.push(personId)
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
        matches.push($scope.crew[personId])
      }
    })

    return matches
  }

}])

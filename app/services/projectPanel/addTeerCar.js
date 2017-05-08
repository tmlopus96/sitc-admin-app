var app = angular.module('adminApp')

app.factory('addTeerCarProjectPanelModal', ['$log', '$mdDialog', '$http', '$q', 'updateActiveCrew', function($log, $mdDialog, $http, $q, updateActiveCrew) {

  return function (projectSite, myTeerCars, myCarpoolSites, myProjectSites) {

    return $mdDialog.show({
      templateUrl: 'app/views/modals/projectPanel/teerCar.html',
      clickOutsideToClose: true,
      controller: 'AddTeerCarProjectPanelModalController',
      locals: {
        myProjectSite: projectSite,
        teerCars: myTeerCars,
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
app.controller('AddTeerCarProjectPanelModalController', ['$scope', '$log', '$mdDialog', 'myProjectSite', 'teerCars', 'carpoolSites', 'projectSites', function($scope, $log, $mdDialog, myProjectSite, teerCars, carpoolSites, projectSites) {

  $scope.myProjectSite = myProjectSite
  $scope.teerCars = teerCars
  $scope.carpoolSites = carpoolSites
  $scope.projectSites = projectSites
  $scope.selectedCrew = ''

  $scope.noSiteAssignment = []
  $scope.hasSiteAssignment = []
  Object.keys($scope.teerCars).forEach(function (teerCarId) {
    if ($scope.teerCars[teerCarId].assignedToSite == null || $scope.teerCars[teerCarId].assignedToSite == '') {
      $scope.noSiteAssignment.push(teerCarId)
    }
    else {
      $scope.hasSiteAssignment.push(teerCarId)
    }
  })

  $scope.returnSelectedTeerCar = function (teerCarId) {
    $log.log("resolving promise with teerCarId " + teerCarId)
    $mdDialog.hide(teerCarId)
  }



}])

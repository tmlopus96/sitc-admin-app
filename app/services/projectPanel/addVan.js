var app = angular.module('adminApp')

app.factory('addVanProjectPanelModal', ['$log', '$mdDialog', '$http', '$q', 'updateActiveCrew', function($log, $mdDialog, $http, $q, updateActiveCrew) {

  return function (projectSite, myVans, myCarpoolSites, myProjectSites) {

    return $mdDialog.show({
      templateUrl: 'app/views/modals/projectPanel/van.html',
      clickOutsideToClose: true,
      controller: 'AddVanProjectPanelModalController',
      locals: {
        myProjectSite: projectSite,
        vans: myVans,
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
app.controller('AddVanProjectPanelModalController', ['$scope', '$log', '$mdDialog', 'myProjectSite', 'vans', 'carpoolSites', 'projectSites', function($scope, $log, $mdDialog, myProjectSite, vans, carpoolSites, projectSites) {

  $scope.myProjectSite = myProjectSite
  $scope.vans = vans
  $scope.carpoolSites = carpoolSites
  $scope.projectSites = projectSites
  $scope.selectedCrew = ''

  $scope.noSiteAssignment = []
  $scope.hasSiteAssignment = []
  $scope.notOnLogistics = []
  Object.keys($scope.vans).forEach(function (vanId) {
    if ($scope.vans[vanId].isOnLogistics != 1) {
      $scope.notOnLogistics.push(vanId)
    }
    else if ($scope.vans[vanId].assignedToSite == null || $scope.vans[vanId].assignedToSite == '') {
      $scope.noSiteAssignment.push(vanId)
    }
    else {
      $scope.hasSiteAssignment.push(vanId)
    }
  })

  $scope.returnSelectedVan = function (vanId) {
    $log.log("resolving promise with vanId " + vanId)
    $mdDialog.hide(vanId)
  }



}])

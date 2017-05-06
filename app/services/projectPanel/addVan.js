var app = angular.module('adminApp')

app.factory('addVanPanelModal', ['$log', '$mdDialog', '$http', '$q', 'updateActiveCrew', function($log, $mdDialog, $http, $q, updateActiveCrew) {

  return function (carpoolSite, myVans, myCarpoolSites) {

    return $mdDialog.show({
      templateUrl: 'app/views/modals/carpoolPanel/van.html',
      clickOutsideToClose: true,
      controller: 'AddVanPanelModalController',
      locals: {
        myCarpoolSite: carpoolSite,
        vans: myVans,
        carpoolSites: myCarpoolSites
      }
    })

  }

}])

/*
 * AddTeerCarModalController
 * Controls navigation between the 3 app tabs
 */
app.controller('AddVanPanelModalController', ['$scope', '$log', '$mdDialog', 'myCarpoolSite', 'vans', 'carpoolSites', function($scope, $log, $mdDialog, myCarpoolSite, vans, carpoolSites) {

  $scope.myCarpoolSite = myCarpoolSite
  $scope.vans = vans
  $scope.carpoolSites = carpoolSites
  $scope.selectedCrew = ''

  $scope.activeVans = []
  $scope.inactiveVans = []
  Object.keys($scope.vans).forEach(function (vanId) {
    if ($scope.vans[vanId].isOnLogistics == 1) {
      $scope.activeVans.push(vanId)
    } else {
      $scope.inactiveVans.push(vanId)
    }
  })

  $scope.returnSelectedVan = function (vanId) {
    $log.log("resolving promise with vanId " + vanId)
    $mdDialog.hide(vanId)
  }



}])

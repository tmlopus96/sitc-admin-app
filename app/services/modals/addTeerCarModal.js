var app = angular.module('adminApp')

app.factory('addTeerCarModal', ['$log', '$q', '$mdDialog', '$http', function($log, $q, $mdDialog, $http) {

  return function (myCarpoolSites, myProjectSites, myGetSitesForProject, myCarpoolSite) {

    var defer = $q.defer()

    $mdDialog.show({
      templateUrl: 'app/views/modals/addTeerCarModalTemplate.html',
      clickOutsideToClose: true,
      controller: 'AddTeerCarModalController',
      locals: {
        carpoolSites: myCarpoolSites,
        projectSites: myProjectSites,
        getSitesForProject: myGetSitesForProject,
        carpoolSite: (myCarpoolSite) ? myCarpoolSite : null
      }
    }).then(function(newCar) {
      var newCarToPass = JSON.stringify(newCar)
      $log.log('newCarToPass: ' + dump(newCarToPass, 'none'))

      $http({
        method: "POST",
        url: "app/appServer/teerCars/addTeerCar.php",
        params: {
          car: newCarToPass
        }
      }).then(function(response) {
        $log.log("Response from addNewTeerCar.php: " + dump(response, 'none'))
        return
      },
      function(error) {
        // error handling
      })
      defer.resolve(newCar)
    })
    return defer.promise
  }
}])

app.controller('AddTeerCarModalController', ['$scope', '$log', '$mdDialog', 'carpoolSites', 'projectSites', 'getSitesForProject', 'carpoolSite', function($scope, $log, $mdDialog, myCarpoolSites, myProjectSites, myGetSitesForProject, myCarpoolSite) {

    $scope.carpoolSites = myCarpoolSites
    $scope.projectSites = myProjectSites
    /*
     * fucntion from LogisticsController to get all active sites for given project
     * $scope.getSitesForProject = function(project)
     */
    $scope.getSitesForProject = myGetSitesForProject
    // Initialize object for form elements to bind to
    $scope.car = {}
    $scope.car['carpoolSite_id'] = myCarpoolSite

    $scope.submit = function() {
      $log.log('submit ran!')
      $mdDialog.hide($scope.car)
    }

}])

var app = angular.module('adminApp')

app.factory('addTeerCarModal', ['$log', '$mdDialog', '$http', function($log, $mdDialog, $http) {

  return function (myCarpoolSites, myProjectSites, myGetSitesForProject) {

    $mdDialog.show({
      templateUrl: 'app/views/modals/addTeerCarModalTemplate.html',
      clickOutsideToClose: true,
      controller: 'AddTeerCarModalController',
      locals: {
        carpoolSites: myCarpoolSites,
        projectSites: myProjectSites,
        getSitesForProject: myGetSitesForProject
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
      },
      function(error) {
        // error handling
      })
    })
  }
}])

app.controller('AddTeerCarModalController', ['$scope', '$log', '$mdDialog', 'carpoolSites', 'projectSites', 'getSitesForProject', function($scope, $log, $mdDialog, myCarpoolSites, myProjectSites, myGetSitesForProject) {

    $scope.carpoolSites = myCarpoolSites
    $scope.projectSites = myProjectSites
    /*
     * fucntion from LogisticsController to get all active sites for given project
     * $scope.getSitesForProject = function(project)
     */
    $scope.getSitesForProject = myGetSitesForProject
    // Initialize object for form elements to bind to
    $scope.car = {}

    $scope.submit = function() {
      $log.log('submit ran!')
      $mdDialog.hide($scope.car)
    }

}])

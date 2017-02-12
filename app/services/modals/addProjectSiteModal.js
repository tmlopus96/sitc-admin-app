var app = angular.module('adminApp')

app.factory('addProjectSiteModal', ['$log', '$mdDialog', '$http', function($log, $mdDialog, $http) {

  return function () {

    $mdDialog.show({
      templateUrl: 'app/views/modals/addProjectSiteModalTemplate.html',
      clickOutsideToClose: true,
      controller: 'AddProjectSiteModalController'
    }).then(function(newSite) {
      var newSiteToPass = JSON.stringify(newSite)
      $log.log('newSiteToPass: ' + dump(newSiteToPass, 'none'))

      $http({
        method: "POST",
        url: "app/appServer/addNewSite.php",
        params: {
          site: newSiteToPass
        }
      }).then(function(response) {
        $log.log("Response from addProjectSite.php: " + dump(response, 'none'))
      },
      function(error) {
        // error handling
      })
    })
  }
}])

app.controller('AddProjectSiteModalController', ['$scope', '$log', '$mdDialog', function($scope, $log, $mdDialog) {

    // Initialize object for form elements to bind to
    $scope.site = {}

    $scope.submit = function() {
      $log.log('submit ran!')
      $mdDialog.hide($scope.site)
    }

}])

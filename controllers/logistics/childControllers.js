var app = angular.module('adminApp')

app.controller('ProjectSiteSelectionController', ['$scope', '$log', 'getProjectSites', function($scope, $log, getProjectSites) {

  getProjectSites().then(function(sites_result) {
    $scope.projectSites = sites_result
  })
  //$log.log('sites[clarkPark] is ' + $scope.sites['clarkPark'])

}])

app.controller('ActiveCrewSelectionController', ['$scope', function($scope) {

}])

app.controller('ActiveGroupsSelectionController', ['$scope', function($scope) {

}])

app.controller('VolunteerCarsAllocationController', ['$scope', function($scope) {

}])

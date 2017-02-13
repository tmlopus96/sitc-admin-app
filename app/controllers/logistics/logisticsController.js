var app = angular.module('adminApp')

app.controller('LogisticsController', ['$scope', '$log', 'getProjectSites', 'getCarpoolSites', function($scope, $log, getProjectSites, getCarpoolSites) {
  $log.log('Hello, world! LogisticsController is running!')

  $scope.projectSites = {}
  $scope.carpoolSites = {}
  $scope.activeSites = []
  $scope.activeCrew = []
  $scope.activeGroups = []

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

  getCarpoolSites().then(function(sites_result) {
    $scope.carpoolSites = sites_result
    $log.log('$scope.carpoolSites: ' + dump($scope.carpoolSites, 'none'))
  })

  $scope.getSitesForProject = function(project) {
    var sitesForThisProject = []
    $scope.activeSites.forEach(function(currentSite) {
      if ($scope.projectSites[currentSite].project == project) {
        sitesForThisProject.push(currentSite)
      }
    })

    return sitesForThisProject
  }

}])

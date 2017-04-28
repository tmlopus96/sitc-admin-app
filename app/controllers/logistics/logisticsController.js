var app = angular.module('adminApp')

app.controller('LogisticsController', ['$scope', '$log', '$q', 'getProjectSites', 'getCarpoolSites', 'getCrew', function($scope, $log, $q, getProjectSites, getCarpoolSites, getCrew) {
  $log.log('Hello, world! LogisticsController is running!')

  $scope.carpoolSites = {}
  $scope.crew = {}
  $scope.projectSites = {}
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

  $scope.carpoolSitesWillLoad_defer = $q.defer()
  getCarpoolSites().then(function(sites_result) {
    $scope.carpoolSites = sites_result
    Object.keys($scope.carpoolSites).forEach(function(siteId) {
      $scope.carpoolSites[siteId]["assignedCrew"] = []
      $scope.carpoolSites[siteId]["assignedVans"] = []
    })
    // $log.log('$scope.carpoolSites: ' + dump($scope.carpoolSites, 'none'))
    $scope.carpoolSitesWillLoad_defer.resolve()
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

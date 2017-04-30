var app = angular.module('adminApp')

app.controller('LogisticsController', ['$scope', '$log', '$q', 'getProjectSites', 'getCarpoolSites', 'getCrew', function($scope, $log, $q, getProjectSites, getCarpoolSites, getCrew) {
  $log.log('Hello, world! LogisticsController is running!')

  $scope.carpoolSites = {}
  $scope.projectSites = {}
  $scope.activeSites = []
  $scope.crew = {}
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

  // Load carpool sites, then load Crew
  // $scope.carpoolSitesWillLoad_defer = $q.defer()
  getCarpoolSites().then(function(sites_result) {
    $scope.carpoolSites = sites_result
    Object.keys($scope.carpoolSites).forEach(function(siteId) {
      $scope.carpoolSites[siteId]["assignedCrew"] = []
      $scope.carpoolSites[siteId]["assignedVans"] = []
    })
    // $log.log('$scope.carpoolSites: ' + dump($scope.carpoolSites, 'none'))
    // $scope.carpoolSitesWillLoad_defer.resolve()
  }).then(function() {
    getCrew().then(function(crew_result) {
      $scope.crew = crew_result
      Object.keys($scope.crew).forEach(function(personId) {
        $scope.crew[personId].numPassengers = parseInt($scope.crew[personId].numPassengers) //not loading into number input for some reason
        if ($scope.crew[personId].isOnLogistics == '1' || $scope.crew[personId.isOnLogistics == 1]) {
          $scope.crew[personId].isOnLogistics = 1
          $scope.activeCrew.push(parseInt(personId))
          if ($scope.crew[personId].carpoolSite_id) {
            $scope.carpoolSites[$scope.crew[personId].carpoolSite_id].assignedCrew.push(personId)
          }
        } else {
          $scope.crew[personId].isOnLogistics = 0
        }
      })
    })
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

var app = angular.module('adminApp')

app.controller('LogisticsController', ['$scope', '$log', '$q', 'getProjectSites', 'getCarpoolSites', 'getCrew', 'getTeerCars', 'getVans', function($scope, $log, $q, getProjectSites, getCarpoolSites, getCrew, getTeerCars, getVans) {
  $log.log('Hello, world! LogisticsController is running!')

  $scope.carpoolSites = {}
  $scope.projectSites = {}
  $scope.activeSites = []
  $scope.crew = {}
  $scope.activeCrew = []
  $scope.activeGroups = []
  $scope.teerCars = {}
  $scope.vans = {}

  // -- Load data
  // load carpool sites
  getCarpoolSites().then(function(sites_result) {
    $scope.carpoolSites = sites_result
    Object.keys($scope.carpoolSites).forEach(function(siteId) {
      $scope.carpoolSites[siteId]["assignedCrew"] = []
      $scope.carpoolSites[siteId]["assignedVans"] = []
      $scope.carpoolSites[siteId]["assignedTeerCars"] = []
    })
  }).then(function () {
    // load project sites
    getProjectSites().then(function(sites_result) {
      var defer = $q.defer()

      $scope.projectSites = sites_result
      Object.keys($scope.projectSites).forEach(function(siteId) {
        $scope.projectSites[siteId]["assignedCrew"] = []
        $scope.projectSites[siteId]["assignedVans"] = []
        $scope.projectSites[siteId]["assignedTeerCars"] = []
        if ($scope.projectSites[siteId].isActive == '1') {
          $scope.projectSites[siteId].isActive = 1
          $scope.activeSites.push(siteId)
        } else {
          $scope.projectSites[siteId].isActive = 0
        }

        // on last iteration of forEach, resolve promise
        if (Object.keys($scope.projectSites).indexOf(siteId) == Object.keys($scope.projectSites).length - 1) {
          $log.log("Resolving projectSites promise!")
          defer.resolve()
        }
      })

      return defer.promise
    })
  }).then(function() {
    // load crew
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
          if ($scope.crew[personId].assignedToSite_id != null && $scope.crew[personId].assignedToSite_id != '') {
            $scope.projectSites[$scope.crew[personId].assignedToSite_id].assignedCrew.push(personId)
          }
        } else {
          $scope.crew[personId].isOnLogistics = 0
        }
      })
    })
  }).then(function () {
    // load volunteer cars
    getTeerCars().then(function(teerCars_result) {
      $scope.teerCars = teerCars_result
      Object.keys($scope.teerCars).forEach(function(teerCar_id) {
        $scope.carpoolSites[$scope.teerCars[teerCar_id].carpoolSite_id].assignedTeerCars.push(teerCar_id)

        if ($scope.teerCars[teerCar_id].assignedToSite != null && $scope.teerCars[teerCar_id].assignedToSite != '') {
          $scope.projectSites[$scope.teerCars[teerCar_id].assignedToSite].assignedTeerCars.push(teerCar_id)
        }

        $scope.teerCars[teerCar_id].assignedNumPassengers = parseInt($scope.teerCars[teerCar_id].assignedNumPassengers)
        if ($scope.teerCars[teerCar_id].isActive == '1' || $scope.teerCars[teerCar_id.isActive == 1]) {
          $scope.teerCars[teerCar_id].isActive = 1
        } else {
          $scope.teerCars[teerCar_id].isActive = 0
        }
      })
      // $log.log('$scope.teerCars' + dump($scope.teerCars, 'none'))
    })
  }).then(function () {
    // load vans
    getVans().then(function (vans_response) {
      $scope.vans = vans_response
      Object.keys($scope.vans).forEach(function (vanId) {

        $scope.vans[vanId].numPassengers = ($scope.vans[vanId].numPassengers == null || $scope.vans[vanId].numPassengers == 0) ? 0 : parseInt($scope.vans[vanId].numPassengers)
        $scope.vans[vanId].numSeatbelts = ($scope.vans[vanId].numSeatbelts == null || $scope.vans[vanId].numSeatbelts == 0) ? 0 : parseInt($scope.vans[vanId].numSeatbelts)

        if ($scope.vans[vanId].isOnLogistics == '1' || $scope.vans[vanId.isOnLogistics == 1]) {
          $scope.vans[vanId].isOnLogistics = 1
          $scope.carpoolSites[$scope.vans[vanId].carpoolSite].assignedVans.push(vanId)
          if ($scope.vans[vanId].assignedToSite != null && $scope.vans[vanId].assignedToSite != '') {
            $scope.projectSites[$scope.vans[vanId].assignedToSite].assignedVans.push(vanId)
          }
        } else {
          $scope.vans[vanId].isOnLogistics = 0
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

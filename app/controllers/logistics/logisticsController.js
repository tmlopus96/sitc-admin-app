var app = angular.module('adminApp')

app.controller('LogisticsController', ['$scope', '$log', '$mdToast', '$state', '$stateParams', '$q', 'getProjectSites', 'getCarpoolSites', 'getCrew', 'getTeerCars', 'getVans', 'projectSitesHaveBeenSetToday', 'setProjectSitesHaveBeenSetToday', 'logisticsInit', 'pushAttendanceRecords', 'lastAttendanceRecordPush', 'initLogistics', function($scope, $log, $mdToast, $state, $stateParams, $q, getProjectSites, getCarpoolSites, getCrew, getTeerCars, getVans, projectSitesHaveBeenSetToday, setProjectSitesHaveBeenSetToday, logisticsInit, pushAttendanceRecords, lastAttendanceRecordPush, initLogistics) {
  $log.log('Hello, world! LogisticsController is running!')

  lastAttendanceRecordPush().then(function (responseDate) {
    var dateOfLastPush = new Date(responseDate)
    $log.log("Date of last push: " + dateOfLastPush.toLocaleDateString())
    $log.log("$stateParams: " + dump($stateParams, 'none'))
    $log.log("forceGo: " + $state.current.data.forceGo)
    var lastProjectDate = setLastProjectDate()
    // If forceGo is true, it means the user was already sent to the saveAttendanceRecords state and chose to proceed without saving
    if (!$state.current.data.forceGo && (lastProjectDate.getDate() != dateOfLastPush.getDate() || lastProjectDate.getMonth() != dateOfLastPush.getMonth() || lastProjectDate.getYear() != dateOfLastPush.getYear())) { // && (lastProjectDate.getDate() != dateOfLastPush.getDate() || lastProjectDate.getMonth() != lastProjectDate.getMonth())
      // delete after use
      delete $state.current.data.forceGo
      $state.go('saveAttendanceRecords')
    }
  })
  // Used above in lastAttendanceRecordPush.then(func{})
  function setLastProjectDate () {
    var myDate = new Date()

    while (myDate.getDay() > 5 || myDate.getDay() < 2) {
      myDate.setDate(myDate.getDate() - 1)
    }

    $log.log("Date is " + myDate.toLocaleDateString())
    return myDate
  }

  $scope.carpoolSites = {}
  $scope.projectSites = {}
  $scope.activeSites = []
  $scope.crew = {}
  $scope.activeCrew = []
  $scope.activeGroups = []
  $scope.teerCars = {}
  $scope.vans = {}

  $scope.hideTabs = true
  $scope.breadcrumbShows = {
    'selectSites': true,
    'assignCrew': false
  }

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
    $log.log("Loading Project Sites!")
    var defer = $q.defer()

    // load project sites
    getProjectSites().then(function(sites_result) {

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

    })
    return defer.promise
  }).then(function() {
    $log.log("Loading Crew!")
    var defer = $q.defer()

    // load crew
    getCrew().then(function(crew_result) {
      $scope.crew = crew_result
      $log.log("$scope.crew: " + dump($scope.crew, 'none'))
      Object.keys($scope.crew).forEach(function(personId) {
        $scope.crew[personId].numPassengers = parseInt($scope.crew[personId].numPassengers) //not loading into number input for some reason
        if ($scope.crew[personId].isOnLogistics == '1' || $scope.crew[personId].isOnLogistics == 1) {
          $scope.crew[personId].isOnLogistics = 1
          $scope.activeCrew.push(parseInt(personId))
          if ($scope.crew[personId].carpoolSite_id) {
            $scope.carpoolSites[$scope.crew[personId].carpoolSite_id].assignedCrew.push(personId)
          }
          if ($scope.crew[personId].assignedToSite_id != null && $scope.crew[personId].assignedToSite_id != '') {
            $log.log("personId: " + personId + ", assignedToSite_id: " + $scope.crew[personId].assignedToSite_id)
            $scope.projectSites[$scope.crew[personId].assignedToSite_id].assignedCrew.push(personId)
          }
        } else {
          $scope.crew[personId].isOnLogistics = 0
        }

        // on last iteration of forEach, resolve promise
        if (Object.keys($scope.crew).indexOf(personId) == Object.keys($scope.crew).length - 1) {
          // $log.log("Carpool Sites after Crew init: " + dump($scope.carpoolSites, 'none'))
          $log.log("Resolving crew promise!")
          defer.resolve()
        }
      })
    })

    return defer.promise
  }).then(function () {
    $log.log("Loading Teer Cars!")

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
  }).then(function success() {
    projectSitesHaveBeenSetToday().then(function(status) {
      $log.log('init status: ' + status + '; current state: ' + $state.current.name)
      if (!status) {
        // initLogistics: automatically add people with permanent assignements to Logistics by inserting them into CheckedIn
        initLogistics().then(function success () {
          $state.go("logistics.projectSiteSelection")
        }, function failure() {
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Something went wrong.')
              .textContent('It\'s okay. Everything should work fine, but you might have to manually add some people to logistics who are normally added automatically.')
              .ariaLabel('Problem, but everything is fine.')
              .ok('Onward!')
          )
          $state.go("logistics.projectSiteSelection")
        })
      }
      else {
        var forDate = setLogisticsDate()
        function setLogisticsDate () {
          var myDate = new Date()
          $log.log("Date is " + myDate.toLocaleDateString())

          // if it's before 8 and logistics haven't been init-ed yet, we know we're initting logistics for today
          if (myDate.getHours() < 8) {
            return myDate
          }
          else {
            // advance to tomorrow; do it again until we get a Tues-Fri
            do {
              $log.log('myDate.getDate: ' + myDate.getDate())
              myDate.setDate(myDate.getDate() + 1)
            } while (myDate.getDay() <= 1 || myDate.getDay() == 6)

            $log.log("Date is " + myDate.toLocaleDateString())
            return myDate
          }
        }

        var displayDate = forDate.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})
        $mdToast.show({
          hideDelay   : 3000,
          position    : 'bottom left',
          template : "<md-toast><div class='md-toast-content'><span>Managing logistics for <strong>" + displayDate + "</strong></span></div></md-toast>"
        })

        if ($state.current.name === 'logistics') {
          $log.log("$state.current.name == logistics; going to carpoolPanel!")
          $state.go('logistics.carpoolSitesPanel')
          $scope.selectedTab = 0
          $scope.hideTabs = false
          $scope.breadcrumbShows.assignCrew = true
        }
        else if ($state.current.name === 'logistics.carpoolSitesPanel') {
          $log.log("$state.current.name == logistics.carpoolSitesPanel; going to carpoolPanel!")
          $state.go('logistics.carpoolSitesPanel')
          $scope.selectedTab = 0
          $scope.hideTabs = false
          $scope.breadcrumbShows.assignCrew = true
        }
        else if ($state.current.name === 'logistics.projectSitesPanel') {
          $log.log("Going to projectPanel!")
          $state.go('logistics.projectSitesPanel')
          $scope.selectedTab = 1
          $scope.hideTabs = false
          $scope.breadcrumbShows.assignCrew = true
        }
      }
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

    $scope.endInit = function () {
      setProjectSitesHaveBeenSetToday(1).then(function success() {
        $scope.selectedTab = 0
        $scope.hideTabs = false
        $scope.breadcrumbShows.assignCrew = true
        $scope.gotoTab('carpoolPanel')
      }, function failure() {
        // error handling
      })
    }
  })



  $scope.backToInit = function() {
    $log.log("Going back to init!")
    $scope.hideTabs = true
    $scope.breadcrumbShows.assignCrew = false
    $state.go('logistics.projectSiteSelection')
  }

  /*
   * gotoTab
   * Configures tab changing animation so slide is in the right direction, then goes to new tab's state
   * Pre: destinationTab is one of the three tabs
   * Post: animate transition classes are applied, $rootScope.currentState is set, and $state goes to destinationTab
   */
  $scope.gotoTab = function(destinationTab) {
    // promise is used to prevent $state.go() from being called before destinationState is set
    var defer = $q.defer()
    $log.log("destinationTab: " + destinationTab)

    if (destinationTab == 'carpoolPanel') {
      $scope.transitionClass = 'left-to-right'
      var destinationState = 'logistics.carpoolSitesPanel'
      defer.resolve()
    }
    else {
      $scope.transitionClass = 'right-to-left'
      var destinationState = 'logistics.projectSitesPanel'
      defer.resolve()
    }

    defer.promise.then(function() {
      $state.go(destinationState)
    })
  }

}])

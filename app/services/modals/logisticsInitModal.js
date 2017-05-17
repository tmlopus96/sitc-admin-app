var app = angular.module('adminApp')

app.factory('logisticsInit', ['$log', '$q', '$mdDialog', '$http', function($log, $q, $mdDialog, $http) {

  return function(myProjectSites, myActiveSites, myGetSitesForProject) {
    return $mdDialog.show({
      templateUrl: 'app/views/modals/logisticsInit.html',
      clickOutsideToClose: false,
      controller: 'LogisticsInitController',
      locals: {
        projectSites: myProjectSites,
        activeSites: myActiveSites,
        getSitesForProject: myGetSitesForProject,
      }
    })
  }
}])

app.controller('LogisticsInitController', ['$scope', '$log', '$mdDialog', 'projectSites', 'activeSites', 'getSitesForProject', 'addProjectSiteModal', 'logisticsInit', 'toggleSiteActive', function($scope, $log, $mdDialog, myProjectSites, myActiveSites, myGetSitesForProject, addProjectSiteModal, logisticsInit, toggleSiteActive) {

  $scope.projectSites = myProjectSites
  $scope.activeSites = myActiveSites
  $scope.getSitesForProject = myGetSitesForProject

  $scope.projectSites_byName = {}
  $scope.projectSiteNames = []
  Object.keys($scope.projectSites).forEach(function(currentSiteId) {
    $scope.projectSites_byName[$scope.projectSites[currentSiteId].name] = $scope.projectSites[currentSiteId]
    $scope.projectSiteNames = $scope.projectSites[currentSiteId].name
  })
  




  $scope.forDate = setLogisticsDate()
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

  $scope.toggleActive = function(siteId) {
    var togglePromise = toggleSiteActive(siteId, $scope.projectSites[siteId].isActive)
    togglePromise.then(function success() {
        if ($scope.projectSites[siteId].isActive) {
          $scope.activeSites.push(siteId)
        } else {
          var index = $scope.activeSites.indexOf(siteId)
          $scope.activeSites.splice(index, 1)
        }
        $log.log('activeSites: ' + $scope.activeSites.toString())
      }, function failure() {
        $mdToast.show($mdToast.simple().textContent('Failed to update database. Please try again.').highlightClass('md-warn'))
      }
    )
  }

  $scope.addNew = function () {
    addProjectSiteModal().then(function success(newSite) {
      $log.log("recieved this from addProjectSiteModal: " + dump(newSite, 'none'))
      $scope.projectSites[newSite.id] = newSite
      if (newSite.isActive) {
        $scope.activeSites.push(newSite.id)
      }
      // $log.log("projectSites: " + dump($scope.projectSites, 'none'))
      logisticsInit($scope.projectSites, $scope.activeSites, $scope.getSitesForProject)
    })
  }

  $scope.endInit = function() {
    var params = {
      'projectSites' : $scope.projectSites,
      'activeSites' : $scope.activeSites
    }
    $mdDialog.hide(params)
  }

}])

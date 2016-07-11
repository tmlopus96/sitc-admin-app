var app = angular.module('adminApp')

app.factory('getProjectSites', ['$log', '$q', '$http', function($log, $q, $http) {

  return function() {
    $log.log('getProjectSites ran!')
    var defer = $q.defer()

     $http({
      url: "appServer/getProjectSites.php",
      method: "GET"
    }).then(
      function(response) {
        var sites = {}
        response.data.forEach(function(currentSite) {
          sites[currentSite.projectSite_id] = currentSite
        })

        defer.resolve(sites)
      },
      function(error) {
        //TODO error handling
      })

    return defer.promise
  }

}])

app.factory('getCrew', ['$log', '$q', '$http', function($log, $q, $http) {

  return function() {
    $log.log('getCrew ran!')
    var defer = $q.defer()

     $http({
      url: "appServer/getCrew.php",
      method: "GET"
    }).then(
      function(response) {
        var crew = {}
        response.data.forEach(function(currentCrew) {
          crew[currentCrew.person_id] = currentCrew
        })

        defer.resolve(crew)
      },
      function(error) {
        //TODO error handling
      })

    return defer.promise
  }

}])

app.factory('toggleSiteActive', ['$log', '$q', '$http', '$mdToast', function($log, $q, $http, $mdToast) {
  return function(mySiteId, myActiveStatus) {

    return $http({
      url: "appServer/toggleSiteActive.php",
      method: 'GET',
      params: {
        isActive: myActiveStatus,
        siteId: mySiteId
      }
    })

  }
}])

app.factory('updateActiveCrew', ['$log', '$q', '$http', '$mdToast', function($log, $q, $http, $mdToast) {
  return function(myPersonId, myActiveStatus) {

    return $http({
      url: "appServer/updateActiveCrew.php",
      method: 'GET',
      params: {
        isActive: myActiveStatus,
        personId: myPersonId
      }
    })

  }
}])

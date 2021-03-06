var app = angular.module('adminApp', ['ngMaterial', 'ui.router', 'md.data.table', 'ngAnimate'])

app.config(function($stateProvider) {
  $stateProvider
    .state('logistics', {
      url: '/logistics',
      templateUrl: 'app/views/logisticsView.html',
      controller: 'LogisticsController',
      data: {requireLogin: true}
    })

    //--- Logistics child states
      .state('logistics.carpoolSitesPanel', {
        url: '/carpoolPanel',
        templateUrl: 'app/views/logistics/carpoolPanel.html',
        controller: 'CarpoolPanelController',
        data: {requireLogin: true}
      })
      .state('logistics.projectSitesPanel', {
        url: '/projectPanel',
        templateUrl: 'app/views/logistics/projectPanel.html',
        controller: 'ProjectPanelController',
        data: {requireLogin: true}
      })
      .state('saveAttendanceRecords', {
        url: '/attendanceRecords',
        templateUrl: 'app/views/saveAttendanceRecords.html',
        controller: 'SaveAttendanceRecordsController',
        data: {requireLogin: true}
      })
      .state('logistics.projectSiteSelection', {
        url: '/siteSelect',
        templateUrl: 'app/views/logistics/siteSelect.html',
        controller: 'ProjectSiteSelectionController',
        data: {requireLogin: true}
      })
      .state('logistics.activeCrew', {
        url: '/crewSelect',
        templateUrl: 'app/views/logistics/crewSelect.html',
        controller: 'ActiveCrewSelectionController',
        data: {requireLogin: true}
      })
      .state('logistics.carpoolSites', {
        url: '/carpoolSites',
        templateUrl: 'app/views/logistics/carpoolSites.html', //crewSelect.html
        controller: 'ActiveCrewSelectionController',
        data: {requireLogin: true}
      })
      .state('logistics.activeGroups', {
        url: '/groupSelect',
        templateUrl: 'app/views/logistics/groupSelect.html',
        controller: 'ActiveGroupsSelectionController',
        data: {requireLogin: true}
      })
      .state('logistics.volunteerCars', {
        url: '/volunteerCarSelect',
        templateUrl: 'app/views/logistics/volunteerCarSelect.html',
        controller: 'VolunteerCarsAllocationController',
        data: {requireLogin: true}
      })
    //---end Logistics child states
})

//open to carpool panel by default
app.config(function($urlRouterProvider, $locationProvider) {
  // $locationProvider.html5Mode(true);
  $urlRouterProvider.when('', '/attendanceRecords')
})

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('cyan')
    .accentPalette('deep-orange');
  })

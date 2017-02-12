var app = angular.module('adminApp', ['ngMaterial', 'ui.router', 'md.data.table'])

app.config(function($stateProvider) {
  $stateProvider
    .state('logistics', {
      url: '/logistics',
      templateUrl: 'app/views/logisticsView.html',
      controller: 'LogisticsController',
      data: {requireLogin: true}
    })

    //--- Logistics child states
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
      .state('logistics.activeGroups', {
        url: '/groupSelect',
        templateUrl: 'app/views/logistics/groupSelect.html',
        controller: 'ActiveGroupsSelectionController',
        data: {requireLogin: true}
      })
      .state('logistcs.volunteerCars', {
        url: '/volunteerCars',
        templateUrl: 'app/views/logistics/volunteerCars.html',
        controller: 'VolunteerCarsAllocationController',
        data: {requireLogin: true}
    })
    //---end Logistics child states
})

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('cyan')
    .accentPalette('deep-orange');
  })
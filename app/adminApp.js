var app = angular.module('adminApp', ['ngMaterial', 'ui.router']) //'mdDataTable'

app.config(function($stateProvider) {
  $stateProvider
    .state('logistics', {
      url: '/logistics',
      templateUrl: 'views/logisticsView.html',
      controller: 'LogisticsController',
      data: {requireLogin: true}
    })

    //--- Logistics child states
      .state('logistics.projectSiteSelection', {
        url: '/siteSelect',
        templateUrl: 'views/logistics/siteSelect.html',
        controller: 'ProjectSiteSelectionController',
        data: {requireLogin: true}
      })
      .state('logistics.activeCrew', {
        url: '/crewSelect',
        templateUrl: 'views/logistics/crewSelect.html',
        controller: 'ActiveCrewSelectionController',
        data: {requireLogin: true}
      })
      .state('logistics.activeGroups', {
        url: '/groupSelect',
        templateUrl: 'views/logistics/groupSelect.html',
        controller: 'ActiveGroupsSelectionController',
        data: {requireLogin: true}
      })
      .state('logistcs.volunteerCars', {
        url: '/volunteerCars',
        templateUrl: 'views/logistics/volunteerCars.html',
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

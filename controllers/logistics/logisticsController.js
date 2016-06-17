var app = angular.module('adminApp')

app.controller('LogisticsController', ['$scope', function($scope) {
  $scope.activeSites = []
  $scope.activeCrew = []
  $scope.activeGroups = []
}])

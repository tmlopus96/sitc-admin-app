var app = angular.module('adminApp')

app.controller('CarpoolPanelController', ['$scope', '$log', '$q', '$mdToast', '$mdDialog', 'getProjectSites', 'getCrew', 'addCrewPanelModal', 'addTeerCarModal', 'updateActiveCrew', function($scope, $log, $q, $mdToast, $mdDialog, getProjectSites, getCrew, addCrewPanelModal, addTeerCarModal, updateActiveCrew) {

  $scope.speedDialIsOpen = false

  $scope.addCrew = function(carpoolSite) {
    addCrewPanelModal(carpoolSite, $scope.crew, $scope.carpoolSites, $scope.projectSites).then(function success (personId) {
        updateActiveCrew(personId, 1, {'carpoolSite_id':carpoolSite}).then(function success (response) {
            $log.log('updateActiveCrew response: ' + dump(response, 'none'))
            var personId = response.config.params.personId
            // In case this person is already on logistics for another carpool site, delete them from that site's array
            if ($scope.crew[personId].carpoolSite_id) {
              var index = $scope.carpoolSites[$scope.crew[personId].carpoolSite_id].assignedCrew.indexOf(personId)
              $scope.carpoolSites[$scope.crew[personId].carpoolSite_id].assignedCrew.splice(index, 1)
            }

            // If this person is not already in $scope.activeCrew, push them to it
            var activeIndex = $scope.activeCrew.indexOf(personId)
            if (activeIndex == -1) {
              $scope.activeCrew.push(personId)
            }

            $scope.crew[personId].carpoolSite_id = carpoolSite
            $scope.crew[personId].isOnLogistics = 1
            $scope.carpoolSites[carpoolSite].assignedCrew.push(personId)
            $log.log('AssignedCrew: ' + dump($scope.carpoolSites[carpoolSite].assignedCrew, 'none'))
        })
    })
  }

  $scope.removeCrew = function (withId, firstName, carpoolSite) {
    var defer = $q.defer()

    if ($scope.crew[withId].hasPermanentAssignment == 1) {
      var confirm = $mdDialog.confirm()
          .title(`${firstName} is permanently assigned to the ${carpoolSite} carpool site.`)
          .textContent('Would you still like to remove them from this site for today?')
          .ariaLabel('Remove from permanent assignement')
          .ok('Remove anyway')
          .cancel('Cancel');

      $mdDialog.show(confirm).then(function yes () {
        defer.resolve()
      }, function no () {
        defer.reject()
      })
    }
    else {
      defer.resolve()
    }

    defer.promise.then(function yes() {
      updateActiveCrew(withId, 0).then(function success() {
        $scope.crew[withId].carpoolSite_id = ''
        $scope.crew[withId].isOnLogistics = 0

        var index = $scope.carpoolSites[carpoolSite].assignedCrew.indexOf(withId)
        $scope.carpoolSites[carpoolSite].assignedCrew.splice(index, 1)

        index = $scope.activeCrew.indexOf(withId)
        $scope.activeCrew.splice(index)
      })
    }, function no() {
      return
    })
  }

  $scope.addTeerCar = function (carpoolSite) {
    addTeerCarModal($scope.carpoolSites, $scope.projectSites, $scope.getSitesForProject, carpoolSite).then(function success (newCar) {
      $scope.teerCars[newCar.teerCar_id] = newCar
      $scope.carpoolSites[carpoolSite].assignedTeerCars.push(newCar.teerCar_id)
    })
  }

  function hideSpeedDialButtons(){
      var speedDialButton_first = angular.element(document.querySelectorAll('#speedDialActionButton_first')).parent()
      var speedDialButton_second = angular.element(document.querySelectorAll('#speedDialActionButton_second')).parent()
      var speedDialButton_third = angular.element(document.querySelectorAll('#speedDialActionButton_third')).parent()

      speedDialButton_first.css({'transform':'translate(44px)', 'z-index':'-21'})
      speedDialButton_second.css({'transform':'translate(88px)', 'z-index':'-22'})
      speedDialButton_third.css({'transform':'translate(132px)', 'z-index':'-23'})
    }

}])

app.controller('ProjectSiteSelectionController', ['$scope', '$log', '$mdInkRipple', '$mdToast', 'getProjectSites', 'toggleSiteActive', 'addProjectSiteModal', function($scope, $log, $mdInkRipple, $mdToast, getProjectSites, toggleSiteActive, addProjectSiteModal) {

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

  $scope.inkRipple = function(ev) {
    var row = angular.element(ev.target).parent().parent().parent()
    $mdInkRipple.attach($scope, row, {dimBackground: true})
  }

  $scope.addNew = function() {
    addProjectSiteModal()
  }
}])

app.controller('ActiveCrewSelectionController', ['$scope', '$log', 'getCrew', 'updateActiveCrew', function($scope, $log, getCrew, updateActiveCrew) {

  // $scope.activeCrew array declared in LogisticsController
  $scope.selectedCrew = ''
  $scope.allCrewIsShowing = false

  $scope.logPersonId = function(id) {
    $log.log("logPersonId: " + id)
  }

  $scope.toggleActive = function(personId, activeStatus) {
    if (typeof personId !== 'undefined') {
      personId = parseInt(personId)
      if (typeof activeStatus === 'undefined') { //activeStatus has been set by checkbox and not passed as a parameter
        activeStatus = $scope.crew[personId].isOnLogistics
      } else { //activeStatus has been passed and isOnLogistics has not been updated
        $scope.crew[personId].isOnLogistics = activeStatus
      }
      $log.log('selected ' + $scope.crew[parseInt(personId)].firstName + ' with activeStatus: ' + $scope.crew[personId].isOnLogistics)

      //initialize assignment with permanent values
      if (activeStatus == 1) {
        var paramsToUpdate = {}
        paramsToUpdate['site'] = $scope.crew[personId].assignedSite
        paramsToUpdate['project'] = $scope.crew[personId].assignedProject
      }

      var togglePromise = updateActiveCrew(personId, activeStatus, paramsToUpdate)
      togglePromise.then(function success() {
        if ($scope.crew[personId].isOnLogistics == 1) {
          $scope.activeCrew.push(personId)
          $scope.crew[personId].assignedToSite_id = $scope.crew[personId].assignedSite
          $scope.crew[personId].assignedToProject = $scope.crew[personId].assignedProject
        } else {
          var index = $scope.activeCrew.indexOf(personId)
          $scope.activeCrew.splice(index, 1)
        }
        $log.log('activeCrew: ' + $scope.activeCrew.toString())
      }, function failure() {
        $mdToast.show($mdToast.simple().textContent('Failed to update database. Please try again.').highlightClass('md-warn'))
      })
      $scope.selectedItem = ''
      $scope.searchText = ''
    }
  }

  $scope.updateAssignment = function(personId, paramToUpdate) {
    $log.log('new site is: ' + paramToUpdate.site)
    var updatePromise = updateActiveCrew(personId, 1, paramToUpdate)
    updatePromise.then(function success() {
    }, function failure() {
      $mdToast.show($mdToast.simple().textContent('Failed to update database. Please try again.').highlightClass('md-warn'))
    })
  }

  $scope.filterSearch = function(rawQuery) {
    var matches = []
    var query = rawQuery.toLowerCase()
    Object.keys($scope.crew).forEach(function(personId) {
      if ($scope.crew[personId].isOnLogistics == 0) {
        if ($scope.crew[personId].firstName.toLowerCase().indexOf(query) > -1) {
          matches.push(personId)
        } else if ($scope.crew[personId].lastName.toLowerCase().indexOf(query) > -1 ) {
          matches.push(personId)
        }
      }
    })

    return matches
  }
}])

app.controller('ActiveGroupsSelectionController', ['$scope','$log', 'getGroups', 'updateActiveGroup', function($scope, $log, getGroups, updateActiveGroup) {
  $scope.groups = []
  // $scope.activeGroups array declared in LogisticsController
  $scope.allGroupsAreShowing = false

  getGroups().then(function(groups_result) {
    $log.log('getGroups().then() is running!')
    $scope.groups = groups_result
    Object.keys($scope.groups).forEach(function(group_id) {
      // -- cast isActive and numVolunteers to number types; server returns string for some reason...maybe number types get stringified by PHP's json_encode?
      $scope.groups[group_id].numVolunteers = parseInt($scope.groups[group_id].numVolunteers)
      if ($scope.groups[group_id].isActive == '1' || $scope.groups[group_id.isActive == 1]) {
        $scope.groups[group_id].isActive = 1
        $scope.activeGroups.push(parseInt(group_id))
      } else {
        $scope.groups[group_id].isActive = 0
      }
    })
    $log.log('$scope.activeGroups' + dump($scope.activeGroups, 'none'))
  })

  $scope.toggleActive = function(groupId, activeStatus) {
    if (typeof groupId !== 'undefined') {
      groupId = parseInt(groupId)
      if (typeof activeStatus === 'undefined') { //activeStatus has been set by checkbox and not passed as a parameter
        activeStatus = $scope.groups[groupId].isActive
      } else { //activeStatus has been passed and isActive has not been updated
        $scope.groups[groupId].isActive = activeStatus
      }
      // $log.log('selected ' + $scope.groups[parseInt(groupId)].firstName + ' with activeStatus: ' + $scope.groups[groupId].isActive)

      var togglePromise = updateActiveGroup(groupId, activeStatus)
      togglePromise.then(function success() {
        if ($scope.groups[groupId].isActive == 1) {
          $scope.activeGroups.push(groupId)
        } else {
          var index = $scope.activeGroups.indexOf(groupId)
          $scope.activeGroups.splice(index, 1)
        }
        $log.log('activeGroups: ' + $scope.activeGroups.toString())
      }, function failure() {
        $mdToast.show($mdToast.simple().textContent('Failed to update database. Please try again.').highlightClass('md-warn'))
      })
      $scope.selectedItem = ''
      $scope.searchText = ''
    }
  }

  $scope.updateAssignment = function(groupId, paramToUpdate) {
    $log.log("$scope.updateAssignment is running for group" + $scope.groups[groupId])
    var updatePromise = updateActiveGroup(groupId, 1, paramToUpdate)
    updatePromise.then(function success() {
    }, function failure() {
      $mdToast.show($mdToast.simple().textContent('Failed to update database. Please try again.').highlightClass('md-warn'))
    })
  }



  $scope.filterSearch = function(rawQuery) {
    /* -- implement this for groups
    var matches = []
    var query = rawQuery.toLowerCase()
    Object.keys($scope.crew).forEach(function(personId) {
      if ($scope.crew[personId].isOnLogistics == 0) {
        if ($scope.crew[personId].firstName.toLowerCase().indexOf(query) > -1) {
          matches.push(personId)
        } else if ($scope.crew[personId].lastName.toLowerCase().indexOf(query) > -1 ) {
          matches.push(personId)
        }
      }
    })

    return matches
    --- */
  }

}])

app.controller('VolunteerCarsAllocationController', ['$scope', '$log', '$mdToast', 'getTeerCars', 'updateActiveTeerCar', 'addTeerCarModal', 'deleteTeerCar', function($scope, $log, $mdToast, getTeerCars, updateActiveTeerCar, addTeerCarModal, deleteTeerCar) {

  $log.log('VolunteerCarsAllocationController is running!')

  // $scope.carpoolSites array declared in LogisticsController
  $scope.teerCars = {}

  getTeerCars().then(function(teerCars_result) {
    $log.log('getTeerCars().then() is running!')
    $scope.teerCars = teerCars_result
    Object.keys($scope.teerCars).forEach(function(teerCar_id) {
      // -- cast isActive and assignedNumPassengers to number types; server returns string for some reason...maybe number types get stringified by PHP's json_encode?
      $scope.teerCars[teerCar_id].assignedNumPassengers = parseInt($scope.teerCars[teerCar_id].assignedNumPassengers)
      if ($scope.teerCars[teerCar_id].isActive == '1' || $scope.teerCars[teerCar_id.isActive == 1]) {
        $scope.teerCars[teerCar_id].isActive = 1
        // $scope.activeGroups.push(parseInt(teerCar_id))
      } else {
        $scope.teerCars[teerCar_id].isActive = 0
      }
    })
    $log.log('$scope.teerCars' + dump($scope.teerCars, 'none'))
  })

  $scope.updateAssignment = function(teerCarId, paramToUpdate) {
    $log.log("$scope.updateAssignment is running for group" + $scope.teerCars[teerCarId])
    var updatePromise = updateActiveTeerCar(teerCarId, paramToUpdate)
    updatePromise.then(function success() {
    }, function failure() {
      $mdToast.show($mdToast.simple().textContent('Failed to update database. Please try again.').highlightClass('md-warn'))
    })
  }

  $scope.addNew = function () {
    var teerCarPromise = addTeerCarModal($scope.carpoolSites, $scope.projectSites, $scope.getSitesForProject)

    teerCarPromise.then(function success(newCar) {
      $scope.teerCars[newCar.teerCar_id] = newCar
      $log.log("New car: " + dump($scope.teerCars[newCar.carpoolSite_id], 'none'))
    })
  }

  $scope.delete = function (id) {
    deleteTeerCar(id).then(function success() {
      delete $scope.teerCars[id]
    })
  }

}])

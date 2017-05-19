var app = angular.module('adminApp')

app.controller('CarpoolPanelController', ['$scope', '$log', '$q', '$mdToast', '$mdDialog', 'getProjectSites', 'getCrew', 'addCrewPanelModal', 'addVanPanelModal', 'addTeerCarModal', 'updateActiveCrew', 'deleteTeerCar', 'updateVan', function($scope, $log, $q, $mdToast, $mdDialog, getProjectSites, getCrew, addCrewPanelModal, addVanPanelModal, addTeerCarModal, updateActiveCrew, deleteTeerCar, updateVan) {

  $scope.speedDialIsOpen = false

  $scope.$watchCollection(
    function () {
        var returnObj = {}
        // $log.log("The watchListener is running!")
        angular.forEach($scope.carpoolSites, function(info, id) {
          // $log.log("Info: " + dump(info, 'none'))
          returnObj[id+'_crew'] = info.assignedCrew.length
          returnObj[id+'_vans'] = info.assignedVans.length
          returnObj[id+'_teerCars'] = info.assignedTeerCars.length
        })
        return returnObj
      // return $scope.carpoolSites['nv'].assignedTeerCars
    },
    function (newVal, oldVal) {
      $log.log("The watch callback is running!")
      // $log.log("newVal: " + dump(newVal, 'none') + ", oldVal: " + dump(oldVal, 'none'))
      var sitesToUpdate = []
      angular.forEach(newVal, function(length, id) {
        if (length != oldVal[id]) {
          // -- get id as substring of id_<crew/van/teerCar>
          var index = id.indexOf('_')
          var id_proper = id.substring(0, index)

          if (sitesToUpdate.indexOf(id_proper) < 0) {
            sitesToUpdate.push(id_proper)
          }
        }
      })
      // $log.log("sitesToUpdate: " + dump(sitesToUpdate, 'none'))

      angular.forEach(sitesToUpdate, function(siteId) {
        var numCrewSeatbelts = 0
        var numVanSeatbelts = 0
        var numTeerCarSeatbelts = 0

        if ($scope.carpoolSites[siteId].assignedCrew) {
          angular.forEach($scope.carpoolSites[siteId].assignedCrew, function(currentCrewId) {
            numCrewSeatbelts += parseInt($scope.crew[currentCrewId].numSeatbelts)
          })
        }

        if ($scope.carpoolSites[siteId].assignedVans) {
          angular.forEach($scope.carpoolSites[siteId].assignedVans, function(currentVan) {
            numVanSeatbelts += parseInt($scope.vans[currentVan].numSeatbelts)
          })
        }

        if ($scope.carpoolSites[siteId].assignedTeerCars.length) {
          angular.forEach($scope.carpoolSites[siteId].assignedTeerCars, function(currentTeerCar) {
            // $log.log("forEach for the assignedTeerCars ran!")
            numTeerCarSeatbelts += parseInt($scope.teerCars[currentTeerCar].assignedNumPassengers)
          })
        }

        // $log.log("numCrewSeatbelts: " + numCrewSeatbelts + ", numVanSeatbelts: " + numVanSeatbelts + ", numTeerCarSeatbelts: " + numTeerCarSeatbelts)
        $scope.carpoolSites[siteId].numSeatbelts = numCrewSeatbelts + numVanSeatbelts + numTeerCarSeatbelts
      })
    }
  )

  $scope.addCrew = function(carpoolSite) {
    $log.log("carpoolSite, before addCrewPanelModal: " + dump($scope.carpoolSites[carpoolSite].assignedCrew, 'none'))
    addCrewPanelModal(carpoolSite, $scope.crew, $scope.carpoolSites, $scope.projectSites).then(function success (personId) {
      $log.log("carpoolSite, after addCrewPanelModal, before updateActiveCrew: " + dump($scope.carpoolSites[carpoolSite].assignedCrew, 'none'))
        updateActiveCrew(personId, 1, {'carpoolSite_id':carpoolSite}).then(function success (response) {
          $log.log("carpoolSite, after updateActiveCrew: " + dump($scope.carpoolSites[carpoolSite].assignedCrew, 'none'))
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
            $log.log("AssignedCrew Before: " + dump($scope.carpoolSites[carpoolSite].assignedCrew, 'none'))
            $scope.carpoolSites[carpoolSite].assignedCrew.push(personId)
            $log.log('AssignedCrew After: ' + dump($scope.carpoolSites[carpoolSite].assignedCrew, 'none'))
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
      updateActiveCrew(withId, 0).then(function success(response) {
        $log.log("Response from updateActiveCrew: " + dump(response, 'none'))
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

  $scope.removeTeerCar = function (teerCarId, carpoolSite) {
    deleteTeerCar(teerCarId).then(function success () {
      var index = $scope.carpoolSites[carpoolSite].assignedTeerCars.indexOf(teerCarId)
      $scope.carpoolSites[carpoolSite].assignedTeerCars.splice(index, 1)
      delete $scope.teerCars[teerCarId]
    }, function failure () {
      // error handling
    })
  }

  $scope.addVan = function (carpoolSite) {
    addVanPanelModal(carpoolSite, $scope.vans, $scope.carpoolSites).then(function success (vanId) {
        updateVan(vanId, 1, {'carpoolSite':carpoolSite}).then(function success() {
          // remove this van from its current carpool site, if it has one
          if ($scope.vans[vanId].carpoolSite != null && $scope.vans[vanId].carpoolSite != '') {
            var index = $scope.carpoolSites[$scope.vans[vanId].carpoolSite].assignedVans.indexOf(vanId)
            $scope.carpoolSites[$scope.vans[vanId].carpoolSite].assignedVans.splice(index, 1)
          }

          $scope.vans[vanId].carpoolSite = carpoolSite
          $scope.vans[vanId].isOnLogistics = 1
          $scope.carpoolSites[$scope.vans[vanId].carpoolSite].assignedVans.push(vanId)
        }, function failure() {
          // error handling
      })
    })
  }

  $scope.removeVan = function (vanId, carpoolSite) {
    updateVan(vanId, 0).then(function success () {
      var index = $scope.carpoolSites[carpoolSite].assignedVans.indexOf(vanId)
      $scope.carpoolSites[carpoolSite].assignedVans.splice(index, 1)
      // delete $scope.vans[vanId]
    }, function failure () {
      // error handling
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


app.controller('ProjectPanelController', ['$scope', '$log', '$q', '$mdToast', '$mdDialog', 'getProjectSites', 'getCrew', 'addCrewProjectPanelModal', 'addVanProjectPanelModal', 'addTeerCarProjectPanelModal', 'updateActiveCrew', 'updateVan', 'updateActiveTeerCar', function($scope, $log, $q, $mdToast, $mdDialog, getProjectSites, getCrew, addCrewProjectPanelModal, addVanProjectPanelModal, addTeerCarProjectPanelModal, updateActiveCrew, updateVan, updateActiveTeerCar) {

  $scope.addCrew = function(projectSite) {
    addCrewProjectPanelModal(projectSite, $scope.crew, $scope.carpoolSites, $scope.projectSites).then(function success (personId) {
        var params = {
          'site' : projectSite
        }

        // If this person is being put on logistics, their carpoolSite_id may not be set yet, so set it to their primary carpool site
        if ($scope.crew[personId].carpoolSite_id == null || $scope.crew[personId].carpoolSite_id == '') {
          params['carpoolSite_id'] = $scope.crew[personId].primaryCarpool_id
          $scope.crew[personId].carpoolSite_id = $scope.crew[personId].primaryCarpool_id
        }
        updateActiveCrew(personId, 1, params).then(function success (response) {
            $log.log('updateActiveCrew response: ' + dump(response, 'none'))
            var personId = response.config.params.personId
            // In case this person is already on logistics for another carpool site, delete them from that site's array
            if ($scope.crew[personId].assignedToSite_id) {
              var index = $scope.projectSites[$scope.crew[personId].assignedToSite_id].assignedCrew.indexOf(personId)
              $scope.projectSites[$scope.crew[personId].assignedToSite_id].assignedCrew.splice(index, 1)
            }

            // If this person is not already in $scope.activeCrew, push them to it
            var activeIndex = $scope.activeCrew.indexOf(personId)
            if (activeIndex == -1) {
              $scope.activeCrew.push(personId)
            }

            // If this person is not already in their carpool site's assignedCrew[], push them to it
            var assignedIndex = $scope.carpoolSites[$scope.crew[personId].carpoolSite_id].assignedCrew.indexOf(personId)
            if (assignedIndex == -1) {
              $scope.carpoolSites[$scope.crew[personId].carpoolSite_id].assignedCrew.push(personId)
            }

            $scope.crew[personId].assignedToSite_id= projectSite
            $scope.crew[personId].isOnLogistics = 1
            $scope.projectSites[projectSite].assignedCrew.push(personId)
            $log.log('AssignedCrew: ' + dump($scope.projectSites[projectSite].assignedCrew, 'none'))
        })
    })
  }

  $scope.removeCrew = function (withId, firstName, projectSite) {
    var defer = $q.defer()
    $log.log("project site: " + projectSite)

    if ($scope.crew[withId].hasPermanentAssignment == 1) {
      var confirm = $mdDialog.confirm()
          .title(`${firstName} is permanently assigned to ${$scope.projectSites[projectSite].name}.`)
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
      updateActiveCrew(withId, 1, {'site':''}).then(function success() {
        $scope.crew[withId].assignedToSite_id = ''

        var index = $scope.projectSites[projectSite].assignedCrew.indexOf(withId)
        $scope.projectSites[projectSite].assignedCrew.splice(index, 1)

        index = $scope.activeCrew.indexOf(withId)
        $scope.activeCrew.splice(index)
      })
    }, function no() {
      return
    })
  }

  $scope.addVan = function (projectSite) {
    addVanProjectPanelModal(projectSite, $scope.vans, $scope.carpoolSites, $scope.projectSites).then(function success (vanId) {
        updateVan(vanId, 1, {'assignedToSite':projectSite}).then(function success(response) {
          $log.log("updateVan response: " + dump(response, 'none'))
          // remove this van from its current carpool site, if it has one
          if ($scope.vans[vanId].assignedToSite != null && $scope.vans[vanId].assignedToSite != '') {
            var index = $scope.projectSites[$scope.vans[vanId].assignedToSite].assignedVans.indexOf(vanId)
            $scope.projectSites[$scope.vans[vanId].assignedToSite].assignedVans.splice(index, 1)
          }

          // if this van is just being added to logistics, add it to its carpool site's assignedVans[]
          if ($scope.vans[vanId].isOnLogistics != 1) {
            if ($scope.vans[vanId].carpoolSite) {
              $scope.carpoolSites[$scope.vans[vanId].carpoolSite].assignedVans.push(vanId)
            }
          }

          $scope.vans[vanId].assignedToSite = projectSite
          $scope.vans[vanId].isOnLogistics = 1
          $scope.projectSites[$scope.vans[vanId].assignedToSite].assignedVans.push(vanId)
        }, function failure() {
          // error handling
      })
    })
  }

  $scope.removeVan = function (vanId, projectSite) {
    updateVan(vanId, 1, {'assignedToSite':''}).then(function success () {
      var index = $scope.projectSites[projectSite].assignedVans.indexOf(vanId)
      $scope.projectSites[projectSite].assignedVans.splice(index, 1)
      $scope.vans[vanId].assignedToSite = ''
    }, function failure () {
      // error handling
    })
  }

  $scope.addTeerCar = function (projectSite) {
    addTeerCarProjectPanelModal(projectSite, $scope.teerCars, $scope.carpoolSites, $scope.projectSites).then(function success (teerCarId) {
        var params = {
          'assignedToSite': projectSite
        }
        updateActiveTeerCar(teerCarId, params).then(function success() {
          if ($scope.teerCars[teerCarId].assignedToSite != null && $scope.teerCars[teerCarId].assignedToSite != '') {
            if ($scope.projectSites[$scope.teerCars[teerCarId].assignedToSite].assignedTeerCars) {
                var index = $scope.projectSites[$scope.teerCars[teerCarId].assignedToSite].assignedTeerCars.indexOf(teerCarId)
                $scope.projectSites[$scope.teerCars[teerCarId].assignedToSite].assignedTeerCars.splice(index, 1)
            }
          }
          $scope.teerCars[teerCarId].assignedToSite = projectSite
          $scope.projectSites[projectSite].assignedTeerCars.push(teerCarId)
        }, function failure() {
          // error handling
        })
    })
  }

  $scope.removeTeerCar = function (teerCarId, projectSite) {
    var params = {
      'assignedToSite': ''
    }
    updateActiveTeerCar(teerCarId, params).then(function success () {
      if ($scope.teerCars[teerCarId].assignedToSite != null && $scope.teerCars[teerCarId].assignedToSite != '') {
        if ($scope.projectSites[$scope.teerCars[teerCarId].assignedToSite].assignedTeerCars) {
            var index = $scope.projectSites[$scope.teerCars[teerCarId].assignedToSite].assignedTeerCars.indexOf(teerCarId)
            $scope.projectSites[$scope.teerCars[teerCarId].assignedToSite].assignedTeerCars.splice(index, 1)
        }
      }

      $scope.teerCars[teerCarId].assignedToSite = ''
    }, function failure () {
      // error handling
    })
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

  $scope.inkRipple = function(ev) {
    var row = angular.element(ev.target).parent().parent().parent()
    $mdInkRipple.attach($scope, row, {dimBackground: true})
  }

  $scope.addNew = function () {
    addProjectSiteModal().then(function success(newSite) {
      $log.log("recieved this from addProjectSiteModal: " + dump(newSite, 'none'))
      $scope.projectSites[newSite.id] = newSite
      if (newSite.isActive) {
        $scope.activeSites.push(newSite.id)
      }
      // $log.log("projectSites: " + dump($scope.projectSites, 'none'))
    })
  }
}])

// filter used in siteSelect view
app.filter('orderSites', function() {
  return function(projectSites) {
    // Adapted from sorting filter by Justin Klemm @ justinklemm.com
    var sites_filtered = []
    angular.forEach(projectSites, function(currentSite) {
      sites_filtered.push(currentSite)
    })
    sites_filtered.sort(function(a, b) {
      return a.name.localeCompare(b.name)
    })
    return sites_filtered
  }
})

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

app.controller('SaveAttendanceRecordsController', ['$scope', '$log', '$state', 'pushAttendanceRecords', function($scope, $log, $state, pushAttendanceRecords) {

  $scope.forDate = setAttendanceDate()
  function setAttendanceDate () {
    var myDate = new Date()

    while (myDate.getDay() > 5 || myDate.getDay() < 2) {
      myDate.setDate(myDate.getDate() - 1)
    }

    $log.log("Date is " + myDate.toLocaleDateString())
    return myDate
  }

  $scope.saveAttendance = function () {
    pushAttendanceRecords().then(function success () {
      $scope.attendanceDidSucceed = true
    }, function failure () {
      $scope.attendanceDidFail = true
    })
  }

  $scope.toLogistics = function (willForceGo) {
    $log.log("willForceGo: " + willForceGo)
    $state.get('logistics').data['forceGo'] = willForceGo
    $state.transitionTo('logistics')
  }


}])

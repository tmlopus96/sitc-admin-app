<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $query = "SELECT ch.person_id, ch.carpoolSite_id, ch.assignedToProject, ch.assignedToSite_id, ch.driverStatus, ch.assignedToDriver_id, ch.isCheckedIn, p.isCrew FROM CheckedIn ch, Person p WHERE ch.person_id=p.person_id";
  echo $query . '\n';
  $checkedIn_result = $connection->query($query);

  if (!$checkedIn_result) {
    die ($connection->error);
  }

  $rows = [];
  while ($currentPerson = $checkedIn_result->fetch_assoc()) {

    if (!$currentPerson['isCheckedIn']) {
      break;
    }

    $row = [];

    $row[0] = $currentPerson['person_id'];
    $row[1] = "'" . $currentPerson['carpoolSite_id'] . "'";
    $row[2] = "'" . $currentPerson['assignedToProject'] . "'";
    $row[3] = "'" . $currentPerson['assignedToSite_id'] . "'";

    if ($currentPerson['driverStatus'] == 'isDriver') {
      $row[4] = 1;
    } else {
      $row[4] = 0;
    }

    $row[5] = ($currentPerson['assignedToDriver_id']) ? $currentPerson['assignedToDriver_id'] : 0;

    if ($currentPerson['isCrew'] == 1 || $currentPerson['driverStatus'] == 1) {
      $row[6] = 5;
    } else {
      $row[6] = 4;
    }

    $rowString = implode(', ', $row);
    array_push($rows, "($rowString)");

  }

  $rowsString = implode(', ', $rows);

  /*** Array Indices ***
    [0] person_id
    [1] carpoolSite_id
    [2] assignedToProject
    [3] assignedToSite_id
    [4] wasDriver
    [5] assignedToDriver_id
    [6] numHoursToCredit
  ***/

  $query = "INSERT INTO AttendanceRecord (person_id, carpoolSite_id, assignedToProject, assignedToSite_id, wasDriver, assignedToDriver_id, numHoursToCredit) VALUES $rowsString";
  $attendanceRecords_result = $connection->query($query);

  if (!attendanceRecords_result) {
    die ($connection->error);
  }

  $query = "DELETE FROM CheckedIn WHERE isOnLogistics=0 || isOnLogistics IS NULL";
  $connection->query($query);

  $query = "UPDATE CheckedIn SET isCheckedIn=0";
  $connection->query($query);

  echo $query . '\n';


?>

<?php
  function sanitize($var) {
    $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
    return $clean_var;
  }
?>

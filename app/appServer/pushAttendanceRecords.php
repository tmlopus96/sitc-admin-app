<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $query = "SELECT ch.person_id, ch.carpoolSite_id, ch.assignedToProject, ch.assignedToSite_id, ch.driverStatus, ch.assignedToDriver_id, ch.isCheckedIn, p.isCrew FROM CheckedIn ch, Person p WHERE ch.person_id=p.person_id AND ch.isCheckedIn=1";
  echo $query . '\n';
  $checkedIn_result = $connection->query($query);

  if (!$checkedIn_result) {
    die ($connection->error);
  }
  else {
    echo json_encode($checkedIn_result);
  }

// this has to be before the if (num_rows>0) statement because it is used by the very last query either way
date_default_timezone_set('America/Detroit');
$dateOfService = new DateTime();
while (date('w', $dateOfService->getTimestamp()) > 5 || date('w', $dateOfService->getTimestamp()) < 2) {
  $dateOfService->sub(new DateInterval('P1D'));
}

if (date('G', $dateOfService->getTimestamp() < 8)) {
  do {
    $dateOfService->sub(new DateInterval('P1D'));
  } while (date('w', $dateOfService->getTimestamp()) < 2 || date('w', $dateOfService->getTimestamp()) > 5);
}

echo date('w-G', $dateOfService->getTimestamp());
echo "Date: " . "&nbsp;";
echo date('Y-m-d', $dateOfService->getTimestamp());

if ($checkedIn_result->num_rows > 0) {
    // set the dateOfService for this round of attendance records

    $rows = [];
    while ($currentPerson = $checkedIn_result->fetch_assoc()) {
      if (!$currentPerson['isCheckedIn']) {
        break;
      }

      $row = [];

      $row[0] = "'" . date('Y-m-d', $dateOfService->getTimestamp()) . "'";
      $row[1] = $currentPerson['person_id'];
      $row[2] = "'" . $currentPerson['carpoolSite_id'] . "'";
      $row[3] = "'" . $currentPerson['assignedToProject'] . "'";
      $row[4] = "'" . $currentPerson['assignedToSite_id'] . "'";
      $row[5] = ($currentPerson['driverStatus'] == 'isDriver') ? 1 : 0;
      $row[6] = ($currentPerson['assignedToDriver_id']) ? $currentPerson['assignedToDriver_id'] : 0;
      $row[7] = ($currentPerson['isCrew'] || $currentPerson['driverStatus'] == 1) ? 5 : 4;

      $rowString = implode(', ', $row);
      echo "Imploded row: ";
      var_dump($rowString);
      echo '\n';
      array_push($rows, "($rowString)");

    }

    $rowsString = implode(', ', $rows);
    echo $rowsString;

    /*** Array Indices ***
      [0] dateOfService
      [1] person_id
      [2] carpoolSite_id
      [3] assignedToProject
      [4] assignedToSite_id
      [5] wasDriver
      [6] assignedToDriver_id
      [7] numHoursToCredit
    ***/

    $query = "INSERT INTO AttendanceRecord (dateOfService, person_id, carpoolSite_id, assignedToProject, assignedToSite_id, wasDriver, assignedToDriver_id, numHoursToCredit) VALUES $rowsString";
    echo $query;
    $attendanceRecords_result = $connection->query($query);

    if (!$attendanceRecords_result) {
      die ($connection->error);
    }

    $query = "DELETE FROM CheckedIn";
    $connection->query($query);

    $query = "DELETE FROM TempRegistration";
    $connection->query($query);

    $query = "UPDATE CheckedIn SET isCheckedIn=0";
    $connection->query($query);
  } // end if(num_rows > 0)

  $dateForQuery = date('Y-m-d', $dateOfService->getTimestamp());
  $query = "UPDATE SessionVals SET lastAttendanceRecordPush='$dateForQuery', projectSitesHaveBeenSetToday=0";
  $connection->query($query);

  echo $query . '\n';

?>

<?php
  function sanitize($var) {
    $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
    return $clean_var;
  }
?>

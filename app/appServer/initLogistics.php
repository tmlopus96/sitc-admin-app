<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $query = "SELECT person_id, assignedSite FROM Crew WHERE hasPermanentAssignment=1";
  echo "*** Query 1 ***" . $query;
  $result = $connection->query($query);

  if ($connection->error) {
    die ($connection->error);
  }

  $permAssigns = array();
  while ($currentPerson = $result->fetch_assoc()) {
    $permAssigns[] = $currentPerson['person_id'];
  }

  $query = "INSERT INTO CheckedIn (person_id, carpoolSite_id, assignedToProject, assignedToSite_id)
      SELECT Crew.person_id, Person.primaryCarpool_id, Crew.assignedProject, Crew.assignedSite
      FROM Crew LEFT JOIN Person ON Person.person_id=Crew.person_id
      WHERE Crew.hasPermanentAssignment=1
      ON DUPLICATE KEY UPDATE CheckedIn.person_id=Crew.person_id, CheckedIn.carpoolSite_id=Person.primaryCarpool_id, CheckedIn.assignedToProject=Crew.assignedProject, CheckedIn.assignedToSite_id=Crew.assignedSite, CheckedIn.isOnLogistics=1, CheckedIn.isCheckedIn=1";


  echo "*** Query 2 ***" . $query;

  $result = $connection->query($query);
  if ($connection->error) {
    die ($connection->error);
  }

  $query = "UPDATE CheckedIn SET isOnLogistics=1, isCheckedIn=0";
  $result = $connection->query($query);

  if ($connection->error) {
    die ($connection->error);
  }


?>

<?php
  function sanitize($var) {
    $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
    return $clean_var;
  }
?>

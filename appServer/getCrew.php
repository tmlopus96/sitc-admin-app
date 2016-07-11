<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $query = "SELECT c.*, p.firstName, p.lastName, p.primaryCarpool_id, p.hasCar, p.numSeatbelts, ch.isOnLogistics FROM Crew c LEFT JOIN Person p ON c.person_id=p.person_id LEFT JOIN CheckedIn ch ON c.person_id=ch.person_id";
  $crew_result = $connection->query($query);
  if ($connection->error) {
    die ($connection->error);
  }

  $crew = array();
  while ($currentCrew = $crew_result->fetch_assoc()) {
    $crew[] = $currentCrew;
  }

  echo json_encode($crew);

 ?>

 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
 ?>

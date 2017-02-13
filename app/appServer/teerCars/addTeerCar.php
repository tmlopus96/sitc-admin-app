<?php

/*** Inserts a new volunteer car into VolunteerCar, active by default ***/

require_once '../sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $car = json_decode($_GET["car"], true);
  foreach ($car as $key => $value) {
    $value = sanitize($value);
  }

  $queryFields = array_keys($car);
  $queryValues = array();
  foreach ($queryFields as $value) {
    array_push($queryValues, $car[$value]);
  }

  $queryFields = join(', ', $queryFields);
  $queryValues = '"' . join('", "', $queryValues) . '"';

  $query = "INSERT INTO VolunteerCar ($queryFields) VALUES ($queryValues)";
  error_log("Query: " . $query);
  $queryResult = $connection->query($query);
  if (!$queryResult)
    die ($connection->error);

?>

 <?php
    function sanitize($var) {
      $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
      return $clean_var;
    }
 ?>

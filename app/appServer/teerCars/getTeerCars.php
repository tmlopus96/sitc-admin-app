<?php

  require_once '../sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $query = "SELECT * FROM VolunteerCar";
  $cars_result = $connection->query($query);
  if ($connection->error) {
    die ($connection->error);
  }

  $teerCars = array();
  while ($currentCar = $cars_result->fetch_assoc()) {
    $teerCars[] = $currentCar;
  }

  echo json_encode($teerCars);

 ?>

 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
 ?>

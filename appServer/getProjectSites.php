<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $query = "SELECT * FROM ProjectSite";
  $projectSites_result = $connection->query($query);
  if ($connection->error) {
    die ($connection->error);
  }

  $sites = array();
  while ($currentSite = $projectSites_result->fetch_assoc()) {
    $sites[] = $currentSite;
  }

  echo json_encode($sites);

 ?>

 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
 ?>

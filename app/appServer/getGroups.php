<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $query = "SELECT * FROM VolunteerGroup";
  $group_result = $connection->query($query);
  if ($connection->error) {
    die ($connection->error);
  }

  $group = array();
  while ($currentGroup = $group_result->fetch_assoc()) {
    error_log("current group: " . $currentGroup["name"]);
    $group[] = $currentGroup;
  }

  echo json_encode($group);

 ?>

 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
 ?>

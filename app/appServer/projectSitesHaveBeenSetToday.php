<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $query = "SELECT projectSitesHaveBeenSetToday FROM SessionVals";
  $result = $connection->query($query);
  if ($connection->error) {
    die ($connection->error);
  }

  while ($val = $result->fetch_assoc()) {
    $sitesSet = $val['projectSitesHaveBeenSetToday'];
  }

  echo $sitesSet;

 ?>

 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
 ?>

<?php

/*** Inserts a new site into ProjectSite, active by default ***/

require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $site = json_decode($_GET["site"], true);
  foreach ($site as $key => $value) {
    $value = sanitize($value);
  }

  $queryFields = array_keys($site);
  $queryValues = array();
  foreach ($queryFields as $value) {
    array_push($queryValues, $site[$value]);
  }

  // generate projectSite_id and add it to the arrays
  array_push($queryFields, "projectSite_id");
  $id = ucwords(strtolower($site["name"]));
  error_log("id: " . $id);
  $id = preg_replace('/\W/', '', $id);
  error_log("id: " . $id);
  array_push($queryValues, $id);

  $queryFields = join(', ', $queryFields);
  $queryValues = '"' . join('", "', $queryValues) . '"';

  $query = "INSERT INTO ProjectSite ($queryFields) VALUES ($queryValues)";
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

<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $projectSite_id = "'" . sanitize($_GET["projectSite_id"]) . "'";

  $updateClauses = [];

  if (isset($_GET["minTeers"])) {
    $minTeers = sanitize($_GET["minTeers"]);
    array_push($updateClauses, "minTeers=" . $minTeers);
  }

  if (isset($_GET["optimalTeers"])) {
    $optimalTeers = sanitize($_GET["optimalTeers"]);
    array_push($updateClauses, "optimalTeers=" . $optimalTeers);
  }

  if (isset($_GET["maxTeers"])) {
    $maxTeers = sanitize($_GET["maxTeers"]);
    array_push($updateClauses, "maxTeers=" . $maxTeers);
  }

  $updateStr = join(', ', $updateClauses);
  $query = "Update ProjectSite SET $updateStr WHERE projectSite_id=$projectSite_id";
  echo $query;
  $result = $connection->query($query);

  if (!$result) {
    die ($connection->error);
  }

  if ($result) {
    echo "success";
  } else {
    http_response_code(500);
    exit('serverFail');
  }


?>

<?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
?>

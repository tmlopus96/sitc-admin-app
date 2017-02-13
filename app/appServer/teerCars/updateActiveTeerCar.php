<?php

  require_once '../sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $teerCarId = sanitize($_GET["teerCarId"]);
  echo "teerCarId: " . $teerCarId;

  $queryFields = ["teerCar_id"];
  $queryValues = [$teerCarId];
  $updateClauses = [];


  if (isset($_GET["assignedNumPassengers"])) {
    $assignedNumPassengers = $_GET["assignedNumPassengers"];
    array_push($queryFields, 'assignedNumPassengers');
    array_push($queryValues, $assignedNumPassengers);
    array_push($updateClauses, "assignedNumPassengers=" . $assignedNumPassengers);
  }

  if (isset($_GET["assignedToSite"])) {
    $assignedToSite = $_GET["assignedToSite"];
    array_push($queryFields, 'assignedToSite');
    array_push($queryValues, $assignedToSite);
    array_push($updateClauses, "assignedToSite='" . $assignedToSite . "'");
  }

  $fieldsStr = join(', ', $queryFields);
  $valuesStr = '"' . join('", "', $queryValues) . '"';
  $updateStr = join(', ', $updateClauses);
  $query = "INSERT INTO VolunteerCar ($fieldsStr) VALUES ($valuesStr) ON DUPLICATE KEY UPDATE $updateStr";
  echo $query;
  $result = $connection->query($query);

  if (!$result) {
    die ($connection->error);
  }

  if ($result) {
    echo "succes";
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

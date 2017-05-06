<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $vanId = sanitize($_GET["vanId"]);
  // echo "vanId: " . $vanId;

  $queryFields = ["van_id"];
  $queryValues = [$vanId];
  $updateClauses = [];

  if (isset($_GET["isOnLogistics"])) {
    $isOnLogistics = $_GET["isOnLogistics"];
    array_push($queryFields, 'isOnLogistics');
    array_push($queryValues, $isOnLogistics);
    array_push($updateClauses, "isOnLogistics=" . $isOnLogistics);
  }

  if (isset($_GET["numPassengers"])) {
    $numPassengers = $_GET["numPassengers"];
    array_push($queryFields, 'numPassengers');
    array_push($queryValues, $numPassengers);
    array_push($updateClauses, "numPassengers=" . $numPassengers);
  }

  if (isset($_GET["numSeatbelts"])) {
    $numSeatbelts = $_GET["numSeatbelts"];
    array_push($queryFields, 'numSeatbelts');
    array_push($queryValues, $numSeatbelts);
    array_push($updateClauses, "numSeatbelts=" . $numSeatbelts);
  }

  if (isset($_GET["carpoolSite"])) {
    $carpoolSite = $_GET["carpoolSite"];
    array_push($queryFields, 'carpoolSite');
    array_push($queryValues, $carpoolSite);
    array_push($updateClauses, "carpoolSite='" . $carpoolSite . "'");
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
  $query = "INSERT INTO Van ($fieldsStr) VALUES ($valuesStr) ON DUPLICATE KEY UPDATE $updateStr";
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

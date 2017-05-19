<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $personId = sanitize($_GET["personId"]);
  echo "personId: " . $personId;

  $queryFields = ["person_id"];
  $queryValues = [$personId];
  $updateClauses = [];

  if (isset($_GET["isActive"])) {
    $isActive = sanitize($_GET["isActive"]);
    array_push($queryFields, 'isOnLogistics');
    array_push($queryValues, $isActive);
    array_push($updateClauses, "isOnLogistics=" . $isActive);
  }

  if (isset($isActive) && $isActive == 0) {
      $carpoolSite = '';
      array_push($queryFields, 'carpoolSite_id');
      array_push($queryValues, $carpoolSite);
      array_push($updateClauses, "carpoolSite_id='" . $carpoolSite . "'");
  }
  else if (isset($_GET["carpoolSite_id"])) {
    $carpoolSite = sanitize($_GET["carpoolSite_id"]);
    array_push($queryFields, 'carpoolSite_id');
    array_push($queryValues, $carpoolSite);
    array_push($updateClauses, "carpoolSite_id='" . $carpoolSite . "'");
  }

  if (isset($_GET["site"])) {
    $site = $_GET["site"];
    array_push($queryFields, 'assignedToSite_id');
    array_push($queryValues, $site);
    array_push($updateClauses, "assignedToSite_id='" . $site . "'");
  }

  if (isset($_GET["numPassengers"])) {
    $numPassengers = $_GET["numPassengers"];
    array_push($queryFields, 'numPassengers');
    array_push($queryValues, $numPassengers);
    array_push($updateClauses, "numPassengers=" . $numPassengers);
  }

  if (isset($_GET["project"])) {
    $project = $_GET["project"];
    array_push($queryFields, 'assignedToProject');
    array_push($queryValues, $project);
    array_push($updateClauses, "assignedToProject='" . $project . "'");
  }

  $fieldsStr = join(', ', $queryFields);
  $valuesStr = '"' . join('", "', $queryValues) . '"';
  $updateStr = join(', ', $updateClauses);
  $query = "INSERT INTO CheckedIn ($fieldsStr) VALUES ($valuesStr) ON DUPLICATE KEY UPDATE $updateStr";
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

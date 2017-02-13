<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $groupId = sanitize($_GET["groupId"]);
  echo "groupId: " . $groupId;

  $queryFields = ["group_id"];
  $queryValues = [$groupId];
  $updateClauses = [];

  if (isset($_GET["isActive"])) {
    $isActive = sanitize($_GET["isActive"]);
    array_push($queryFields, 'isActive');
    array_push($queryValues, $isActive);
    array_push($updateClauses, "isActive=" . $isActive);
  }

  if (isset($_GET["numVolunteers"])) {
    $numVolunteers = $_GET["numVolunteers"];
    array_push($queryFields, 'numVolunteers');
    array_push($queryValues, $numVolunteers);
    array_push($updateClauses, "numVolunteers=" . $numVolunteers);
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
  $query = "INSERT INTO VolunteerGroup ($fieldsStr) VALUES ($valuesStr) ON DUPLICATE KEY UPDATE $updateStr";
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

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

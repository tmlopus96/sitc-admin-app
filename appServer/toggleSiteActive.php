<?php

  require_once 'sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $siteId = sanitize($_GET["siteId"]);
  $isActive = sanitize($_GET["isActive"]);
  echo "siteId: " . $siteId;
  echo "isActive: " . $isActive;

  $query = "UPDATE ProjectSite SET isActive=$isActive WHERE projectSite_id='$siteId'";
  $result = $connection->query($query);

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

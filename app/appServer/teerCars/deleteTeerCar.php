<?php

  require_once '../sitc_workforce_creds.php';

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  if (isset($_GET['id'])) {
    $id = $_GET['id'];
  }
  else {
    exit(402); // request did not include proper parameters
  }

  $query = "DELETE FROM VolunteerCar WHERE teerCar_id=$id";
  $result = $connection->query($query);

  if ($result) {
    echo "succes";
  } else {
    exit(500); // server fail
  }

?>

<?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
?>

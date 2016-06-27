<?php

require_once 'sitc_workforce_creds.php';

echo ("Hello, World!");

$connection = new mysqli($hostname, $username, $password, $database);
if ($connection->connect_error)
  die ($connection->connect_error);

$filename = $_FILES['fileToUpload']['tmp_name'];
echo $filename;
//TODO: change to dynamically load input file
$inputFile = fopen($filename, "r") or die("could not open file");

$columns = fgetcsv($inputFile);
$columnsString = implode(', ', $columns);

$updateFields = [];
foreach ($columns as $myColumn) {
  $updateStr = "$myColumn=VALUES($myColumn)";
  array_push($updateFields, $updateStr);
}
$updateFieldsString = implode(', ', $updateFields);

$rows = [];
do {
    $row = [];
    $rowRaw = fgetcsv($inputFile);
    $_firstName = mysqli_real_escape_string($connection, $rowRaw[0]);
    $_lastName = mysqli_real_escape_string($connection, $rowRaw[1]);
    array_push($row, "'$_firstName'");
    array_push($row, "'$_lastName'");
    ($rowRaw[2] != '') ? array_push($row, "$rowRaw[2]") : array_push($row, "0");
    ($rowRaw[3] != '') ? array_push($row, "'$rowRaw[3]'") : array_push($row, "0");
    ($rowRaw[4] != '') ? array_push($row, "'$rowRaw[4]'") : array_push($row, "'all'");
    ($rowRaw[5] != '') ? array_push($row, "$rowRaw[5]") : array_push($row, "0");
    ($rowRaw[6] != '') ? array_push($row, "'$rowRaw[6]'") : array_push($row, "'0'");
    ($rowRaw[7] != '') ? array_push($row, "$rowRaw[7]") : array_push($row, "0");
    ($rowRaw[8] != '') ? array_push($row, "'$rowRaw[8]'") : array_push($row, "'0'");

    $rowString = implode(', ', $row);

    array_push($rows, "($rowString)");
} while (!feof($inputFile));

$rowsString = implode(',', $rows);

$query = "INSERT INTO Person ($columnsString) VALUES $rowsString ON DUPLICATE KEY UPDATE $updateFieldsString";

/*
$query = "INSERT INTO PERSON (firstName, lastName) VALUES ('lanie', 'james') ON DUPLICATE KEY UPDATE firstName=VALUES(firstName)";
*/

echo $query;

$result = $connection->query($query);
if (!$result)
  die ($connect_error);



?>

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

    //echo "row 3: " . $row[3] . "\n";

    switch ($row[3]) {
      case "'Bloomfield Hills'":
        $row[3] = "bf";
        break;
      case "'Berkley HS (Berkley)'":
        $row[3] = "brk";
        break;
      case "'Birmingham Groves HS (Beverly Hills)'":
        $row[3] = "gro";
        break;
      case "'Detroit Renaissance HS (Detroit)'":
        $row[3] = "ren";
        break;
      case "'Grosse Pointe South HS (Grosse Pointe)'":
        $row[3] = "gp";
        break;
      case "'North Farmington HS (Farmington Hills)'":
        $row[3] = "nf";
        break;
      case "'Northville HS (Northville)'":
        $row[3] = "nv";
        break;
      case "'Pioneer HS (Ann Arbor)'":
        $row[3] = "aa";
        break;
      case "'Troy HS (Troy)'":
        $row[3] = "troy";
        break;
      default:
        $row[3] = 'aa';

    }

    switch ($row[5]) {
      case 'I am 18, I meet the requirements and can drive if needed.':
        $row[5] = 1;
        break;
      case 'My child is 17, meets the requirements and has my permission to drive if needed.':
        $row[5] = 1;
        break;
      default:
        $row[5] = 0;
    }

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

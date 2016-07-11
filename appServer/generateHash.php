<?php

  $passwordRaw = $_GET['password'];

  echo password_hash($password, PASSWORD_DEFAULT);

 ?>

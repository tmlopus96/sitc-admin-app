<?php

  require_once('wufooApiWrapper/WufooApiWrapper.php');


  //API Key: FXRL-LPSN-VWJG-SCCK
  $wrapper = new WufooApiWrapper('FXRL-LPSN-VWJG-SCCK', 'sitc'); //create the class
  $identifier = 'm1c2ueyc11pbq9x';
  print_r($wrapper->getForms($identifier)); //Identifier can be either a form hash or form URL.

?>

<?php

/*
  Plugin name: Magic Edge - Lite
  URI: http://www.awssoft.com/magic-edge/
  Description: Image Background Remover provide easy way to remove background from complex photo.
  Author: Srdjan Arsic
  Version: 1.1.6
  Author URI: http://www.awssoft.com/
 */

defined('ABSPATH') or die("No script kiddies please!");

if (is_admin()) {
	include "MagicEdgeBackend.php";
    new AWSSOFT_MagicEdgeLite_Backend();
} else {
	include "MagicEdgeFrontend.php";
    new AWSSOFT_MagicEdgeLite_Frontend();
}

?>

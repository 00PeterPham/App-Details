<?php

if(isset($_GET["device_id"])) {
	$device_id = $_GET["device_id"];
	$timestamp = strtotime("-7 days");
	$jsonurl = "https://api.alertra.com/v1.1/devices/" . $device_id . "/uptime?Timestamp1=" . date("Y-m-d", $timestamp) . "T00:00:00";
	$opts = array(
	  'http'=>array(
	    'method'=>"GET",
	    'header'=>"Alertra-API-Key: 1246aaadea5163ae6efddffe84b9fe4ffe903ed8\r\n" .
		      "Content-type: application/json\r\n"
	  )
	);
	
	$context = stream_context_create($opts);
	
	$file = file_get_contents($jsonurl, false, $context);
	
	echo $file;

} else {
	echo "No device id.";
}

?>

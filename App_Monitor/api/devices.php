<?php
	$jsonurl = "https://api.alertra.com/v1.1/devices?api_key=1246aaadea5163ae6efddffe84b9fe4ffe903ed8&fmt=json";
	$json = file_get_contents($jsonurl);
	echo $json;
?>
var uptimeApp = angular.module('uptimeApp',[]);

uptimeApp.controller('uptimeCTRL', ['$scope', '$http', function (scope, http){	
	//Call to device API
	http.get('api/devices.php').success(function(data){		
		scope.devices = data;	
		
		var DevID = [];	
		var j = 0;
		var z = 0; //increments once per response time call
		var arrayLength = 0;
		var largestRtime = 0;

		//Gets Devices IDs and Stores in array
		angular.forEach(scope.devices, function(obj,i) {												
			// console.log(obj.device_id);				
			// scope.devices[i] = obj.device_id;
			DevID[i] = obj.device_id;				
			// Uptime = getDeviceUptime(scope.devices[i]);
			// Details = getDeviceDetails(scope.devices[i]);			

			getDeviceUptime(DevID[i]).then(function(data) {
				// console.log(data);

				var UpSecs = data.Uptime.UpSeconds;
				var DownSecs = data.Uptime.DownSeconds;
				var Uptime_t = (UpSecs / (UpSecs + DownSecs)) * 100;

				//ADDs uptime values to existing JSON
				scope.devices[i].uptimes = Uptime_t.toFixed(3);	
		
				// console.log(data.Uptime.UpSeconds);
			});							

			getDeviceDetails(DevID[i]).then(function(data) {
				console.log(data);
				// console.log(z);				
				console.log("data length " + data.length);

				var DNStime = [];
				var SSLtime = [];
				var Ctime = [];
				var FBtime = [];
				var LBtime = [];
				var chkRslt = [];

				var sumDNS = 0;
				var sumDNS = 0;	
				var sumSSL = 0;
				var	sumCON = 0;
				var	sumFB = 0;
				var	sumLB = 0;	

				//Calculates average of response times
				angular.forEach(data, function(obj,i) {
					// arrayLength++;
					// console.log("array length " + arrayLength);
					// console.log(i); increments 0 - 12
					// console.log('i ' +  i);

					DNStime[i] = data[i].DNSTime;
					SSLtime[i] = data[i].SSLTime;
					Ctime[i] = data[i].ConnectTime;
					FBtime[i] = data[i].TTFB;
					LBtime[i] = data[i].TTLB;

					// console.log(SSLtime[i]);

					sumDNS += parseInt( DNStime[i], 10 );	
					sumSSL += parseInt( SSLtime[i], 10 );
					sumCON += parseInt( Ctime[i], 10 );
					sumFB += parseInt( FBtime[i], 10 );
					sumLB += parseInt( LBtime[i], 10 );				
				});
				// console.log("SUM " + sumSSL);
				// console.log("arrayLength " + arrayLength);

				var avgDNS = sumDNS/data.length;
				var avgSSL = sumSSL/data.length;
				var avgCON = sumCON/data.length;
				var avgFB = sumFB/data.length;
				var avgLB = sumLB/data.length;

				console.log("AVG " + avgLB);	
				
				var statusColorArray = document.getElementsByClassName("status-color");	

				var Rtime = data[z].RequestTime;

				// var DNStime = data[z].DNSTime;
				// var SSLtime = data[z].SSLTime;
				// var Ctime = data[z].ConnectTime;
				// var FBtime = data[z].TTFB;
				// var LBtime = data[z].TTLB;	

				// scope.devices[i].DNStime = DNStime[i].toFixed(2);					
				// scope.devices[i].SSLtime = SSLtime.toFixed(2);
				// scope.devices[i].Ctime = Ctime.toFixed(2);
				// scope.devices[i].FBtime = FBtime.toFixed(2);
				// scope.devices[i].LBtime = LBtime.toFixed(2);	

				scope.devices[i].DNStime = avgDNS.toFixed(2);
				scope.devices[i].SSLtime = avgSSL.toFixed(2);
				scope.devices[i].Ctime = avgCON.toFixed(2);
				scope.devices[i].FBtime = avgFB.toFixed(2);
				scope.devices[i].LBtime = avgLB.toFixed(2);

				// console.log(scope.devices[i].DNStime);			

				//Checks all CheckResults and sets status if all servers are down
				var stat = " ";

				angular.forEach(data, function(obj,i) {					
					chkRslt[i] = data[i].CheckResult;				
					// console.log('i ' +  i);			
					// console.log(chkRslt[z]);
					if (chkRslt[i] == "404 Not Found (Error)"){
						stat = " down";				 	
					 }else {				  	
					  	stat = " up";
					 }					 
				});
				statusColorArray[j].className = statusColorArray[j].className + stat;

				//Setting largest Response time as 100% bar
				 // console.log(Rtime);		
				 var requestArray = document.getElementsByClassName("request");

				 if (largestRtime < Rtime) {
				 	// console.log("largest RTIME" + largestRtime);
				 	// console.log("RTIME" + Rtime);
				 	largestRtime = Rtime;
				 } else {
				 	largestRtime = largestRtime;
				 }
				 // console.log(largestRtime);

				 var RtimeWidth = requestArray[0].offsetWidth;
				 var pxPerMs = 	RtimeWidth/largestRtime;	 
				 // console.log(pxPerMs);

				//Applying Width to Reponse Times		
				var requestWidthArray = document.getElementsByClassName("request-width");
				requestWidthArray[j].style.width = 100 + '%';

				var dnsArray = document.getElementsByClassName("dns");		
				var sslArray = document.getElementsByClassName("ssl");
				var connectArray = document.getElementsByClassName("connect");
				var ttfbArray = document.getElementsByClassName("ttfb");
				var ttlbArray = document.getElementsByClassName("ttlb");

				// var DNSbar = DNStime * pxPerMs;
				// var SSLbar = SSLtime * pxPerMs;
				// var Cbar = Ctime * pxPerMs;
				// var FBbar = FBtime * pxPerMs;
				// var LBbar = LBtime * pxPerMs;

				var DNSbar = avgDNS * pxPerMs;
				var SSLbar = avgSSL * pxPerMs;
				var Cbar = avgCON * pxPerMs;
				var FBbar = avgFB * pxPerMs;
				var LBbar = avgLB * pxPerMs;

				 dnsArray[j].style.width = DNSbar.toFixed(0) + 'px';
				 sslArray[j].style.width = SSLbar.toFixed(0) + 'px';
				 connectArray[j].style.width = Cbar.toFixed(0) + 'px';
				 ttfbArray[j].style.width = FBbar.toFixed(0) + 'px';
				 ttlbArray[j].style.width = LBbar.toFixed(0) + 'px';

				j++;
				z++;
			});				
			
		});


	
		function getDeviceUptime(device) {
			// console.log('HI PETER');
			var request = http({
				method: 'get',
				url: 'api/device-uptime.php',
				params: {
					device_id: device
				}
			});
			
			return request.then(handleSuccess, handleError);
			
		}	
	
		function getDeviceDetails(deviceid) {
			// console.log('HI PETER');
			var request = http({
				method: 'get',
				url: 'api/device-details.php',
				params: {
					device_id: deviceid
				}
			});
			
			return request.then(handleSuccess, handleError);
			
		}

		function handleError(response) {
	
			if(
				!angular.isObject(response.data) || 
				!response.data.message
			) {
				return $q.reject('An error occurred');
			}
		
		}
		
		function handleSuccess(response) {
			
			return response.data;
			
		}

	});		
}]);


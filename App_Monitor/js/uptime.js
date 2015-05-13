//Refreshes page after x milliseconds
// setInterval(function() {
// }, 130000);

// }, 9999999999);

var uptimeApp = angular.module('uptimeApp',[]);

uptimeApp.controller('uptimeCTRL', ['$scope', '$http', function (scope, http){	
	//Call to device API	

	// var intervalCall = (scope.devices.length - 2) * 10000;

	// setInterval(function () {
	APIcall();

	setInterval(function() {
		console.log("API CALLED");
		APIcall();
	}, 100000);
	// }, intervalCall);

	function APIcall(){
		http.get('api/devices.php').success(function (data){		
			scope.devices = data;	
			console.log (scope.devices);
			
			var DevID = [];	
			var j = 0;
			var z = 0; //increments once per response time call
			var arrayLength = 0;
			var largestRtime = 0;
			var flag = 0;	
			var e = 0;
			var uniqueRandoms = [];
			var numRandoms = scope.devices.length;
			// var cycleCount = 0;	

			//Fills Random number array
			for (var i = 0; i < numRandoms; i++) {
	            uniqueRandoms.push(i);
	        }

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
					// console.log(data);
					// console.log(z);				
					// console.log("data length " + data.length);

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

					// console.log("AVG " + avgLB);	
					
					var statusColorArray = document.getElementsByClassName("status-color");	

					var Rtime = data[z].RequestTime;			

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
						if ((chkRslt[i] == "404 Not Found (Error)") && (flag != 1)){
							stat = " down";				 	
						 }else {				  	
						  	stat = " up";
						  	flag = 1;
						 }					 
					});
					// console.log("stat " + stat);
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

					 largestRtime = 1500;
					 // console.log(largestRtime);

					 var RtimeWidth = requestArray[0].offsetWidth;
					 var pxPerMs = 	RtimeWidth/largestRtime;	
					 // console.log("RtimeWidth " + RtimeWidth);
					 // console.log("largestRtime " + largestRtime); 
					 // console.log(pxPerMs);

					//Applying Width to Reponse Times		
					var requestWidthArray = document.getElementsByClassName("request-width");
					requestWidthArray[j].style.width = 100 + '%';

					var dnsArray = document.getElementsByClassName("dns");		
					var sslArray = document.getElementsByClassName("ssl");
					var connectArray = document.getElementsByClassName("connect");
					var ttfbArray = document.getElementsByClassName("ttfb");
					var ttlbArray = document.getElementsByClassName("ttlb");			

					var DNSbar = avgDNS * pxPerMs;
					// console.log("avgDNS " + avgDNS);
					// console.log("pxPerMs " + pxPerMs);
					var SSLbar = avgSSL * pxPerMs;
					var Cbar = avgCON * pxPerMs;
					var FBbar = avgFB * pxPerMs;
					var LBbar = avgLB * pxPerMs;

					 dnsArray[j].style.width = DNSbar.toFixed(0) + 'px';
					 // console.log("DNSbar " + DNSbar.toFixed(0));
					 sslArray[j].style.width = SSLbar.toFixed(0) + 'px';
					 connectArray[j].style.width = Cbar.toFixed(0) + 'px';
					 ttfbArray[j].style.width = FBbar.toFixed(0) + 'px';
					 ttlbArray[j].style.width = LBbar.toFixed(0) + 'px';						 
				
					j++;
					z++;				
				});				
				
			});		

			//Cycles through Response Bars random and resets animation
			ResponseCycle();

			function ResponseCycle() {	

			console.log("length " + scope.devices.length);

				var x = 0;
				var intervalID = setInterval(function(){

				// setInterval(function(){
				
					var cycleCount = makeUniqueRandom();
					var requestWidthArray = document.getElementsByClassName("request-width");
					var nameArray = document.getElementsByClassName("name");
					var uptimeArray = document.getElementsByClassName("uptime");

					requestWidthArray[cycleCount].style.width = 0 + '%';	
					requestWidthArray[cycleCount].className = "request-width";

					setTimeout(function(){ 		
							var nameClass = nameArray[cycleCount].className;
							var uptimeClass = uptimeArray[cycleCount].className;

							for (var i = 0; i < scope.devices.length; i++) {
								// console.log("i " + i);
								nameArray[i].classList.remove("selected");
								uptimeArray[i].classList.remove("selected");
							};

							requestWidthArray[cycleCount].className = "request-width trans";			 
				 			requestWidthArray[cycleCount].style.width = 100 + '%';							
				 			// console.log("EVENT FIRED");
				 			// console.log("CYCLE COUNT " + cycleCount);

				 			console.log(scope.devices[cycleCount].DNStime);
				 			scope.respTimes = scope.devices[cycleCount].DNStime;
				 			
				 			//need to remove selected class from others
				 			nameArray[cycleCount].className = nameClass + ' selected';
				 			uptimeArray[cycleCount].className = uptimeClass + ' selected';
				 			
				 			document.getElementById("time_DNStime").innerHTML = scope.devices[cycleCount].DNStime + ' ms';		 		
				 			document.getElementById("time_SSLtime").innerHTML = scope.devices[cycleCount].SSLtime + ' ms';
				 			document.getElementById("time_Ctime").innerHTML = scope.devices[cycleCount].Ctime + ' ms';
				 			document.getElementById("time_FBtime").innerHTML = scope.devices[cycleCount].FBtime + ' ms';
				 			document.getElementById("time_LBtime").innerHTML = scope.devices[cycleCount].LBtime + ' ms';
				 			document.getElementById("AppName").innerHTML = scope.devices[cycleCount].ShortName;
				 			// scope.devices[0].DNStime = 'TEST';
				 			// console.log(scope.devices);

					}, 100);
					if (++x === scope.devices.length) {
				       window.clearInterval(intervalID);
				   }
				}, 7500);						 	
			}

			function makeUniqueRandom() {
			    // refill the array if needed
			    if (!uniqueRandoms.length) {
			        for (var i = 0; i < numRandoms; i++) {
			            uniqueRandoms.push(i);
			        }
			    }
			    var index = Math.floor(Math.random() * uniqueRandoms.length);
			    var val = uniqueRandoms[index];

			    // now remove that value from the array
			    uniqueRandoms.splice(index, 1);

			    return val;

			}
		
			//Function to get Device Uptime
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
			
			//Function to get Device Details
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
	}	
}]);


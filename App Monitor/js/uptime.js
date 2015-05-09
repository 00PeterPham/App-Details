var uptimeApp = angular.module('uptimeApp',[]);

uptimeApp.controller('uptimeCTRL', ['$scope', '$http', function (scope, http){	
	//Call to device API
	http.get('api/devices.php').success(function(data){
		scope.devices = data;

		var Uptime = [];
		var Details = [];

		//Gets Devices IDs and Stores in array
		angular.forEach(scope.devices, function(obj,i) {												
			// console.log(obj.device_id);	
			scope.devices[i] = obj.device_id;
			Uptime = getDeviceUptime(scope.devices[i]);
			Details = getDeviceDetails(scope.devices[i]);
		
		});

		console.log(Uptime);		
		// console.log(Uptime.$$state.value.data.Uptime.UpSeconds);	

		console.log(Details);	
		console.log(Details.$$state.value);
	
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


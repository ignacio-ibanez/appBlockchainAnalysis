blockchainAnalysis.controller('indexController', ['$scope','$http','$routeParams','$location','$window','$uibModal',
								function($scope,$http,$routeParams,$location,$window,$uibModal){

	var selectedMode;


	$scope.selectParams = function(selectedMode){

		console.log(selectedMode);

		var templateToUse;
		switch(selectedMode){
			case 'date':
				templateToUse = "dateBlockModal.html";
				break;
			case 'transaction':
				templateToUse = "hashTransactionModal.html";
				break;
			case 'address':
				templateToUse = "addressModal.html";
				break;
			case 'transactionWithIndex':
				templateToUse = "transactionIndexModal.html";
				break;
			case 'block':
				templateToUse = "hashBlockModal.html";
				break;
		}
		console.log(templateToUse);
    	var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: templateToUse,
			controller: 'selectParamsController',
    		resolve: {
				mode: function(){
					return selectedMode;
				}	
			}
		});
    	
    	modalInstance.result.then(function (params_analysis) {
    		//$scope.sendParams(params_analysis,"date");	
    		console.log(params_analysis);
    		$scope.sendParams(params_analysis);
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
    }

    $scope.sendParams = function(params_analysis){
    	console.log(params_analysis);
    	
		$http({ 
    		method: "POST",
    		url: "/analysis",
    		params: {
    			depth: params_analysis.depth,
    			mode: params_analysis.mode,
    			date: params_analysis.date,
    			transaction: params_analysis.transaction,
    			address: params_analysis.address,
    			indexOutput: params_analysis.indexOutput,
    			block: params_analysis.block
    		}
 		})
 		.then(function successFunc(data){
			$window.location.href = '/analysis';
		}, function errorFunc(data, status){
			alert("Imposible realizar petición");
		});
	};

}]);



blockchainAnalysis.controller('selectParamsController', ['$scope', '$http', '$uibModalInstance', '$routeParams', '$window', '$location', 'mode',
							function($scope, $http, $uibModalInstance, $routeParams, $window, $location, mode){
	
	var params_analysis;

	$scope.start_analysis = function(){
		var depth = 1; 
		if($scope.depth != ""){
			depth = $scope.depth;
		}
		switch(mode){
			case 'date':
				params_analysis = {mode: mode, date: $scope.date_block, depth: $scope.depth};
				break;
			case 'transaction':
				params_analysis = {mode: mode, transaction: $scope.hash_transaction, depth: $scope.depth};
				break;
			case 'address':
				params_analysis = {mode: mode, address: $scope.address, depth: $scope.depth};
				break;
			case 'transactionWithIndex':
				params_analysis = {mode: mode, transaction: $scope.hash_transaction, indexOutput: $scope.index_output, depth: $scope.depth};
				break;
			case 'block':
				params_analysis = {mode: mode, block: $scope.hash_block, depth: $scope.depth};
				break;
		}

		console.log("En start_analysis: ");
		console.log(params_analysis);
		$uibModalInstance.close(params_analysis);
	}
		
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	}
		
}]);



blockchainAnalysis.controller('multipleAnalysisController', ['$scope','$http','$location', function($scope,$http,$routeParams,$location){

	$scope.showBlocks = true;
	$scope.showTransactions = false;
	$scope.showPublicKeys = false;

	$scope.blocks = [];
	$scope.transactions = [];
	$scope.keys = [];

	$scope.setBlocks = function(){
		$scope.showBlocks = true;
		$scope.showTransactions = false;
		$scope.showPublicKeys = false;
	}

	$scope.setTransactions = function(){
		$scope.showBlocks = false;
		$scope.showTransactions = true;
		$scope.showPublicKeys = false;
	}

	$scope.setPublicKeys = function(){
		$scope.showBlocks = false;
		$scope.showTransactions = false;
		$scope.showPublicKeys = true;
	}

	var getDateFormatted = function(timeStamp){
		timeStamp = parseInt(timeStamp, 16);
		console.log(timeStamp);
		var date = new Date(timeStamp*1000);
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		var hours = date.getHours()-1;
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();

		var dateStr = day + "/" + month + "/"  + year + "-" + hours + ":" + minutes + ":" + seconds;
		return dateStr;
	}

	var prepareInfo = function(data){
		//console.log(data);
		for (var i=0; i<data.blocks.length; i++){
			var block = data.blocks[i];
			dateBlock = getDateFormatted(block.date);
			//console.log(block);
			$scope.blocks.push({
				hash: block.hashHeader,
				date: dateBlock,
				transactionsCount: block.transactionsCount,
				transaction: block.transaction
			});
			if(block.outputs != undefined){
				block.outputs[0].valueSatoshis = block.outputs[0].valueSatoshis/100000000;
				$scope.transactions.push({
					hashTransaction: block.transaction.hashTransaction,
					hashBlock: block.hashHeader,
					inputCount: block.transaction.inputCount,
					outputCount: block.transaction.outputCount,
					output: block.outputs[0]
				});
			}else{
				$scope.transactions.push({
					hashTransaction: block.transaction.hashTransaction,
					hashBlock: block.hashHeader,
					inputCount: block.transaction.inputCount,
					outputCount: block.transaction.outputCount
				});
			}
			if(block.transaction.publicKeys != undefined){
				for (var j=0; j< block.transaction.publicKeys.length; j++){
					$scope.keys.push({
						publickey: block.transaction.publicKeys[j],
						transaction: block.transaction.hashTransaction
					});
				}
			}
		}
	}

	var getResults = function(params_analysis,mode){
		$http({ 
    		method: "GET",
    		url: "/results"
 		})
 		.then(function successFunc(data){
			console.log("obtenido el json de resultados");
			var dataReceived = data.data;
			console.log(dataReceived);
			prepareInfo(dataReceived);
		}, function errorFunc(data, status){
			alert("Imposible realizar petición");
		});
	};

	getResults();

}]);
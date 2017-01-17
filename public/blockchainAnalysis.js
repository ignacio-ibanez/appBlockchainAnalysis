var blockchainAnalysis = angular.module('blockchainAnalysis',['ngRoute','ui.bootstrap']);


blockchainAnalysis.config(['$routeProvider',function($routeProvider){
	$routeProvider.when('/',{
		controller: "indexController",
		templateUrl: "/public/index.html"
	}).when('/analysis',{
		controller: "multipleAnalysisController",
		templateUrl: "/public/multipleAnalysis.html"
	}).otherwise({redirectTo: '/'});
}]);




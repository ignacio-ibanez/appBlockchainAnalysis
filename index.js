var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var jsonfile = require('jsonfile');
const exec = require('child_process').exec;
var path = __dirname + '/public/';

var analysis_1_config = __dirname + '/configuration_files/analysis_1_config.json';
var analysis_1_results = __dirname + '/configuration_files/analysis_1_results.json';
var analysisCypherFinished = true;
var analysis_2_file = __dirname + '/configuration_files/analysis_2_config.json';

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/angular', express.static(__dirname + '/node_modules/angular')); // redirect Angular
app.use('/angularRoute', express.static(__dirname + '/node_modules/angular-route')); // redirect Angular
app.use('/ui-angular', express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist')); // redirect angular-bootstrap
app.use('/d3', express.static(__dirname + '/node_modules/d3/build')); // redirect d3
app.use('/public', express.static(__dirname + '/public')); // redirect html and controllers



app.get('/', function(req, res){
	res.sendFile(path + 'index.html');
});

app.post('/analysis', function(req, res){
	console.log("entró en post analysis");
	//var mode = req.param("mode");
	//var date = req.param("date");
	//console.log("Modo: " + mode);
	//console.log("Fecha: " + date);
	
	//json = {mode: mode, date: date};
	json = createJSON(req.query);
	console.log(json);
	jsonfile.writeFile(analysis_1_config, json, function(err){
		if(err) {
			console.log(err);
		}
		console.log("escritos los parametros");

		var pathClasses = "/home/ignacio/blockchain_analysis/analysis_cypher/classes";
		var pathNeo4jDriver = "/home/ignacio/blockchain_analysis/analysis_cypher/neo4j-java-driver-1.0.6.jar";
		var pathJSONsimple = "/home/ignacio/blockchain_analysis/analysis_cypher/json-simple-1.1.1.jar";
		var command = "java -cp " + pathClasses + ":" + pathNeo4jDriver + ":" + pathJSONsimple + " analysis_1.Execute";
		console.log("Se llama al programa java");
		exec(command, (err, stdout, stderr) => {
			if (err) {
	    		console.error(err);
	  		}
	  		console.log("Stdout del programa JAVA:");
	  		console.log(stdout);
	  		
	  		res.sendFile(path + 'multipleAnalysis.html');
		});
	});

	
	//res.end();
});

app.get('/analysis', function(req, res){
	console.log("entró en get analysis");
	res.sendFile(path + 'multipleAnalysis.html');
});

app.get('/results', function(req, res){
	console.log("entró en get results");
	// DEVOLVER RESULTADOS
	//var results = getResultsJSON(analysis_1_results);

	jsonfile.readFile(analysis_1_results, function(err, obj){
		var results = obj;
		return res.json(results);
	})
	//res.send(JSON.stringify({res: results}));
	//res.json(results);
})

app.listen(8000);

console.log("Server running at http://localhost:8000/");

var createJSON = function(query){
	var mode = query.mode;
	console.log(mode);
	switch(mode){
			case 'date':
				json = {mode: mode, date: getTimeStamp(query.date), scope: query.depth};
				//json = {mode: mode, date: query.date, scope: query.depth};
				return json;
			case 'transaction':
				json = {mode: mode, hashTransaction: query.transaction, scope: query.depth};
				return json;
			case 'address':
				json = {mode: mode, publicKey: query.address, scope: query.depth};
				return json;
			case 'transactionWithIndex':
				json = {mode: mode, hashTransaction: query.transaction, indexOutput: query.indexOutput, scope: query.depth};
				return json;
			case 'block':
				json = {mode: mode, hashHeader: query.block, scope: query.depth};
				return json;
	}
}

var getTimeStamp = function(time){
	var dateArr = time.split("-");
	// formato: dd-mm-aa-hh-mi-ss
	var year = parseInt(dateArr[2]);
	var month = parseInt(dateArr[1])-1;
	var day = parseInt(dateArr[0]);
	var hours = parseInt(dateArr[3])+1;
	var minutes = parseInt(dateArr[4]);
	var seconds = parseInt(dateArr[5]);
	var date = new Date(year,month,day,hours,minutes,seconds,0);

	var timeStamp = date.getTime();
	//console.log("timeStamp sin /1000 :" + timeStamp);
	//console.log("El timestamp obtenido es: " + (timeStamp/1000).toString(16));
	return (timeStamp/1000).toString(16);
}

// SIN USAR
var saveParamsJSON = function(file, json){
	jsonfile.writeFile(file, json, function(err){
		if(err) {
			console.log(err);
		}
	})
}

// SIN USAR
var getResultsJSON = function(file){
	jsonfile.readFile(file, function(err, obj){
		console.log(obj);
		return obj;
	})
}
// SIN USAR
var executeCypherAnalysis = function(){
	var pathClasses = "/home/ignacio/blockchain_analysis/analysis_cypher/classes";
	var pathNeo4jDriver = "/home/ignacio/blockchain_analysis/analysis_cypher/neo4j-java-driver-1.0.6.jar";
	var pathJSONsimple = "/home/ignacio/blockchain_analysis/analysis_cypher/json-simple-1.1.1.jar";
	var command = "java -cp " + pathClasses + ":" + pathNeo4jDriver + ":" + pathJSONsimple + " analysis_1.Execute";
	exec(command, (err, stdout, stderr) => {
		if (err) {
    		console.error(err);
    		return;
  		}
  		console.log(stdout);
  		analysisCypherFinished = true;
	});
}











//Load third party node_modules
var express = require('express'),
    bodyParser = require('body-parser'),
    log4js = require('log4js'),
    jsonxml = require('jsontoxml'),
    jsonyaml = require('json2yaml'),
    fs = require('fs');

//configure logging
log4js.configure({
  appenders: { file: { type: 'file', filename: 'ChuckYeager.log' },console: { type: 'console' } },
  categories: { default: { appenders: ['file','console'], level: 'debug' } }
});

//The Log4JS Logger
var logger = log4js.getLogger();

//The express server
var app = express();


//Load the Models and create routes for app
function loadModels(){
  try{
    var modelFolder = './Models/';
    //Read each file in the Models dir
    fs.readdir(modelFolder, (err, files) => {
      files.forEach(file => {
        try{
        logger.debug("Loading model "+file);
        var fileData=fs.readFileSync(modelFolder+'/'+file, 'utf8');
        var fileJson=JSON.parse(fileData);
        if(!fileJson.response)
          throw "Model JSON must have a top-level property named response";
        var response=fileJson.response;

        //Setup properties for route
        var code=response.code || 200;
        var body=response.body || {};
        var method=response.method || 'get';
        var path=response.path || '/';

        //Ensure trailing /  -> Assists in building paths like /yaml /xml etc.
        if(!path.endsWith('/'))
          path=path+'/';

        //Emit route to express dynamically
        app[method](path,function(req,res){
          var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          logger.debug("["+ip+"] Responding to "+path);
          res.type('application/json; charset=utf8');
          res.status(code);
          res.send(body);
        });

        //Emit YAML route to express dynamically
        app[method](path+'yaml/',function(req,res){
          var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          logger.debug("["+ip+"] Responding to "+path+'yaml/');
          res.type('application/x-yaml; charset=utf8');
          res.status(code);
          res.send(jsonyaml.stringify(body));
        });

        //Emit XML route to express dynamically
        app[method](path+'xml/',function(req,res){
          var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          logger.debug("["+ip+"] Responding to "+path+'xml/');
          res.type('application/xml; charset=utf8');
          res.status(code);
          res.send(jsonxml(body));
        });

        logger.info("Routing [ "+method+" "+path+" ("+code+") ]");

      }
      catch(iex){
        logger.error("Unable to load model "+file+": "+iex);
      }
      });

    });
  }
  catch(ex){
    logger.error("Error loading models: "+ex);
  }
}

//Start the Express Server
function listen(port){
  try{
    //Handle JSON Body
    app.use(bodyParser.json())

    //Support HTTP GET for hosting health checks
    app.get('/',function(req,res){
      return res.sendStatus(200);
    });

    //Listen
    app.listen(port);
    var msg='Service Is Alive on Port '+port;
    logger.info(msg)
  }
  catch(ex){
    logger.error("There was a fatal error in the service: "+ex);
  }
}


//Start Service
loadModels();
listen(8081);

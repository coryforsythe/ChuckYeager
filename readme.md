# Chuck Yeager
Named after the first American pilot to break the 'Mach' barrier, this tool assists in the rapid development of 'Mock' APIs for use in integration testing

## Installation

Install this package from the NPM repository

```

npm install chuckyeager

```

## Usage

### 1: Configure the models
The express server will create routes and response handlers based upon the contents of the Models sub-directory in this project. Each JSON model will be available at the specified path. In addition, routes will automatically be created so that a request made appending /YAML or /XML will deliver the model data in those respective formats.

To create mocks, simply place a JSON file in that directory that conforms to this structure:

```
{
  "response":{
    "method":"get",
    "path":"/examples",
    "statusCode":200,
    "body":{
      "examples":[
        {"firstName":"John","lastname":"Doe"}
      ]
    }
  }
}

```

The following properties of the JSON object can be adjusted or removed (in which case defaults will be used):

|**Property**|**Usage**|**Default Value**|
|---|---|---|
|method|Defines the HTTP Method for the Express Route|GET|
|path|Defines the relative path for the route (should be unique across the directory)|/|
|statusCode|The HTTP Code to send with the response|200|
|body|JSON body to send with the response|{}|

### 2: Start the Server

```
node index.js
```

## Test it out
From the terminal, curl the local server and request the examples model(s):

```
curl http://localhost/examples
curl http://localhost/examples/xml
curl http://localhost/examples/yaml

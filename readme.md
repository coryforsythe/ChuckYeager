# Chuck Yeager
Named after the first American pilot to break the 'Mach' barrier, this tool assist in the rapid development of 'Mock' APIs for use in integration testing

## Installation

Install this package from the NPM repository

```

npm install chuckyeager

```

## Usage

### 1: Configure the models
The express server will create routes and response handlers based upon the contents of the Models sub-directory in this project. To create mocks, simply place a JSON file in that directory that conforms to this structure:

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
|path|Defines the relative path for the route (should be unique across the directory)||
|statusCode|The HTTP Code to send with the response|200|
|body|JSON body to send with the response|{}|

### 2: Start the Server

```
node index.js
```

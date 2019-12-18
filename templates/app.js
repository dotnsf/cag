// app.js

var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var app = express();

var settings = require( './settings' );

//. https://www.npmjs.com/package/@cloudant/cloudant
var Cloudantlib = require( '@cloudant/cloudant' );
var cloudant = null;

if( settings.db_username && settings.db_password ){
  cloudant = Cloudantlib( { account: settings.db_username, password: settings.db_password } );
}

app.use( express.static( __dirname + '/public' ) );
app.use( bodyParser.urlencoded( { extended: true, limit: '10mb' } ) );
app.use( bodyParser.json() );

/**********/

var port = process.env.port || 3000;
app.listen( port );
console.log( 'server started on ' + port );

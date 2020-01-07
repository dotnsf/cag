// app.js

var fs = require( 'fs' );
var settings = require( './settings' );

//. https://www.npmjs.com/package/@cloudant/cloudant
var Cloudantlib = require( '@cloudant/cloudant' );
var cloudant = null;
var dbs = [];

if( settings.db_username && settings.db_password ){
  cloudant = Cloudantlib( { account: settings.db_username, password: settings.db_password } );
}else if( settings.db_apikey && settings.db_url ){
  cloudant = new CloudantLib({
    url: settings.db_url,
    plugins: {
      iamauth: {
        iamApikey: settings.db_apikey
      }
    }
  });
}

if( cloudant ){
  //. テンプレートファイル群の読み込み
  var template_settings = fs.readFileSync( 'settings.js', 'utf-8' );
  var template_app = fs.readFileSync( 'templates/app.js', 'utf-8' );
  var template_swagger = fs.readFileSync( 'templates/swagger.yaml', 'utf-8' );
  var template_readme = fs.readFileSync( 'templates/README.md', 'utf-8' );
  var template_crud_api_js = fs.readFileSync( 'templates/crud_api.js', 'utf-8' );
  var template_crud_api_tags_yaml = fs.readFileSync( 'templates/crud_api_tags.yaml', 'utf-8' );
  var template_crud_api_paths_yaml = fs.readFileSync( 'templates/crud_api_paths.yaml', 'utf-8' );
  var template_crud_api_definitions_yaml = fs.readFileSync( 'templates/crud_api_definitions.yaml', 'utf-8' );
  var template_crud_api_readme_md = fs.readFileSync( 'templates/crud_api_readme.md', 'utf-8' );

  //. テンプレートからそのままコピーするファイル
  fs.copyFile( 'templates/.cfignore', 'out/.cfignore', function(){} );
  fs.copyFile( 'templates/.gitignore', 'out/.gitignore', function(){} );
  fs.copyFile( 'templates/LICENSE', 'out/LICENSE', function(){} );
  fs.copyFile( 'templates/package.json', 'out/package.json', function(){} );
  //fs.copyFile( 'templates/README.md', 'out/README.md', function(){} );
  fs.mkdirSync( 'out/public' );
  fs.copyFile( 'templates/doc/favicon-16x16.png', 'out/public/favicon-16x16.png', function(){} );
  fs.copyFile( 'templates/doc/favicon-32x32.png', 'out/public/favicon-32x32.png', function(){} );
  fs.copyFile( 'templates/doc/index.html', 'out/public/index.html', function(){} );
  fs.copyFile( 'templates/doc/oauth2-redirect.html', 'out/public/oauth2-redirect.html', function(){} );
  fs.copyFile( 'templates/doc/swagger-ui-bundle.js', 'out/public/swagger-ui-bundle.js', function(){} );
  fs.copyFile( 'templates/doc/swagger-ui-bundle.js.map', 'out/public/swagger-ui-bundle.js.map', function(){} );
  fs.copyFile( 'templates/doc/swagger-ui-standalone-preset.js', 'out/public/swagger-ui-standalone-preset.js', function(){} );
  fs.copyFile( 'templates/doc/swagger-ui-standalone-preset.js.map', 'out/public/swagger-ui-standalone-preset.js.map', function(){} );
  fs.copyFile( 'templates/doc/swagger-ui.css', 'out/public/swagger-ui.css', function(){} );
  fs.copyFile( 'templates/doc/swagger-ui.css.map', 'out/public/swagger-ui.css.map', function(){} );
  fs.copyFile( 'templates/doc/swagger-ui.js', 'out/public/swagger-ui.js', function(){} );
  fs.copyFile( 'templates/doc/swagger-ui.js.map', 'out/public/swagger-ui.js.map', function(){} );

  //. （exports.dbs 以外の行を対象に）settings.js をコピー
  var out_settings = '';
  template_settings.split( "\n" ).forEach( function( line ){
    if( !line.startsWith( 'exports.dbs =' ) ){
      out_settings += ( line + "\n" );
    }
  });
  fs.writeFileSync( 'out/settings.js', out_settings );

  //. 対象データベースの取得
  cloudant.db.list().then( function( body ){
    if( settings.dbs && settings.dbs.length > 0 ){
      dbs = settings.dbs;
    }else{
      body.forEach( function( dbname ){
        dbs.push( dbname );
      })
    }

    if( dbs.length > 0 ){
      var templates_crud_api_dbs = '';
      var templates_swagger_tags_dbs = '';
      var templates_swagger_paths_dbs = '';
      var templates_swagger_definitions_dbs = '';
      var templates_readme_dbs = '';
      dbs.forEach( function( dbname ){
        var db = cloudant.db.use( dbname );
        if( db ){
          //. テンプレートの app.js に API 追加
          var tmp1 = template_crud_api_js.replace( /\*\*\*\*\*\*\*\*\*\*/g, dbname );
          templates_crud_api_dbs += tmp1;

          //. API Document の swagger.yaml に追加
          var tmp2 = template_crud_api_tags_yaml.replace( /\*\*\*\*\*\*\*\*\*\*/g, dbname );
          templates_swagger_tags_dbs += tmp2;
          var tmp3 = template_crud_api_paths_yaml.replace( /\*\*\*\*\*\*\*\*\*\*/g, dbname );
          templates_swagger_paths_dbs += tmp3;
          var tmp4 = template_crud_api_definitions_yaml.replace( /\*\*\*\*\*\*\*\*\*\*/g, dbname );
          templates_swagger_definitions_dbs += tmp4;

          //. README.md に追加
          var tmp5 = template_crud_api_readme_md.replace( /\*\*\*\*\*\*\*\*\*\*/g, dbname );
          templates_readme_dbs += tmp5;
        }
      });

      var tmp6 = template_app.split( '/**********/' );
      template_app = tmp6[0] + templates_crud_api_dbs + tmp6[1];
      fs.writeFileSync( 'out/app.js', template_app );

      var tmp7 = template_swagger.split( '##########' );
      tmp7[1] = tmp7[1].substr( 1 );
      tmp7[2] = tmp7[2].substr( 1 );
      template_swagger = tmp7[0] + templates_swagger_tags_dbs + tmp7[1] + templates_swagger_paths_dbs + tmp7[2] + templates_swagger_definitions_dbs;
      fs.writeFileSync( 'out/public/swagger.yaml', template_swagger );

      var tmp8 = template_readme.split( '##########' );
      template_readme = tmp8[0] + templates_readme_dbs + tmp8[1];
      fs.writeFileSync( 'out/README.md', template_readme );

      console.log( 'done.' );
    }else{
      console.log( 'no target dbs found.' );
    }
  });
}else{
  console.log( 'failed to access to IBM Cloudant.' );
}

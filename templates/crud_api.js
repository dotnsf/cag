
//. Create
app.post( '/**********', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var db = cloudant.db.use( '**********' );
  if( db ){
    var doc = JSON.parse( JSON.stringify( req.body ) );
    doc.created = doc.updated = ( new Date() ).getTime();

    db.insert( doc, function( err, body ){
      if( err ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
        res.end();
      }else{
        res.write( JSON.stringify( { status: true, doc: body, message: 'document is created.' }, 2, null ) );
        res.end();
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: 'db is failed to be initialized.' }, 2, null ) );
    res.end();
  }
});

//. Read
app.get( '/**********', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var db = cloudant.db.use( '**********' );
  if( db ){
    db.list( { include_docs: true }, function( err, body ){
      if( err ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
        res.end();
      }else{
        var docs = [];
        body.rows.forEach( function( doc ){
          docs.push( doc.doc );
        });

        var result = { status: true, docs: docs };
        res.write( JSON.stringify( result, 2, null ) );
        res.end();
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: 'db is failed to be initialized.' }, 2, null ) );
    res.end();
  }
});

//. Read
app.get( '/**********/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var db = cloudant.db.use( '**********' );
  if( db ){
    var id = req.params.id;
    var option = { include_docs: true };
    var rev = req.query.rev;
    if( rev ){
      option['rev'] = rev;
    }
    db.get( id, option, function( err, body ){
      if( err ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
        res.end();
      }else{
        res.write( JSON.stringify( { status: true, doc: body }, 2, null ) );
        res.end();
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: 'db is failed to be initialized.' }, 2, null ) );
    res.end();
  }
});

//. Update
app.put( '/**********/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var db = cloudant.db.use( '**********' );
  if( db ){
    var id = req.params.id;
    db.get( id, { include_docs: true }, function( err, doc ){
      if( err ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
        res.end();
      }else{
        for( var i in req.body ){
          doc[i] = req.body[i];
        }
        doc.updated = ( new Date() ).getTime();

        db.insert( doc, function( err, body ){
          if( err ){
            res.status( 400 );
            res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
            res.end();
          }else{
            res.write( JSON.stringify( { status: true, doc: body, message: 'document is updated.' }, 2, null ) );
            res.end();
          }
        });
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: 'db is failed to be initialized.' }, 2, null ) );
    res.end();
  }
});

//. Delete
app.delete( '/**********/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var db = cloudant.db.use( '**********' );
  if( db ){
    var id = req.params.id;
    db.get( id, function( err, data ){
      if( err ){
        res.status( 400 );
        res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
        res.end();
      }else{
        //console.log( data );
        db.destroy( id, data._rev, function( err, body ){
          if( err ){
            res.status( 400 );
            res.write( JSON.stringify( { status: false, message: err }, 2, null ) );
            res.end();
          }else{
            res.write( JSON.stringify( { status: true }, 2, null ) );
            res.end();
          }
        });
      }
    });
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, message: 'db is failed to be initialized.' }, 2, null ) );
    res.end();
  }
});

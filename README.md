# CAG(Cloudant API Generator)

## Overview

CRUD REST API generator for IBM Cloudant database.


## How to use

- Prepare IBM Cloudant db instance. Find username and password for that instance.

- Edit settings.js with your IBM Cloudant credential information. For example, username and password, or apikey and url.

- You can also edit exports.dbs in settings.js which db would be targeted for generating REST API.

  - If you own **db1, db2, and db3** in your Cloudant, and want to generate REST APIs **only for db1 and db2** in your Cloudant, then your exports.dbs should be as followings:

    - `exports.dbs = [ 'db1', 'db2' ];`

  - By defaults, `exports.dbs = [];` suggests that CAG would generate CRUD REST APIs for all db in your Cloudant.

- Run app.js to generate REST APIs:

  - `$ npm install`

  - and `$ node app`.

- If succeeded, you can find generated REST API code in ./out/ folder.

- Run ./out/app.js to activate generated REST APIs and Swagger API document.

  - `$ cd out`,

  - `$ npm install`,

  - and `$ node app`.

- Now you can browse your generated Swagger API document in http://localhost:3000/ .

## How to publish Swagger API document in public.

- Edit ./out/public/swagger.yaml(L.6)'s host value with your published hostname and port.

  - For example, if you are going to publish this Swagger API document in myapi.mybluemix.net, then your ./out/public/swagger.yaml(L.6) should be edited like this:

    - `host: myapi.mybluemix.net`

- Publish ./out/ folder to your public Node.js server.

- In you Node.js server, run ./out/app.js to activate.


## Licensing

This code is licensed under MIT.


## Copyright

2019-2020 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.

## some docs



### server methods

#### .uuids

````javascript
  relax
    .uuids()
    .end(function(res) {
      console.log(JSON.parse(res.text));
    });
````
````bash
--> {"uuids":["11eaa495bfae96d36d6a53f21a01adf6","11eaa495bfae96d36d6a53f21a01b9b7"]}
````

````javascript
  relax.uuids(5, function(err, res) {
      console.log(res);
  });
````
````bash
--> ["11eaa495bfae96d36d6a53f21a01adf6","11eaa495bfae96d36d6a53f21a01b9b7"]
````

### database methods

#### .exists

````javascript
  relax
  ;
````

````
  relax
    .exists(name)
    .end(callback)
````

````javascript
  relax
  ;
````

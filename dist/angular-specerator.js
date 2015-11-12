// angular.module('specerator').value('API_ENDPOINT', io.sails.url);
//

angular.module('specerator.data', []).service('socketApiService', function($q){

  this.options = {
    accessToken: null
  }

  this.getHeaders = function() {
    return  {
      "content-type": "application/json",
      authorization: 'Bearer ' + this.options.accessToken
    };
  }

  this.isConnected = function() {
    return new $q(function(resolve, reject){
      if (io.socket.isConnected) {
        return resolve(true);
      }
      io.socket.on('connect', function(){
        return resolve(true);
      });
    });
  };

  this.request = function(opts) {
    opts.headers = _.merge(this.getHeaders(), opts.headers);
    return this.isConnected().then(function(){
      return $q(function(resolve, reject){
        console.log(opts);
        io.socket.request(opts, function(data, res){
          console.log(res);
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            return resolve(data);
          }
          if (res.statusCode >= 400 && res.statusCode <= 599) {
            return reject(res.error);
          }
        });
      })
    });
  };

  function buildUrl(url, parameters){
    var qs = "";
    for(var key in parameters) {
      var value = parameters[key];
      qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
    }
    if (qs.length > 0){
      qs = qs.substring(0, qs.length-1); //chop off last "&"
      url = url + "?" + qs;
    }
    return url;
  }

  function tmpl(url, data) {
    return url.replace(/{{\s*?(\w*)\s*?}}/g, function(match, key, position) {
      if (typeof data[key] == 'undefined') {
        return '';
      } else {
        var out = data[key];
        delete data[key];
        return out;
      }
    });
  }

  var methods = {
    on: function(cb) {
      io.socket.on(this.model, cb);
    },
    request: function(query, data, opts) {
      query = query || {};
      opts.data = data || {};
      opts.url = tmpl(opts.url, query);
      if (query) {
        opts.url = buildUrl(opts.url, query);
      }
      opts.headers = _.merge(this.getHeaders(), opts.headers);
      console.log(opts);
      return this.isConnected().then(function(){
        return $q(function(resolve, reject){
          io.socket.request(opts, function(data, res){
            if (res.statusCode >= 200 && res.statusCode <= 299) {
              return resolve(data);
            }
            if (res.statusCode >= 400 && res.statusCode <= 599) {
              return reject(res.error);
            }
          });
        })
      });
    },
    find: function(query, opts) {
      options = {};
      options.params = opts;
      options.method = 'GET';
      options.url = this.url;
      options.model = this.model;
      return this.request(query, {}, options);
    },
    findOne: function(query, opts) {
      options = {};
      options.params = opts;
      options.method = 'GET';
      options.url = this.url;
      options.model = this.model;
      return this.request(query, {}, options);
    },
    create: function(query, data, opts) {
      options = opts || {};
      options.method = 'POST';
      options.url = this.url;
      options.model = this.model;
      return this.request(query, data, options);
    },
    update: function(query, data, opts) {
      options = opts || {};
      options.method = 'PUT';
      options.url = this.url;
      options.model = this.model;
      return this.request(query, data, options);
    },
    remove: function(query, opts) {
      options = opts || {};
      options.method = 'DELETE';
      options.url = this.url;
      options.model = this.model;
      return this.request(query, {}, options);
    }
  }

  var models = {
    Document: {
      model: 'document',
      url: '/projects/{{project}}/documents/{{document}}'
    },
    Integration: {
      model: 'integration',
      url: '/projects/{{project}}/integrations/{{integration}}'
    },
    List: {
      model: 'list',
      url: '/projects/{{project}}/lists/{{list}}'
    },
    Passport: {
      model: 'passport',
      url: '/passports/{{passport}}'
    },
    Project: {
      model: 'project',
      url: '/projects/{{project}}'
    },
    Service: {
      model: 'service',
      url: '/services/{{service}}'
    },
    Story: {
      model: 'story',
      url: '/projects/{{project}}/stories/{{story}}',
      sync: function(query, opts) {
        options = {};
        options.params = opts;
        options.method = 'GET';
        options.url = '/projects/{{project}}/stories/sync';
        return this.request(query, {}, options);
      }
    },
    User: {
      model: 'user',
      url: '/users/{{user}}'
    }
  };

  for (m in models) {
    this[m] = _.assign(models[m], this, methods);
  }

  return this;

});

// angular.module('specerator').factory('Api', ['$resource', 'API_ENDPOINT',
//     function($resource, API_ENDPOINT) {
//         return {
//             Document: $resource(API_ENDPOINT + '/projects/:project/documents/:id', {
//                 project: '@project',
//                 id: '@id'
//             }),
//             Integration: $resource(API_ENDPOINT + '/projects/:project/integrations/:id', {
//                 project: '@project',
//                 id: '@id'
//             }),
//             Project: $resource(API_ENDPOINT + '/projects/:id', {
//                 id: '@id'
//             }, {
//                 report: {
//                     method: 'GET',
//                     params: {
//                         id: 'report'
//                     },
//                     isArray: true
//                 }
//             }),
//             Story: $resource(API_ENDPOINT + '/projects/:project/stories/:id', {
//                 project: '@project',
//                 id: '@id'
//             }, {
//                 update: {
//                     method: 'PUT',
//                     params: {
//                         param1: '@id'
//                     }
//                 }
//             }),
//         }
//     }
// ]);

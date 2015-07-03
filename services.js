angular.module('parserDemo')
  .service('accounts', ["$http",
    function($http) {
      return {
        checking: {
          balance: 234.56
        },
        savings: {
          balance: 1899.63
        }
      };
    }
  ])
  .service('chat', ["$http",
    function() {
      return {
        login: function(user) {
          return true;
        },
        send: function(msg) {
          console.debug("msg: "+msg);
        }
      };
    }
  ]);
angular.module("parserDemo", [])
  .controller("indexCtrl", ["$scope", "accounts", "chat",
    function($scope, accounts, chat) {
      $scope.user = "";
      $scope.txtIn = "";
      $scope.message = "";
      $scope.logStatus = "login";
      
      $scope.login = function(){
        if (chat.login($scope.user)){
          $scope.logStatus = "logout";
        }
      };

      $scope.send = function() {
        console.debug($scope.txtIn);
        $scope.message += "\n@you:\t"+$scope.txtIn;
        if($scope.txtIn==="x") {
          $scope.txtIn = "@Bank\ttransfered $10.00 from @John to checking";
        }
        json = txtParser($scope.txtIn);
        chat.send($scope.txtIn);
        $scope.txtIn = "";
        if(!json) return;
        $scope.json = json;
        d = decision(json, accounts);
        if (d)
        $scope.message += "\n@BANK:\t"+d.message;
      };

    }
  ]);
angular.module("main",['ssDialog'])
  .controller('MainCtrl', mainCtrl);

/* @ngInject */
function  mainCtrl(ssDialog) {
  'use strict';

  /* jshint validthis: true */
  var vm = this;

  vm.show = function(p){
    ssDialog.showDialog(p);
  };

  vm.ask = function(message){
    ssDialog.ask(message).then(function(){
      ssDialog.showInfo("confirmed!");
      }
    );
  };

  vm.ensure = function(message){
    ssDialog.ensure(message).then(function(){
        ssDialog.showInfo("confirmed!");
      }
    );
  };

  vm.warning = function(message){
    ssDialog.warning(message).then(function(){
        ssDialog.showInfo("confirmed!");
      }
    );
  };

  vm.error = function(message){
    ssDialog.error(message)
  };

  vm.query = function(message){
    ssDialog.query(message).then(function(answer){
        ssDialog.showInfo(answer);
      }
    );
  };


}
angular.module("main",[])
.controller('MainCtrl', mainCtrl);

/* @ngInject */
function  mainCtrl() {
  'use strict';

  /* jshint validthis: true */
  var vm = this;

  vm.showMyModal = function(){
    alert("buba")
  }

}
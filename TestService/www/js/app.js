// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller("Controller",function($scope, $http,  $ionicPopup, $ionicListDelegate){

  $scope.dados = [];
  $scope.dadoDetalhado = [];
  /*Chamada no comeco da pagina para buscar os dados do webservice*/
  $scope.init = function(){
    $http.get("http://localhost:8080/WebService/bandas/")
    .success(function(data){
      $scope.dados = data.banda;
    });
  }
/*chamada apos acoes de adicionar,alterar e remover para pegar os dados atualizados*/
  function refreshList(){
    $http.get("http://localhost:8080/WebService/bandas/")
    .success(function(data){
      $scope.dados = data.banda;
    });
  };
 /*chamada quando se clica em alguma banda na listagem*/
  $scope.getBanda = function(id) {
    $http.get("http://localhost:8080/WebService/bandas/"+id)
    .success(function(data2){
      $scope.dadoDetalhado = data2;
      $scope.showInfoBanda();
    });
  }

  $scope.showInfoBanda = function(){
    var alertPopup = $ionicPopup.alert({
      title: 'Banda',
      template: 'Nome: '+$scope.dadoDetalhado.nome+'<br>'
      +'Ano de Formacao: '+$scope.dadoDetalhado.anoDeFormacao+'<br>'
    });
    alertPopup.then(function(res) {
      console.log(res);
    });
 }
/*chamada para adicionar uma nova banda*/
 function onAddBanda(nome,ano){
   $http.post("http://localhost:8080/WebService/bandas/",
   {nome:$scope.data.nome,anoDeFormacao:$scope.data.ano},
   {headers: {'Content-Type': 'application/json'}})
   .success(function(response){
     $scope.daddo = response;
       refreshList();
   });
 }

 $scope.showAddBanda = function(novo){
   $scope.data = {};
   $scope.data.nome;
   $scope.data.ano;
   $ionicPopup.show(
    {title:"Nova Banda",
    scope: $scope,
    template:"<input type='text' placeholder='Nome' autofocus='true' ng-model='data.nome'><br>"+
    "<input type='text'placeholder='Ano' ng-model='data.ano'>",
    buttons:[
      {text:"Ok",
    onTap:function(e){
        onAddBanda($scope.data.nome,$scope.data.ano);
    }},
      {text:"Cancel"}
    ]
  });
    $ionicListDelegate.closeOptionButtons();
}

$scope.showEdit = function(banda){
  $scope.newBanda = {};
  $scope.newBanda = banda;
  $ionicPopup.show(
   {title:"Banda",
   scope: $scope,
   template:"<input type='text' placeholder='Nome' autofocus='true' ng-model='newBanda.nome'><br>"+
   "<input type='text'placeholder='Ano' ng-model='newBanda.anoDeFormacao'>",
   buttons:[
     {text:"Ok",
   onTap:function(e){
     banda = $scope.newBanda;
     onEdit(banda);
   }},
     {text:"Cancel"}
   ]
 });
   $ionicListDelegate.closeOptionButtons();
}

$scope.onRemove = function(id){
  $http.delete("http://localhost:8080/WebService/bandas/"+id)
  .success(function(response){
    $scope.status = response;
     refreshList();
  });
}
function onEdit(banda){
  $http.put("http://localhost:8080/WebService/bandas/",
  {nome:banda.nome,anoDeFormacao:banda.anoDeFormacao,id:banda.id},
  {headers: {'Content-Type': 'application/json'}})
  .success(function(response){
    refreshList();
  });
}
})

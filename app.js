var app = angular.module('plunker', ['ngRoute', 'mongolabResourceHttp'], function($routeProvider) {

  $routeProvider
    .when('/list', {templateUrl:'list.html', controller:'TodoListCtrl', resolve:{
      projects:function(Project){return Project.all();}
    }})
    
    .when('/edit/:id', {templateUrl:'form.html', controller:'TodoFormCtrl', resolve:{
      project:function(Project, $route){return Project.getById($route.current.params.id);} 
    }})
    
    .when('/new', {templateUrl:'form.html', controller:'TodoFormCtrl', resolve:{
      project:function(Project){return new Project();}
    }})
    
    .otherwise({redirectTo:'/list'});
  })

  .constant('MONGOLAB_CONFIG',{API_KEY:'nKfV-gRpVwKYCEh_pE57zXh2Pn6gjPsb', DB_NAME:'luisbase'})
  
  .factory('Project', function ($mongolabResourceHttp) {
    return $mongolabResourceHttp('projects');
  })
  
  .controller('TodoListCtrl', function($scope, $location, projects) {
    
    $scope.projects = projects;
  })

  .controller('TodoFormCtrl', function($scope, $location, project) {
  
    var projectCopy = angular.copy(project);
    var changeSuccess = function() {
      $location.path('/list');
    };
    
    var changeError = function() {
      throw new Error('Sth went wrong...');
    };
    
    $scope.project = project;
    
    $scope.save = function(){
      $scope.project.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
    };
    
    $scope.remove = function() {
      $scope.project.$remove(changeSuccess, changeError);
    };
    
    $scope.hasChanges = function(){
      return !angular.equals($scope.project, projectCopy);
    };
});

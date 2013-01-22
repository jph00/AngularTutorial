var TodoApp = angular.module("TodoApp", ["ngResource"]).
    config(function($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            when('/new', { controller: CreateCtrl, templateUrl: 'details.html' }).
            when('/edit/:editId', { controller: EditCtrl, templateUrl: 'details.html' }).
            otherwise({ redirectTo: '/' });
    });

TodoApp.factory('Todo', function($resource) {
    return $resource('/api/Todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

var EditCtrl = function ($scope, $location, $routeParams, Todo) {
    $scope.action = "Update";
    var id = $routeParams.editId;
    $scope.item = Todo.get({ id: id });

    $scope.save = function() {
        Todo.update({ id: id }, $scope.item, function() {
            $location.path('/');
        });
    };

};

var CreateCtrl = function($scope, $location, Todo) {
    $scope.action = "Add";
    $scope.save = function () {
        Todo.save($scope.item, function() {
            $location.path('/');
        });
    };

};

var ListCtrl = function ($scope, $location, Todo) {
    $scope.search = function () {
        Todo.query({
                q: $scope.query,
                sort: $scope.sort_order,
                desc: $scope.is_desc,
                offset: $scope.offset,
                limit: $scope.limit
            },
            function (data) {
                $scope.more = data.length === 20;
                $scope.items = $scope.items.concat(data);
            });
    };

    $scope.sort = function (col) {
        if ($scope.sort_order === col) {
            $scope.is_desc = !$scope.is_desc;
        } else {
            $scope.sort_order = col;
            $scope.is_desc = false;
        }
        $scope.reset();
    };

    $scope.show_more = function() {
        $scope.offset += $scope.limit;
        $scope.search();
    };
    $scope.has_more = function() {
        return $scope.more;
    };

    $scope.reset = function () {
        $scope.limit = 20;
        $scope.offset = 0;
        $scope.items = [];
        $scope.more = true;
        $scope.search();
    };

    $scope.delete = function() {
        var id = this.todo.Id;
        Todo.delete({ id: id }, function() {
            $('#todo_' + id).fadeOut();
        });
    };
    
    $scope.sort_order = "Priority";
    $scope.is_desc = false;
    
    $scope.reset();
};

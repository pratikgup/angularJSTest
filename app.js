(function() {

  var app = angular.module('githubViewer', []);

  var MainCtrl = function(
    $scope, githubService, $interval,
    $log, $anchorScroll, $location) {

    $scope.username = "angular";
    $scope.message = "GitHub Viewer";
    $scope.repoSortOrder = "-stargazers_count";
    $scope.countdown = 5;

    var onUserComplete = function(data) {
      $scope.user = data;
      githubService.getRepos($scope.user)
        .then(onRepos, onError);
    };

    var onRepos = function(data) {
      $scope.repos = data;
      $location.hash("userDetails");
      $anchorScroll();

    };

    var onError = function(reason) {
      $scope.error = "Could not fetch the data.";

    };

    var decrementCountdown = function() {
      $scope.countdown -= 1;
      if ($scope.countdown < 1) {
        $scope.search($scope.username);

      }
    };
    var countdownInterval = null;

    var startCountdown = function() {
      countdownInterval = $interval(decrementCountdown, 1000, $scope.countdown);
    };
    startCountdown();
    $scope.search = function(username) {
      $log.info("Searching for " + username);
      githubService.getUser(username).then(onUserComplete, onError);
      if (countdownInterval) {
        $interval.cancel(countdownInterval);
        $scope.countdown = null;
      }

    };


  };
  app.controller('MainCtrl', MainCtrl);
})();
(function() {
	'use strict';

	angular.module('kamisado').controller('gameController', function($scope) {

		//Define the players
		$scope.players = {
			BLACK: 'Black',
			WHITE: 'White'
		};

		/**
		 * Init the game
		 *
		 * @return void
		 */
		$scope.init = function() {
			//Define the first player
			$scope.currentPlayer = ( Math.random() > 0.5 ) ? $scope.players.BLACK : $scope.players.WHITE;
		};

		/**
		 * Init the next turn
		 *
		 * @return void
		 */
		$scope.nextTurn = function() {
			var players = $scope.players;

			$scope.currentPlayer = ( $scope.currentPlayer === players.BLACK ) ? $scope.currentPlayer === players.WHITE : $scope.currentPlayer === players.BLACK;
		};

	});

})();
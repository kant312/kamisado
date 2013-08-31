(function() {
	'use strict';

	angular.module('kamisado').controller('gameController', function($scope, playerService) {

		//Wait for components
		$scope.$on('gridReady', function(){
			$scope.init();
		});

		/**
		 * Init the game
		 *
		 * @return void
		 */
		$scope.init = function() {
			//Watch player changes
			$scope.getCurrentPlayer = playerService.getCurrentPlayer;

		};
		

	});

})();
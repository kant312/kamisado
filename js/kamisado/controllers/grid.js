(function() {
	'use strict';

	angular.module('kamisado', []).controller('gridController', function($scope){

		//Let's define the grid colors
		$scope.gridColors = [
			['OR', 'BL', 'PU', 'PI', 'YE', 'RE', 'GR', 'BR'],
			['RE', 'OR', 'PI', 'GR', 'BL', 'YE', 'BR', 'PU'],
			['GR', 'PI', 'OR', 'RE', 'PU', 'BR', 'YE', 'BL'],
			['PI', 'PU', 'BL', 'OR', 'BR', 'GR', 'RE', 'YE'],
			['YE', 'RE', 'GR', 'BR', 'OR', 'BL', 'PU', 'PI'],
			['BL', 'YE', 'BR', 'PU', 'RE', 'OR', 'PI', 'GR'],
			['PU', 'BR', 'YE', 'BL', 'GR', 'PI', 'OR', 'RE'],
			['BR', 'GR', 'RE', 'YE', 'PI', 'PU', 'BL', 'OR']
		];

		//Create the grid
		$scope.grid = [];
		for(var rowIdx in $scope.gridColors) {
			$scope.grid[rowIdx] = [];
			for(var tileIdx in $scope.gridColors) {
				$scope.grid[rowIdx][tileIdx] = {
					color: $scope.gridColors[rowIdx][tileIdx]
				};
			}
		}

		/**
		 * Select a tile
		 *
		 * @param int rowIdx ID of the row
		 * @param int tileIdx ID of the tile
		 *
		 * @return void
		 */
		$scope.select = function(rowIdx, tileIdx)
		{
			console.log('selected ' + rowIdx + ':' + tileIdx);
		};


	});


})();
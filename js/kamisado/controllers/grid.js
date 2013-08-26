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
				//Create the tile
				var tile = {
					color: $scope.gridColors[rowIdx][tileIdx]
				};

				//Place towers
				if( rowIdx == 0 ) {
					tile.tower = 'WH';
				}
				else if( rowIdx == 7 ) {
					tile.tower = 'BK';
				}
				else {
					tile.tower = false;
				}

				//Save tile
				$scope.grid[rowIdx][tileIdx] = tile;
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
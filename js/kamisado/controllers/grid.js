(function() {
	'use strict';

	angular.module('kamisado').controller('gridController', function($scope) {

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
					color: $scope.gridColors[rowIdx][tileIdx],
					selected: false
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
		 * Run all tiles of the grid through a function
		 *
		 * @param function fn The function that will transform the tile
		 *
		 * @return void
		 */
		$scope.processGrid = function(fn) {
			for(var rowIdx in $scope.grid) {
				for(var tileIdx in $scope.grid[rowIdx]) {
					$scope.grid[rowIdx][tileIdx] = fn($scope.grid[rowIdx][tileIdx]);
				}
			}
		};

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
			var tile = $scope.grid[rowIdx][tileIdx],
				tileSelected = tile.selected,
				tileSelectable = ( tile.tower !== false );

			//Check that the player can select the tile
			if( tileSelectable ) {
				//All tiles should be unselected
				$scope.processGrid(function(tile){
					tile.selected = false;
					return tile;
				});

				$scope.grid[rowIdx][tileIdx].selected = !tileSelected;
			}
		};


	});


})();
(function() {
	'use strict';

	angular.module('kamisado').controller('gridController', function($scope, playerService) {

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

		//Selected tower
		$scope.selectedTower = null;

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

		//Watch player changes
		$scope.currentPlayer = playerService.getCurrentPlayer;
		$scope.$watch('currentPlayer()', function(oldPlayer, newPlayer){
			$scope.updateGrid(newPlayer);
		});

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
				selectedTowerType;

			//Check that the player can select the tile
			if( tile.selectable ) {
				//All tiles should be unselected
				$scope.processGrid(function(tile){
					tile.selected = false;
					return tile;
				});

				//Invert selection state
				tileSelected = !tileSelected;

				$scope.updateTile(rowIdx, tileIdx, { selected: tileSelected} );

				//Store the new selected tower
				if( tileSelected ) {
					$scope.selectedTower = {
						rowIdx: rowIdx,
						tileIdx: tileIdx,
						type: tile.tower
					};
				}
			}
			//Check that the player can move a selected tower there
			if( $scope.selectedTower !== null && tile.tower === false ) {
				//Move the tower, if we can
				$scope.updateTile(rowIdx, tileIdx, { tower: $scope.selectedTower.type });

				//Remove the tower from the selected tile and unselect it
				$scope.updateTile($scope.selectedTower.rowIdx, $scope.selectedTower.tileIdx, { 
					tower: false,
					selected: false
				});
				$scope.selectedTower = null;

				//Start next turn
				playerService.nextTurn();
			}
		};

		/**
		 * Update a specific tile
		 *
		 * @param int rowIdx Row index
		 * @param int tileIdx Tile index
		 * @param object values New tiles values
		 *
		 * @return void
		 */
		$scope.updateTile = function(rowIdx, tileIdx, values)
		{
			for(var valueName in values) {
				$scope.grid[rowIdx][tileIdx][valueName] = values[valueName];
			}
		};

		/**
		 * Update the grid
		 *
		 * @return void
		 */
		$scope.updateGrid = function(player)
		{
			var player = playerService.getCurrentPlayer(),
				selectableTower = (player == 'Black') ? 'BK' : 'WH';

			$scope.processGrid(function(tile){
				tile.selectable = ( tile.tower === selectableTower );
				return tile;
			});
		};

		//Grid ready
		$scope.$emit('gridReady', {});
	});


})();
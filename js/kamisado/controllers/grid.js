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
				var start, destination;

				start = {rowIdx: $scope.selectedTower.rowIdx, tileIdx: $scope.selectedTower.tileIdx };
				destination = {rowIdx: rowIdx, tileIdx: tileIdx };

				if( $scope.isAllowedMove(start, destination) ) {
					$scope.updateTile(destination.rowIdx, destination.tileIdx, { tower: $scope.selectedTower.type });

					//Remove the tower from the selected tile and unselect it
					$scope.updateTile(start.rowIdx, start.tileIdx, { 
						tower: false,
						selected: false
					});
					$scope.selectedTower = null;

					//Start next turn
					playerService.nextTurn();
				}

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

		/**
		 * Tell if a specific move is allowed
		 *
		 * @param object start Start coordinates
		 * @param object destination Destination coordinates
		 *
		 * @return boolean
		 */
		$scope.isAllowedMove = function(start, destination)
		{
			var currentPlayer = playerService.getCurrentPlayer(),
				deltaX = destination.tileIdx - start.tileIdx,
				deltaY = destination.rowIdx - start.rowIdx,
				directionAllowed,
				moveAllowed = false,
				validMove = false;


			//First check if we are moving horizontally
			if( deltaY === 0 ) {
				moveAllowed = true;
			}
			//If not, we must check if the direction is allowed
			else {
				directionAllowed = ( ( currentPlayer === 'Black' && deltaY <= -1 ) || ( currentPlayer === 'White' && deltaY >= 1 ) );
				if( directionAllowed ) {
					//Is it vertical?
					if( deltaX === 0 ) {
						moveAllowed = true;
					}
					//Is it diagonal?
					else if( Math.abs(deltaX) === Math.abs(deltaY) ) {
						moveAllowed = true;
					}
				}
			}

			//If the move is allowed, let's do a final check to see if a tower is in the way
			validMove = moveAllowed && ! $scope.towersInTheWay(start, destination);

			return validMove;
		};

		/**
		 * Check a path to see if there are towers in the way
		 *
		 * @param object start Start coordinates
		 * @param object destination Destination coordinates
		 *
		 * @return boolean
		 */
		$scope.towersInTheWay = function(start, destination)
		{
			var path = [],
				deltaX = destination.tileIdx - start.tileIdx,
				deltaY = destination.rowIdx - start.rowIdx,
				xDir = (deltaX > 0) ? 1 : (deltaX < 0) ? -1 : 0,
				yDir = (deltaY > 0) ? 1 : (deltaY < 0) ? -1 : 0,
				x = start.tileIdx + xDir,
				y = start.rowIdx + yDir;

				//Build the path
				while( x !== destination.tileIdx || y !== destination.rowIdx ) {

					path.push({
						tileIdx: x,
						rowIdx: y
					});

					x += ( x !== destination.tileIdx ) ? xDir : 0;
					y += ( y !== destination.rowIdx ) ? yDir : 0;

				}

				//Now that we have the path, iterate on each tile to find check for towers
				for(var idx in path) {
					var tile = $scope.grid[path[idx].rowIdx][path[idx].tileIdx];
					if( tile.tower !== false ) {
						return true;
					}
				}

			return false;
		};

		//Grid ready
		$scope.$emit('gridReady', {});
	});


})();
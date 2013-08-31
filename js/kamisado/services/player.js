(function(){
	'use strict';

	angular.module("kamisado").factory("playerService", function(){
		var service = {};

		//Define the players
		service.players = {
			BLACK: 'Black',
			WHITE: 'White'
		};

		/**
		 * Set the current player
		 *
		 * @param string player The new player
		 *
		 * @return void
		 */
		service.setPlayer = function(player)
		{
			service.currentPlayer = player;
			// service.$broadcast('playerChanged', { newPlayer: player });
		};

		/**
		 * Return the current player
		 * 
		 * @return string
		 */
		service.getCurrentPlayer = function()
		{
			return service.currentPlayer;
		};

		/**
		 * Init the next turn
		 *
		 * @return void
		 */
		service.nextTurn = function() {
			var players = service.players,
				newPlayer;

			newPlayer = ( service.currentPlayer === players.BLACK ) ? players.WHITE : players.BLACK;
			service.setPlayer(newPlayer);
		};

		//Define the first player
		var firstPlayer = ( Math.random() > 0.5 ) ? service.players.BLACK : service.players.WHITE;
		service.setPlayer(firstPlayer);

		return service;
	});

})();
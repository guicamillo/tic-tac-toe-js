var subscribers = [];

function Store() {
	this.prevState = {};
	this.state = {};

	this.state = this.update(this.state, {});
}

Store.prototype.getState = function() {
	return this.state;
};

Store.prototype.getPrevState = function() {
	return this.prevState;
};

Store.prototype.dispatch = function(action) {
	this.prevState = this.state;
	this.state = this.update(this.state, action);

	this.notifySubscribers();
};

Store.prototype.update = function(state, action) {
	return {
		grid: updateGrid(state.grid, action),
		turn: updateTurn(state.turn, action),
		score: updateScore(state.score, action),
		winnerSequence: updateWinnerSequence(state.winnerSequence, action),
		turnCounter: updateCounter(state.turnCounter, action),
		player: updatePlayer(state.player, action)
	};
};

Store.prototype.subscribe = function(fn) {
	subscribers.push(fn);
};

Store.prototype.notifySubscribers = function() {
	subscribers.forEach(function(subscriber) {
		subscriber(this.prevState, this.state);
	}.bind(this));
};

function updateGrid(grid, action) {
	grid = grid || ['', '', '', '', '', '', '', '', ''];

	return grid.map(function(c, i) {
		var output = c;

		if (action.index === i || action.type === 'RESTART_GAME') {
			output = updateCell(c, action);
		}

		return output;
	});
}

function updateCell(cell, action) {
	switch (action.type) {
		case 'SET_X':
			return 'x';
		case 'SET_O':
			return 'o';
		case 'RESTART_GAME':
			return '';
		default:
			return cell;
	}
}

function updateTurn(turn, action) {
	switch (action.type) {
		case 'SET_X':
			return 'o';
		case 'SET_O':
			return 'x';
		case 'SHOW_WINNER':
			return action.winner;
		case 'RESTART_GAME':
			return 'x';
		default:
			return turn || 'x';
	}
}

function updateScore(score, action) {
	switch (action.type) {
		case 'SHOW_WINNER':
			var newScore = {};
			newScore[action.winner] = score[action.winner] + 1;
			return Object.assign({}, score, newScore);
		default:
			return score || { x: 0, o: 0 };
	}
}

function updateWinnerSequence(winnerSequence, action) {
	switch (action.type) {
		case 'SHOW_WINNER':
			return action.sequence.slice();
		case 'RESTART_GAME':
			return [];
		default:
			return winnerSequence || [];
	}
}

function updateCounter(turnCounter, action) {
	switch (action.type) {
		case 'SET_X':
			return turnCounter + 1;
		case 'SET_O':
			return turnCounter + 1;
		case 'RESTART_GAME':
			return 0;
		default:
			return turnCounter || 0;
	}
}

function updatePlayer(player, action) {
	switch (action.type) {
		case 'PICK_SIDE':
			return action.side;
		default:
			return player || '';
	}
}

module.exports = new Store();

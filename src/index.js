import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    /**
     * Render method for square react component
     * @returns button tag for a game square
     * @memberof Square
     */
    render() {
        let buttonClass = '';

        if (this.props.buttonClass) {
            buttonClass += (' ' + this.props.buttonClass);
        }

        return (
            <button className={'square' + buttonClass}
                    onClick={() => { this.props.onClick() }}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 3,
            columns: 3
        };
    }

    /**
     * @param {Number} i - Index (0-based) of the square array for which square needs to be rendered
     * @returns - Single square component to render
     * @memberof Board
     */
    renderSquare(i) {
        let buttonClass = '';

        if (this.props.winningMoves && this.props.winningMoves.indexOf(i) > -1) {
            buttonClass = 'winning-move';
        }

        return <Square
                    value={this.props.squares[i]}
                    buttonClass={buttonClass}
                    key={i}
                    onClick={() => {
                        if (this.props.onClick) {
                            this.props.onClick(i)
                        }
                    }}
                />;
    }

    /**
     * Render method for board react component
     * @returns div tag containing all button tags for a game board
     * @memberof Board
     */
    render() {
        let boardRows = [];
        for (let i = 0; i < this.state.rows; i++) {
            let rowSquares = [];
            for (let j = 0; j < this.state.columns; j++) {
                let index = (i * this.state.rows) + j;
                rowSquares.push(this.renderSquare(index));
            }

            boardRows.push(<div key={i} className="board-row">{rowSquares}</div>)
        }
        return (
            <div>{boardRows}</div>
        );
    }
}

class Game extends React.Component {
    /**
     * Creates an instance of Game.
     * @param {Object} props - properties added in game tag
     * @memberof Game
     */
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }], // array will contain state of board at every step. Initially empty
            stepNumber: 0,  // on which step currently the user is
            xIsNext: true,   // Determine if next move is X or O
            isHistoryLoaded: false // Check to see if currently board is loaded from history
        };
    }

    /**
     * @param {Number} i - the index of the square clicked
     * @memberof Game
     */
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // Game is complete or square is already filled
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            isHistoryLoaded: false
        });
    }

    /**
     * Checks if game is finished with any winner
     * @param {Array} squares
     * @returns The winner symbol or null if no winner yet
     * @memberof Game
     */
    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a]
                && squares[a] === squares[b]
                && squares[a] === squares[c]) {
                return {
                    symbol: squares[a],
                    winningMoves: lines[i].slice()
                };
            }
        }

        return null;
    }

    /**
     * To move to a particular state/step in game
     * @param {Number} step
     * @memberof Game
     */
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
            isHistoryLoaded: true
        });
    }

    /**
     * Render method for game react component
     * @returns Returns markup containing board, status and moves list
     * @memberof Game
     */
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const moves = history.map((step, move) => {
            const desc = move
                ? 'Go to move #: ' + move
                : 'Go to game start';
            let squareButtonClass = '';

            if (this.state.isHistoryLoaded && move === this.state.stepNumber) {
                squareButtonClass = 'from-history';
            }

            return(
                <li key={move}>
                    <button className={squareButtonClass} onClick={() => this.jumpTo(move)}>{desc}</button>
                    <Board squares={step.squares} />
                </li>
            );
        });

        const winner = this.calculateWinner(current.squares);
        let status;
        let winningMoves = [];

        if (winner) {
            status = 'Winner: ' + winner.symbol;
            winningMoves = winner.winningMoves;
        } else {
            status = current.squares.indexOf(null) < 0
                ? 'Game Drawn'
                : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningMoves={winningMoves}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol className="moves">{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

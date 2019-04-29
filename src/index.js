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
        return (
            <button className="square"
                    onClick={() => { this.props.onClick() }}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    /**
     * @param {Number} i - Index (0-based) of the square array for which square needs to be rendered
     * @returns - Single square component to render
     * @memberof Board
     */
    renderSquare(i) {
        return <Square
                    value={this.props.squares[i]}
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
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
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
                return squares[a];
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
        const winner = this.calculateWinner(current.squares);

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

        let status;

        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
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

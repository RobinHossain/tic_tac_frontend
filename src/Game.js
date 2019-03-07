import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchGameData, updateOrCreateGameData } from "./actions/game";

/**
 * Update the initial browser id to be pulled from Local Storage if it exists.
 * @type {string}
 */
const existing_browser_id = localStorage.getItem('browser_id');
const browser_id = existing_browser_id || genNewBrowserId();

/**
 * Generate Browser ID regarding User Visit For First Time
 * @returns {string}
 */
function genNewBrowserId(){
    const current_time = new Date().getTime();
    const random_string = Math.random().toString(36).substring(8);
    const new_id = current_time + random_string;
    localStorage.setItem('browser_id', new_id);
    return new_id;
}

/**
 * Box Dom and Event Handle
 * @param props
 * @returns {*}
 * @constructor
 */
function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

/**
 * Flex Box Squire
 */
class Board extends Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

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

/**
 * Our Main Game Class
 */
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            browser_id: browser_id
        };
    }

    componentDidMount() {
        this.props.fetchGameData(this.state.browser_id);
        this.setExistingData();
    }

    setExistingData = () => {
        const self = this;
        setTimeout(function () {
            const game_data = self.props.game_data;
            self.setState({ history: game_data.history, stepNumber: game_data.step_number, xIsNext: game_data.x_is_next })
        });
    };

    updateOrCreateData = () => {
        let data_store = {};
        data_store.browser_id = this.state.browser_id;
        data_store.step_number = this.state.stepNumber;
        data_store.history = this.state.history;
        data_store.x_is_next = this.state.xIsNext;
        this.props.updateOrCreateGameData(data_store);
    };


    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if( calculateWinner(squares) || squares[i] ) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });

        const self = this;

        setTimeout(function () {
            self.updateOrCreateData();
        }, 10)
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
        }

        return (
            <div className="game_container">
                <div className='game_status'>
                    <h2>{status}</h2>
                </div>
                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                </div>
                <div className="game_move">
                    <ol>{moves}</ol>
                </div>
            </div>

        );
    }
}

/**
 * Set Props Variable Regarding Redux response data
 * @param state
 * @returns {{game_data: (INITIAL_STATE.game_data|{}), errorMessage: *}}
 */
function mapStateToProps(state) {
    return {
        game_data: state.game.game_data,
        errorMessage: state.game.error,
    };
}

const mapDispatchToProps = {
    fetchGameData,
    updateOrCreateGameData
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);

/**
 * Calculate The Winner
 * @param squares
 * @returns {*}
 */
function calculateWinner(squares) {
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

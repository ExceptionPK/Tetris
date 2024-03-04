import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Dimensions, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Board from './Board';
import Piece from './Piece';
import PiecePreview from './PiecePreview';
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';

// Define las diferentes formas de las piezas del Tetris
const TETROMINOS = {
    //0: { shape: [[0]], color: 'transparent' },
    I: {
        shape: [
            [1, 1, 1, 1],
        ],
        color: 'cyan',
    },
    J: {
        shape: [
            [2, 2, 2],
            [0, 0, 2],
        ],
        color: 'blue',
    },
    L: {
        shape: [
            [3, 3, 3],
            [3, 0, 0],
        ],
        color: 'orange',
    },
    O: {
        shape: [
            [4, 4],
            [4, 4],
        ],
        color: 'yellow',
    },
    S: {
        shape: [
            [0, 5, 5],
            [5, 5, 0],
        ],
        color: 'green',
    },
    T: {
        shape: [
            [6, 6, 6],
            [0, 6, 0],
        ],
        color: 'purple',
    },
    Z: {
        shape: [
            [7, 7, 0],
            [0, 7, 7],
        ],
        color: 'red',
    },
};

const Tetris = () => {
    const [board, setBoard] = useState([]);
    const [currentPiece, setCurrentPiece] = useState(null);
    const [currentPiecePosition, setCurrentPiecePosition] = useState({ x: 0, y: 0 });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);


    useEffect(() => {
        initializeBoard();
        generateNewPiece();
        startAutoDrop();
    }, []);

    useEffect(() => {
        if (!canMoveDown()) {
            mergePieceWithBoard();
            checkForLines();
            generateNewPiece();
        }
    }, [currentPiecePosition]);



    const initializeBoard = () => {
        const newBoard = Array.from({ length: BOARD_HEIGHT }, () =>
            Array(BOARD_WIDTH).fill(0)
        );
        setBoard(newBoard);
    };

    const generateNewPiece = () => {
        const tetrominoKeys = Object.keys(TETROMINOS);
        const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
        const newPiece = TETROMINOS[randomKey];
        setCurrentPiece(newPiece);
        setCurrentPiecePosition({ x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 });
    };

    // Para reiniciar el juego
    const restartGame = () => {
        initializeBoard();
        setScore(0);
        setGameOver(false);
        generateNewPiece();
    };

    const startAutoDrop = () => {
        const intervalId = setInterval(() => {
            movePieceDown();
        }, 1000);
        return () => clearInterval(intervalId);
    };

    const movePieceDown = () => {
        if (canMoveDown()) {
            setCurrentPiecePosition((prevPosition) => ({
                ...prevPosition,
                y: prevPosition.y + 1,
            }));
        } else {
            mergePieceWithBoard();
            checkForLines();
            generateNewPiece();
        }
    };

    const canMoveDown = () => {
        if (!currentPiece) return false;
        const { shape } = currentPiece;
        const { x, y } = currentPiecePosition;

        // Verificar si hay alguna colisión con el fondo del tablero
        if (y + shape.length >= BOARD_HEIGHT) return false;

        // Verificar si hay alguna colisión con las piezas existentes en el tablero
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const boardRow = y + row + 1;
                    const boardCol = x + col;
                    if (boardRow < 0 || boardRow >= BOARD_HEIGHT || boardCol < 0 || boardCol >= BOARD_WIDTH || board[boardRow][boardCol] !== 0) {
                        return false;
                    }
                }
            }
        }

        return true;
    };

    const mergePieceWithBoard = () => {
        if (!currentPiece) return;
        const { shape } = currentPiece;
        const { x, y } = currentPiecePosition;

        // Fusiona la pieza con el tablero
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const boardRow = y + row;
                    const boardCol = x + col;
                    if (boardRow >= 0 && boardRow < BOARD_HEIGHT && boardCol >= 0 && boardCol < BOARD_WIDTH) {
                        board[boardRow][boardCol] = shape[row][col];
                    }
                }
            }
        }
    };

    const checkForLines = () => {
        let linesCleared = 0;
        for (let row = 0; row < BOARD_HEIGHT; row++) {
            // Verificar si la fila no está vacía y si todas las celdas son diferentes de 0
            if (board[row] && board[row].every(cell => cell !== 0)) {
                // Elimina la línea completa
                board.splice(row, 1);
                // Agrega una nueva línea en la parte superior
                board.unshift(Array(BOARD_WIDTH).fill(0));
                linesCleared++;
            }
        }
        if (linesCleared > 0) {
            // Incrementa el puntaje o realiza cualquier otra acción necesaria
            setScore(prevScore => prevScore + linesCleared * 100);
        }
    };


    const movePieceLeft = () => {
        if (!currentPiece) return;
        const { shape } = currentPiece;
        const { x, y } = currentPiecePosition;

        // Verifica si la pieza puede moverse hacia la izquierda sin colisiones
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const boardRow = y + row;
                    const boardCol = x + col - 1;
                    if (boardRow >= 0 && boardRow < BOARD_HEIGHT && (boardCol < 0 || board[boardRow][boardCol] !== 0)) {
                        return;
                    }
                }
            }
        }

        setCurrentPiecePosition((prevPosition) => ({
            ...prevPosition,
            x: prevPosition.x - 1,
        }));
    };

    const movePieceRight = () => {
        if (!currentPiece) return;
        const { shape } = currentPiece;
        const { x, y } = currentPiecePosition;

        // Verifica si la pieza puede moverse hacia la derecha sin colisiones
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const boardRow = y + row;
                    const boardCol = x + col + 1;
                    if (boardRow >= 0 && boardRow < BOARD_HEIGHT && (boardCol >= BOARD_WIDTH || board[boardRow][boardCol] !== 0)) {
                        return;
                    }
                }
            }
        }

        setCurrentPiecePosition((prevPosition) => ({
            ...prevPosition,
            x: prevPosition.x + 1,
        }));
    };

    const rotatePiece = () => {
        if (!currentPiece) return;

        const { shape } = currentPiece;
        const rotatedShape = shape[0].map((_, columnIndex) =>
            shape.map((row) => row[columnIndex]).reverse()
        );

        // Verificar si la rotación colisiona con los bordes del tablero
        const { x, y } = currentPiecePosition;
        const maxX = BOARD_WIDTH - rotatedShape[0].length;
        const maxY = BOARD_HEIGHT - rotatedShape.length;
        const newPositionX = Math.min(Math.max(0, x), maxX);
        const newPositionY = Math.min(Math.max(0, y), maxY);

        setCurrentPiece((prevPiece) => ({
            ...prevPiece,
            shape: rotatedShape,
        }));

        setCurrentPiecePosition({ x: newPositionX, y: newPositionY });
    };


    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                    <Text style={styles.restartButtonText}>Restart</Text>
                </TouchableOpacity>
                <Text style={styles.scoreText}>Score: {score}</Text>
            </View>
            <Board board={board} currentPiece={currentPiece} currentPiecePosition={currentPiecePosition} />
            <View style={styles.controls}>
                <View style={styles.controlButton}>
                    <TouchableOpacity onPress={movePieceLeft}>
                        <AntDesign name="left" size={40} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.controlButton}>
                    <TouchableOpacity onPress={movePieceDown}>
                        <AntDesign name="down" size={40} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.controlButton}>
                    <TouchableOpacity onPress={movePieceRight}>
                        <AntDesign name="right" size={40} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.controlButtonRotate}>
                    <TouchableOpacity onPress={rotatePiece}>
                        <AntDesign name="reload1" size={40} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        right: 150,
        bottom: 280,
    },
    boardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: 80,
        bottom: 10,
    },
    controls: {
        flexDirection: 'row',
        left: 150,
        top: 610,
    },
    controlButton: {
        paddingHorizontal: 15,
        right: 30,
    },
    controlButtonRotate: {
        paddingHorizontal: 15,
        left: 20,
    },
    scoreText: {
        fontSize: 25,
        top: 2,
        left: 130,
        fontWeight: 'bold',
    },
    restartButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    restartButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default Tetris;
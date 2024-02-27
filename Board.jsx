import React from 'react';
import { View, StyleSheet } from 'react-native';
import Piece from './Piece';
import { CELL_SIZE } from './constants';

const Board = ({ board, currentPiece, currentPiecePosition }) => {
  const renderPiece = () => {
    if (!currentPiece) return null;

    const { shape, color } = currentPiece;
    return shape.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, cellIndex) => (
          <Piece
            key={cellIndex}
            color={cell === 0 ? 'transparent' : color}
            cellSize={CELL_SIZE}
            position={{ x: currentPiecePosition.x + cellIndex, y: currentPiecePosition.y + rowIndex }}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.board}>
      {renderPiece()}
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <Piece
              key={cellIndex}
              color={cell === 0 ? 'transparent' : 'black'}
              cellSize={CELL_SIZE}
              position={{ x: cellIndex, y: rowIndex }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: .5,
    borderColor: 'black',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    position: 'relative', 
  },
});

export default Board;
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Piece = ({ color, position, cellSize }) => {
  const { x, y } = position;

  return (
    <View style={[styles.piece, { backgroundColor: color, width: cellSize, height: cellSize, left: x * cellSize, top: y * cellSize }]} />
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    borderRadius: 4,
    borderWidth: .5,
  },
});

export default Piece;
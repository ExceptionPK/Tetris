import React from 'react';
import { View, StyleSheet } from 'react-native';
import Piece from './Piece';

const PiecePreview = ({ nextPiece }) => {
  return (
    <View style={styles.container}>
      <Piece color={nextPiece.color} shape={nextPiece.shape} cellSize={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
  },
});

export default PiecePreview;
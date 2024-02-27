import React from 'react';
import { StyleSheet, View } from 'react-native';
import Tetris from './Components/Tetris';

const App = () => {
  return (
    <View style={styles.container}>
      <Tetris />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

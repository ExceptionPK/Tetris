import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text, ImageBackground} from 'react-native';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const CELL_SIZE = 35;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const backgroundImage = require('./assets/tetrisBackground.png');

const App = () => {
  
  /*---------------DEFINO LAS FUENTES QUE VOY A UTILIZAR--------------*/
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    if(!fontsLoaded){
      loadFonts();
    }
  });

  const loadFonts = async () => {
    Font.loadAsync({
      'rowdies_bold': require('./assets/fonts/rowdies_bold.ttf'),
      'rowdies_light': require('./assets/fonts/rowdies_light.ttf'),
      'rowdies_regular': require('./assets/fonts/rowdies_regular.ttf')
    });

    setFontsLoaded(true);
  }

  if(!fontsLoaded){
    return(<View/>);
  }

  /* --------------------------------------------------------------- */

  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Función para inicializar el tablero
  const initializeBoard = () => {
    const newBoard = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    );
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  // Función para renderizar el tablero
  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, cellIndex) => (
          <View key={cellIndex} style={[styles.cell, { backgroundColor: cell === 0 ? 'rgba(255,255,255,0)' : 'black' }]} />
        ))}
      </View>
    ));
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
      <View style={styles.scoreContainer}>
          <Text style={styles.score}>SCORE: {score}</Text>
      </View>
      <View style={styles.nextContainer}>
          <Text style={styles.next}>NEXT: </Text>
      </View>
        <View style={styles.board}>{renderBoard()}</View>
        {gameOver && <Text style={styles.gameOver}>Game Over</Text>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    top: 45,
    right: 30, 
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
    color: 'orange',
    fontFamily: 'rowdies_regular'
  },
  nextContainer: {
    position: 'absolute',
    top: 45,
    left: 30, 
  },
  next: {
    fontSize: 20,
    marginBottom: 20,
    color: 'orange',
    fontFamily: 'rowdies_regular'
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: CELL_SIZE * BOARD_WIDTH,
    height: CELL_SIZE * BOARD_HEIGHT,
    borderWidth: 0.6,
    borderColor: 'orange',
    backgroundColor: 'rgba(0,0,0,0.2)', 
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.7,
    borderColor: 'orange'
  },
  gameOver: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
});

export default App;

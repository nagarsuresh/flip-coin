import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// --- IMPORTANT ---
// Create an 'assets' folder in your project root,
// and inside it, an 'images' folder.
// Place 'head.jpg' and 'tail.jpg' in 'flip-coin/assets/images/'
// For example: /Users/nagars/Work/reactnative/flip-coin/assets/images/head.jpg
const headImage = require('../assets/images/head.png');
const tailImage = require('../assets/images/tail.png');

export default function Index() {
  const [currentSide, setCurrentSide] = useState<'head' | 'tail'>('head');
  const [isSpinning, setIsSpinning] = useState(false);
  // useRef is used to keep the Animated.Value instance stable across re-renders
  const spinAnim = useRef(new Animated.Value(0)).current;

  const flipCoin = () => {
    if (isSpinning) {
      return; // Don't allow re-triggering while spinning
    }

    setIsSpinning(true);
    spinAnim.setValue(0); // Reset animation value before starting

    // Determine the outcome before starting the animation
    const randomOutcome = Math.random() < 0.5 ? 'head' : 'tail';

    // Calculate the number of spins needed to land on the desired outcome
    // We'll do 3-4 full spins plus additional rotation to land on the correct side
    const baseSpins = 3; // 3 full spins
    const additionalRotation = currentSide === randomOutcome ? 0 : 0.5; // 0.5 = 180 degrees to flip to other side
    const totalRotation = baseSpins + additionalRotation;

    Animated.timing(spinAnim, {
      toValue: totalRotation,
      duration: 2000,
      easing: Easing.out(Easing.cubic), // Smooth deceleration for a natural stop
      useNativeDriver: true, // Improves animation performance
    }).start(() => {
      // This callback executes after the animation completes
      setCurrentSide(randomOutcome);
      setIsSpinning(false);
    });
  };

  // Interpolate the animated value to a rotation string for the Y axis
  const rotateY = spinAnim.interpolate({
    inputRange: [0, 4], // Adjust based on max rotation
    outputRange: ['0deg', '1440deg'], // 4 full spins (4 * 360deg = 1440deg)
  });

  // Create interpolated values for each side's opacity and rotation
  const headOpacity = spinAnim.interpolate({
    inputRange: [0, 0.25, 0.75, 1, 1.25, 1.75, 2, 2.25, 2.75, 3, 3.25, 3.75, 4],
    outputRange: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    extrapolate: 'clamp',
  });

  const tailOpacity = spinAnim.interpolate({
    inputRange: [0, 0.25, 0.75, 1, 1.25, 1.75, 2, 2.25, 2.75, 3, 3.25, 3.75, 4],
    outputRange: [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const headRotateY = spinAnim.interpolate({
    inputRange: [0, 4],
    outputRange: ['0deg', '1440deg'],
  });

  const tailRotateY = spinAnim.interpolate({
    inputRange: [0, 4],
    outputRange: ['180deg', '1620deg'], // Start 180 degrees offset
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={flipCoin}
      activeOpacity={1} // To prevent visual feedback on the container itself
    >
      <View style={styles.coinContainer}>
        {/* Head side */}
        <Animated.Image
          source={headImage}
          style={[
            styles.coinImage,
            styles.coinSide,
            {
              opacity: headOpacity,
              transform: [{ rotateY: headRotateY }],
            },
          ]}
        />
        
        {/* Tail side */}
        <Animated.Image
          source={tailImage}
          style={[
            styles.coinImage,
            styles.coinSide,
            {
              opacity: tailOpacity,
              transform: [{ rotateY: tailRotateY }],
            },
          ]}
        />
      </View>
      
      {/* Result label */}
      {!isSpinning && (
        <Text style={styles.resultLabel}>
          {currentSide.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // A light background color
  },
  coinContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinImage: {
    width: 180, // Adjust size as needed
    height: 180, // Adjust size as needed
    resizeMode: 'contain',
  },
  coinSide: {
    position: 'absolute',
  },
  resultLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
});

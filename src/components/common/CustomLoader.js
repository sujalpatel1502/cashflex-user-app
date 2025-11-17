import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING } from '../../utils';

const CustomLoader = ({ visible }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <Animatable.View 
            animation="rotate" 
            iterationCount="infinite" 
            duration={1000}
            style={styles.loader}
          >
            <View style={styles.loaderInner} />
          </Animatable.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
    borderRadius: 12,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: COLORS.borderLight,
    borderTopColor: COLORS.gradientStart,
  },
  loaderInner: {
    flex: 1,
  },
});

export default CustomLoader;

import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { queryClient } from './src/config/queryClient';
import Wallpapers from './src/Screens/Wallpapers';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Wallpapers />
      </View>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

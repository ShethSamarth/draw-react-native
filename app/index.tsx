import { Feather } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const Home = () => {
  const [channel, setChannel] = useState('');

  useEffect(() => generateChannelNumber(), []);

  const generateChannelNumber = () => {
    const number = Math.floor(Math.random() * 1000000).toString();
    setChannel(number);
  };

  const onJoin = () => {
    if (channel.length !== 6) return;
    return router.navigate(`/channel/${channel}`);
  };

  return (
    <View>
      <Stack.Screen options={{ title: 'Create A Channel' }} />
      <View style={{ position: 'relative' }}>
        <TextInput
          value={channel}
          onChangeText={setChannel}
          style={styles.input}
          inputMode="numeric"
        />
        <Feather
          style={{ position: 'absolute', top: '32%', right: 20 }}
          onPress={generateChannelNumber}
          name="refresh-ccw"
          color="gray"
          size={25}
        />
      </View>
      {channel.length !== 6 && (
        <Text style={styles.error}>Channel number should be of 6 digits</Text>
      )}
      <TouchableOpacity
        onPress={onJoin}
        style={[styles.button, channel.length !== 6 && { opacity: 0.6 }]}
        disabled={channel.length !== 6}>
        <Text style={styles.text}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  input: {
    borderColor: '#808080',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 8,
  },
  error: {
    color: 'red',
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#2E8A58',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

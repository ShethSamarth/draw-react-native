import { Entypo } from '@expo/vector-icons';
import { RealtimeChannel, createClient } from '@supabase/supabase-js';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Share, View } from 'react-native';

import { DrawingBoard, DrawingBoardRef } from '~/components/drawing-board';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const webUrl = process.env.EXPO_PUBLIC_WEBSITE_URL;

const client = createClient(supabaseUrl!, supabaseAnonKey!);

const randomUsername = `user-${Math.floor(Math.random() * 1000)}`;
const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const Channel = () => {
  const { channel } = useLocalSearchParams();

  const [broadcastChannel, setBroadcastChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const drawingRef = useRef<DrawingBoardRef>(null);

  useEffect(() => {
    if (!channel || isConnected) return;

    const newChannel = client.channel(`drawing-${channel}`);
    setBroadcastChannel(newChannel);

    const subscription = newChannel
      .on('broadcast', { event: 'start' }, ({ payload }) => {
        const { user, x, y, color } = payload;
        drawingRef.current?.receivedStart(x, y, user, color);
      })
      .on('broadcast', { event: 'active' }, ({ payload }) => {
        const { user, x1, y1, x2, y2 } = payload;
        drawingRef.current?.receivedActive(x1, y1, x2, y2, user);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        }
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [channel]);

  const onDrawingStart = (x: number, y: number) => {
    broadcastChannel?.send({
      type: 'broadcast',
      event: 'start',
      payload: { x, y, user: randomUsername, color: randomColor },
    });
  };

  const onDrawingActive = (x1: number, y1: number, x2: number, y2: number) => {
    broadcastChannel?.send({
      type: 'broadcast',
      event: 'active',
      payload: { x1, y1, x2, y2, user: randomUsername },
    });
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Come collaborate with your friends on drawing @draw\n${webUrl}?channel=${channel}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen
        options={{
          title: `Channel: ${channel}`,
          headerRight: () => (
            <Entypo
              style={{ paddingVertical: 5 }}
              onPress={onShare}
              role="button"
              name="share"
              size={25}
            />
          ),
        }}
      />
      {isConnected ? (
        <DrawingBoard ref={drawingRef} onStart={onDrawingStart} onActive={onDrawingActive} />
      ) : (
        <ActivityIndicator size={50} style={{ height: '100%' }} />
      )}
    </View>
  );
};

export default Channel;

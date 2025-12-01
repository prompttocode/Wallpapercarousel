import { useQuery } from '@tanstack/react-query';
import { View, Text, Dimensions, Image, StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const uri =
  'https://api.pexels.com/v1/search?query=wallpaper&orientation=portrait';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const _slideWidth = width * 0.75;
const _slideHeight = _slideWidth * 1.67;
const _itemSpacing = 18;
const _topSpacing = height - _slideHeight;

function Slide({ index, photo, ScrollX }) {
  const containerStylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            ScrollX.value,
            [index - 1, index, index + 1],
            [40, 0, 40],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${interpolate(
            ScrollX.value,
            [index - 1, index, index + 1],
            [15, 1, -15],
            Extrapolation.CLAMP,
          )}deg`,
        },
        {
          scale: interpolate(
            ScrollX.value,
            [index - 1, index, index + 1],
            [1.6, 1, 1.6],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: _slideWidth,
          height: _slideHeight,
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 20,
          shadowOffset: { width: 8, height: 8 },
          elevation: 7,
          borderRadius: 12,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.1)',
        },
        containerStylez,
      ]}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Animated.Image
          style={[{ flex: 1 }, stylez]}
          source={{ uri: photo.src.medium }}
        />
      </View>
    </Animated.View>
  );
}

function BackDropImage({ photo, index, scrollX }) {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0, 1, 0],
      ),
    };
  });
  return (
    <Animated.Image
      source={{ uri: photo.src.medium }}
      blurRadius={30}
      style={[StyleSheet.absoluteFillObject, stylez]}
    />
  );
}

function AuthorDetails({ photo, index, scrollX }) {
  const stylez = useAnimatedStyle(() => {
    return {

      transform:[{
        translateX: interpolate(
          scrollX.value,
          [index - 0.5, index, index + 0.5],
          [width/2, 0, -width/2],
        ),
      }
      ],
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0, 1, 0],
      ),
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          gap: 4,
          height: '30%',
          width: '80%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: width * 0.1,
        },
        stylez,
      ]}
    >
      <Text
        style={{
          fontSize: 18,
          color: '#fff',
          fontWeight: 'bold',
          textTransform: 'capitalize',
        }}
      >
        {photo.photographer}
      </Text>
      <Text style={{ color: '#fff', opacity: 0.5, textAlign: 'center' }}>
        {photo.alt}
      </Text>
    </Animated.View>
  );
}

const Wallpapers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['wallpapers', 'collection'],
    queryFn: async () => {
      const res = await fetch(uri, {
        headers: {
          Authorization:
            'rFQx9vogvbc75nMqvPs2iy6OXhNgR2n2c9LoGhBu5grU1h4Rsg5WrSP1',
        },
      });
      const data = await res.json();

      return data.photos;
    },
  });

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => {
    scrollX.value = e.contentOffset.x / (_slideWidth + _itemSpacing);
  });

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000' }}
    >
      <View style={[StyleSheet.absoluteFillObject]}>
        {data.map((photo, index) => (
          <BackDropImage
            key={photo.id}
            photo={photo}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: _topSpacing,
        }}
      >
        {data.map((photo, index) => (
          <AuthorDetails
            key={photo.id}
            index={index}
            photo={photo}
            scrollX={scrollX}
          />
        ))}
      </View>
      <Animated.FlatList
        data={data}
        horizontal
        snapToInterval={_slideWidth + _itemSpacing}
        decelerationRate={'fast'}
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60}
        contentContainerStyle={{
          gap: _itemSpacing,
          paddingHorizontal: (width - _slideWidth) / 2,
          alignItems: 'center',
          paddingTop: _topSpacing,
        }}
        style={{ marginTop: -_topSpacing }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <Slide index={index} photo={item} ScrollX={scrollX} />
        )}
      />
    </View>
  );
};

export default Wallpapers;

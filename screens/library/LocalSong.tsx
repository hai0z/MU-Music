import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useCallback, useMemo} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {FlashList} from '@shopify/flash-list';
import {handlePlaySongInLocal} from '../../service/trackPlayerService';
import {useNavigation} from '@react-navigation/native';
import useGetLocalSong from '../../hooks/useGetLocalSong';
import Entypo from 'react-native-vector-icons/Entypo';
import useThemeStore from '../../store/themeStore';
import {usePlayerStore} from '../../store/playerStore';
import Loading from '../../components/Loading';
import LocalTrackItem from '../../components/track-item/LocalTrackItem';
const SCREEN_WIDTH = Dimensions.get('window').width;

const LocalSong = () => {
  const {isLoading, localSong} = useGetLocalSong();

  const currentSong = usePlayerStore(state => state.currentSong);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<any>();
  const COLOR = useThemeStore(state => state.COLOR);
  const {setPlayFrom} = usePlayerStore(state => state);
  const playListId = useMemo(() => Math.random().toString(36).substring(7), []);
  const headerColor = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [SCREEN_WIDTH * 0.8, SCREEN_WIDTH * 0.8],
        outputRange: ['transparent', COLOR.BACKGROUND],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  const headerTitleOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.8],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  const titleOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, SCREEN_WIDTH * 0.4, SCREEN_WIDTH * 0.6],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
      }),
    [scrollY],
  );

  const handlePlaySong = useCallback(
    (song: any) => {
      handlePlaySongInLocal(song, {
        id: playListId,
        items: localSong,
      });
      setPlayFrom({
        id: 'local',
        name: 'Bài hát trên thiết bị',
      });
    },
    [localSong],
  );

  if (isLoading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{backgroundColor: COLOR.BACKGROUND}}>
        <Loading />
        <Text className=" mt-2" style={{color: COLOR.TEXT_PRIMARY}}>
          Đang quét nhạc trên thiết bị...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1  w-full"
      style={{backgroundColor: COLOR.BACKGROUND}}>
      <Animated.View
        className="absolute top-0 pt-[35px] left-0 right-0 z-30 h-20  justify-between items-center flex-row px-6"
        style={{backgroundColor: headerColor}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLOR.TEXT_PRIMARY} />
        </TouchableOpacity>
        <View className="justify-center items-center">
          <Animated.Text
            style={{opacity: headerTitleOpacity, color: COLOR.TEXT_PRIMARY}}
            className=" font-bold">
            Bài hát trên thiết bị
          </Animated.Text>
        </View>
        <View className="w-10"></View>
      </Animated.View>
      <FlashList
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        ListHeaderComponent={React.memo(() => {
          return (
            <View className="mb-8">
              <View
                className="flex justify-end items-center pb-4"
                style={{height: SCREEN_WIDTH * 0.8}}>
                <LinearGradient
                  colors={['transparent', COLOR.BACKGROUND]}
                  className="absolute bottom-0 h-40 left-0 right-0 z-50"
                />
                <LinearGradient
                  colors={[COLOR.PRIMARY, 'transparent']}
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      width: SCREEN_WIDTH,
                      height: SCREEN_WIDTH * 0.8,
                    },
                  ]}
                />
                <LinearGradient
                  colors={[COLOR.SECONDARY, COLOR.PRIMARY]}
                  style={[
                    {
                      width: SCREEN_WIDTH * 0.6,
                      height: SCREEN_WIDTH * 0.6,
                    },
                  ]}
                  className="justify-center items-center rounded-lg z-[99]">
                  <Entypo name="folder" size={120} color={COLOR.TEXT_PRIMARY} />
                </LinearGradient>
              </View>
              <View className="z-50 mt-4 px-6 mb-4">
                <Animated.Text
                  style={{opacity: titleOpacity, color: COLOR.TEXT_PRIMARY}}
                  className="text-center text-3xl font-bold">
                  {'Bài hát trên thiết bị'}
                </Animated.Text>
              </View>
            </View>
          );
        })}
        ListFooterComponent={() => <View style={{height: SCREEN_WIDTH}} />}
        nestedScrollEnabled
        data={localSong}
        extraData={currentSong?.id}
        estimatedItemSize={72}
        keyExtractor={(item: any, index) => `${item.encodeId}_${index}`}
        renderItem={({item}: any) => {
          return (
            <LocalTrackItem
              isActive={currentSong?.id == item.encodeId}
              item={item}
              onClick={handlePlaySong}
            />
          );
        }}
      />
    </View>
  );
};

export default LocalSong;

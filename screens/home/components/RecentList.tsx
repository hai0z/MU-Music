import {View, Text, Image} from 'react-native';
import React, {memo, useCallback, useMemo} from 'react';
import useThemeStore from '../../../store/themeStore';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import tinycolor from 'tinycolor2';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {handlePlay, objectToTrack} from '../../../service/trackPlayerService';
import {usePlayerStore} from '../../../store/playerStore';
import useInternetState from '../../../hooks/useInternetState';
import {GREEN} from '../../../constants';
import ActiveTrackAnimation from '../../../components/track-item/ActiveTrackAnimation';

const RecentList = ({data}: any) => {
  const COLOR = useThemeStore(state => state.COLOR);
  const theme = useThemeStore(state => state.theme);

  const isConnected = useInternetState();

  const setCurrentSong = usePlayerStore(state => state.setCurrentSong);

  const setPlayFrom = usePlayerStore(state => state.setPlayFrom);

  const id = useMemo(() => Math.random().toString(36).substring(7), []);

  const currentSong = usePlayerStore(state => state.currentSong);

  const handlePlaySong = useCallback(
    (song: any) => {
      setCurrentSong(objectToTrack(song));
      handlePlay(song, {
        id,
        items: data,
      });
      setPlayFrom({
        id: 'history',
        name: 'Bài hát gần đây',
      });
    },
    [data],
  );

  if (data.length < 6 || !data) return null;
  return (
    <View>
      <Text
        className="text-xl flex justify-between items-end mt-4 mb-3 uppercase mx-4 "
        style={{color: COLOR.TEXT_PRIMARY}}>
        Nghe Lại
      </Text>
      <View
        className="flex flex-wrap flex-row justify-between items-center px-4"
        style={{
          width: wp(100),
        }}>
        {data?.slice(0, 6)?.map((e: any, index: number) => {
          const isActive = currentSong?.id === e?.encodeId;
          return (
            <TouchableOpacity
              disabled={!isConnected}
              onPress={() => handlePlaySong(e)}
              activeOpacity={0.8}
              key={index}
              style={{
                width: wp(50) - 20,
                backgroundColor: COLOR.isDark
                  ? tinycolor(COLOR.BACKGROUND).lighten().toString()
                  : '#ffffff',
                elevation: 1,
                opacity: isConnected ? 1 : 0.5,
              }}
              className="flex flex-row items-center my-1 rounded-t-md rounded-b-md">
              <View>
                <Image
                  source={{uri: e?.thumbnailM}}
                  className="rounded-tl-md rounded-bl-md"
                  style={{width: wp(15), height: wp(15)}}
                />
                {isActive && (
                  <ActiveTrackAnimation
                    isAlbum={false}
                    style={{
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  />
                )}
              </View>
              <Text
                className="px-1"
                numberOfLines={2}
                style={{
                  color: isActive
                    ? theme !== 'amoled'
                      ? COLOR.PRIMARY
                      : GREEN
                    : COLOR.TEXT_PRIMARY,
                  fontWeight: '600',
                  flex: 1,
                  fontSize: wp(3.5),
                }}>
                {e?.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default memo(RecentList);

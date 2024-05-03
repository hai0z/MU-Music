import {View, Text} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import useThemeStore from '../../../store/themeStore';

interface Props {
  isChecked: boolean;
}
const CheckBox = ({isChecked}: Props) => {
  const {COLOR} = useThemeStore();
  return (
    <TouchableOpacity>
      <Feather
        name={isChecked ? 'check-circle' : 'circle'}
        size={24}
        color={isChecked ? COLOR.PRIMARY : COLOR.TEXT_PRIMARY}
      />
    </TouchableOpacity>
  );
};

export default CheckBox;

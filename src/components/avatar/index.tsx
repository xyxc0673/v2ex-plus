import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';

interface IProps {
  userId: number;
  size?: number;
  source: ImageSourcePropType;
  onPress?: () => void;
}

const Avatar = ({ userId, size = 24, source, onPress }: IProps) => {
  const navigation = useNavigation();

  const _handlePress = () => {
    onPress && onPress();
    navigation.navigate('profile', { userId });
  };

  return (
    <TouchableOpacity onPress={_handlePress}>
      <Image
        source={source}
        style={{ width: size, height: size, borderRadius: size }}
      />
    </TouchableOpacity>
  );
};

export default Avatar;

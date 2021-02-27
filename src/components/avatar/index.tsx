import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ImageSourcePropType, Pressable } from 'react-native';

interface IProps {
  userId?: number;
  size?: number;
  source: ImageSourcePropType;
  onPress?: () => void;
}

const Avatar = ({ userId, size = 24, source, onPress }: IProps) => {
  const navigation = useNavigation();

  const _handlePress = () => {
    if (userId) {
      navigation.navigate('profile', { userId });
    }
    onPress && onPress();
  };

  return (
    <Pressable onPress={_handlePress}>
      <Image
        source={source}
        style={{ width: size, height: size, borderRadius: size }}
      />
    </Pressable>
  );
};

export default Avatar;

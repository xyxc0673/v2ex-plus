import { ROUTES } from '@/config/route';
import { navigate } from '@/navigations/root';
import React from 'react';
import { Pressable } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';

interface IProps {
  username?: string;
  size?: number;
  source: Source | number;
  onPress?: () => void;
}

const AvatarComponent = ({ username, size = 24, source, onPress }: IProps) => {
  const _handlePress = () => {
    if (username) {
      navigate(ROUTES.PROFILE, { username });
    }
    onPress && onPress();
  };

  return (
    <Pressable onPress={_handlePress}>
      <FastImage
        source={source}
        style={{
          width: size,
          height: size,
          borderRadius: size,
        }}
      />
    </Pressable>
  );
};

const avatar = React.memo(AvatarComponent);

export default avatar;

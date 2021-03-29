import { Alert } from 'react-native';

interface IAlert {
  title?: string;
  message: string;
  onPress?: (value?: string | undefined) => void;
}

export const alert = ({ title = '提示', message, onPress }: IAlert) => {
  Alert.alert(title, message, [{ text: '确认', onPress: onPress }]);
};

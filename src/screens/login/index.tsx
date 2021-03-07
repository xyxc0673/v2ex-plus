import { Logo } from '@/components/atoms';
import { goBack } from '@/navigations/root';
import { fetchLoginParams, loginByUsername } from '@/store/reducers/user';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const dispatch = useAppDispatch();
  const loginParams = useAppSelector((state) => state.user.loginParams);
  const isLogged = useAppSelector((state) => state.user.isLogged);

  useEffect(() => {
    dispatch(fetchLoginParams());
  }, [dispatch]);

  const handleSubmit = () => {
    dispatch(loginByUsername({ username, password, captcha, loginParams }));
  };

  useEffect(() => {
    console.log('isLogged', isLogged);
    if (isLogged) {
      goBack();
    }
  }, [isLogged]);

  return (
    <View style={[Layout.fill, styles.container]}>
      <Logo width={131.25} height={75} />
      <View style={[Layout.fullWidth, styles.form]}>
        <View style={[Layout.row, styles.inputControl]}>
          <TextInput
            style={styles.input}
            placeholder={'请输入用户名或者邮箱'}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View style={[Layout.row, styles.inputControl]}>
          <TextInput
            style={styles.input}
            placeholder={'请输入密码'}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={[Layout.row, styles.inputControl]}>
          <TextInput
            style={styles.input}
            placeholder={'请输入验证码'}
            onChangeText={(text) => setCaptcha(text)}
          />
          <TouchableOpacity>
            <Image
              style={styles.captcha}
              source={{
                uri: `https://v2ex.com/_captcha?once=${loginParams.once}`,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>确认</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const x = 1.8;
const captchaHeight = 80 / x;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    paddingTop: 32,
    alignItems: 'center',
  },
  form: {
    marginTop: 24,
  },
  inputControl: {
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    height: captchaHeight + 2,
    marginTop: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  captcha: {
    width: 320 / x,
    height: captchaHeight,
  },
  submit: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.lightGrey,
    borderRadius: 4,
    marginTop: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
  },
});

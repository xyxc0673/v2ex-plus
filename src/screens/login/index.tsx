import { Logo } from '@/components/atoms';
import { config } from '@/config';
import {
  do2fa,
  fetchLoginParams,
  loginByUsername,
} from '@/store/reducers/user';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { Alert } from '@/utils';
import { screenWidth } from '@/utils/adapter';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Image,
  Modal,
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
  const [a2faCaptcha, set2faCaptcha] = useState('');
  const [is2faModalVisible, set2faModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const loginParams = useAppSelector((state) => state.user.loginParams);
  const is2faRequired = useAppSelector((state) => state.user.is2faRequired);
  const once = useAppSelector((state) => state.user.once);

  const getLoginParams = useCallback(() => {
    dispatch(fetchLoginParams());
  }, [dispatch]);

  useEffect(() => {
    getLoginParams();
  }, [getLoginParams]);

  const handleSubmit = () => {
    if (username === '' || password === '' || captcha === '') {
      Alert.alert({ message: '请检查输入信息' });
      return;
    }
    dispatch(loginByUsername({ username, password, captcha, loginParams }));
  };

  const handle2faSubmit = () => {
    if (a2faCaptcha === '') {
      Alert.alert({ message: '请检查输入信息' });
      return;
    }
    dispatch(do2fa({ captcha: a2faCaptcha, once }));
  };

  useEffect(() => {
    if (is2faRequired) {
      set2faModalVisible(true);
    }
  }, [is2faRequired]);

  return (
    <View style={[Layout.fill, styles.container]}>
      <Modal visible={is2faModalVisible} transparent>
        <View style={styles.modal}>
          <View style={styles.faContainer}>
            <Text style={styles.faTip}>
              你的 V2EX 账号已经开启了两步验证，请输入验证码继续
            </Text>
            <View style={styles.faInputWrapper}>
              <Text style={styles.faInputLabel}>验证码</Text>
              <TextInput
                style={styles.faInput}
                onChangeText={(text) => set2faCaptcha(text)}
              />
            </View>
            <TouchableOpacity
              style={[styles.submit, styles.submit2fa]}
              onPress={handle2faSubmit}>
              <Text style={styles.submitText}>确认</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
          <TouchableOpacity onPress={getLoginParams}>
            <Image
              style={styles.captcha}
              source={{
                uri: `${config.V2EX_BASE_URL}_captcha?once=${loginParams.once}`,
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
  modal: {
    flex: 1,
    backgroundColor: Colors.modalBackground,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  faContainer: {
    marginTop: -150,
    width: screenWidth - 32,
    backgroundColor: Colors.white,
    padding: 24,
    paddingVertical: 32,
    borderRadius: 8,

    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  faTip: {
    marginBottom: 24,
  },
  faInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faInputLabel: {
    marginRight: 16,
    fontSize: 22,
  },
  faInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
  },
  submit2fa: {
    marginTop: 36,
  },
});

import { IUser } from '@/interfaces/user';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface IProps {
  data: IUser;
}

const Information = ({ data: profile }: IProps) => {
  return (
    <>
      {profile.tagLine !== '' && (
        <View style={styles.block}>
          <Text style={styles.tagLine}>{profile.tagLine}</Text>
        </View>
      )}
      <View style={styles.block}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoBlockTitle}>会员编号</Text>
          <Text style={styles.infoBlockValue}>{profile.id}</Text>
        </View>
        <View style={[styles.infoBlock, styles.infoBlockBotom]}>
          <Text style={styles.infoBlockTitle}>加入时间</Text>
          <Text style={styles.infoBlockValue}>{profile.createdAt}</Text>
        </View>
      </View>

      {profile.company !== '' && (
        <View style={styles.block}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>公司</Text>
            <Text style={styles.infoBlockValue}>{profile.company}</Text>
          </View>
          <View style={[styles.infoBlock, styles.infoBlockBotom]}>
            <Text style={styles.infoBlockTitle}>头衔</Text>
            <Text style={styles.infoBlockValue}>{profile.workTitle}</Text>
          </View>
        </View>
      )}

      <View style={styles.block}>
        <Text style={styles.infoBlockTitle}>社交信息</Text>
        {profile.socialList.length === 0 && (
          <Text style={styles.infoBlockValue}>空空如也</Text>
        )}

        {profile.socialList.map((item) => {
          return (
            <>
              <TouchableOpacity
                key={item.id}
                style={[Layout.row, styles.socialItem]}
                onPress={() => Linking.openURL(item.url)}>
                <Image style={styles.socialIcon} source={{ uri: item.icon }} />
                <Text style={styles.socialTitle}>{item.name}</Text>
              </TouchableOpacity>
            </>
          );
        })}
      </View>
    </>
  );
};

export default React.memo(Information);

const styles = StyleSheet.create({
  block: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  infoBlock: {
    marginBottom: 16,
  },
  infoBlockBotom: {
    marginBottom: 0,
  },
  infoBlockTitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    opacity: 0.5,
  },
  infoBlockValue: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.secondaryText,
  },
  tagLine: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  socialItem: {
    alignItems: 'center',
    marginTop: 14,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  socialTitle: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.secondaryText,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.lightGrey,
    marginTop: 8,
  },
});

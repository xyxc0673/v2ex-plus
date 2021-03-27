import { Avatar, Header } from '@/components';
import { navigate } from '@/navigations/root';
import { Colors } from '@/theme/colors';
import Images from '@/theme/images';
import Layout from '@/theme/layout';
import { useAppSelector } from '@/utils/hooks';
import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const TabbarMe = () => {
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const balance = useAppSelector((state) => state.user.balance);
  const user = useAppSelector((state) => state.user.user);
  const historyList = useAppSelector((state) => state.history.list);

  return (
    <View>
      <Header />
      <View style={[Layout.fill, styles.container]}>
        <TouchableOpacity
          style={[Layout.fullWidth, Layout.row, styles.userBox]}
          onPress={() => !isLogged && navigate('login', {})}>
          <Avatar
            source={user.avatar ? { uri: user.avatar } : Images.profile}
            size={60}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username || '立即登录'}</Text>
            <View style={Layout.row}>
              {isLogged && (
                <View style={styles.balance}>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceItemText}>{balance.gold}</Text>
                    <Image
                      style={styles.balanceItemIcon}
                      source={Images.gold}
                    />
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceItemText}>{balance.silver}</Text>
                    <Image
                      style={styles.balanceItemIcon}
                      source={Images.silver}
                    />
                  </View>
                  <View style={styles.balanceItem}>
                    <Text style={styles.balanceItemText}>{balance.bronze}</Text>
                    <Image
                      style={styles.balanceItemIcon}
                      source={Images.bronze}
                    />
                  </View>
                </View>
              )}
            </View>
            {!isLogged && (
              <Text style={styles.loginTip}>登录 V2EX，体验更多功能</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem}>
            <Text style={styles.gridItemValue}>0</Text>
            <Text style={styles.gridItemTitle}>关注的人</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <Text style={styles.gridItemValue}>0</Text>
            <Text style={styles.gridItemTitle}>收藏主题</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigate('history', {})}>
            <Text style={styles.gridItemValue}>{historyList.length}</Text>
            <Text style={styles.gridItemTitle}>已读主题</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.list}>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemText}>应用设置</Text>
            <Image
              style={styles.listItemArrow}
              source={Images.arrowRightGrey}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemText}>主题外观</Text>
            <Image
              style={styles.listItemArrow}
              source={Images.arrowRightGrey}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemText}>建议与反馈</Text>
            <Image
              style={styles.listItemArrow}
              source={Images.arrowRightGrey}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemText}>关于应用</Text>
            <Image
              style={styles.listItemArrow}
              source={Images.arrowRightGrey}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TabbarMe;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGrey,
  },
  userBox: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loginTip: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  balance: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGrey,
    borderRadius: 4,
    paddingLeft: 8,
    paddingRight: 4,
    paddingVertical: 2,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  balanceItemText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.secondaryText,
  },
  balanceItemIcon: {
    width: 12,
    height: 12,
    marginLeft: 2,
  },
  grid: {
    marginTop: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  gridItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  gridItemValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridItemTitle: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  list: {
    marginTop: 8,
    backgroundColor: Colors.white,
  },
  listItem: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
  },
  listItemArrow: {
    width: 16,
    height: 16,
  },
});

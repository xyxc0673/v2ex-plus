import { Avatar } from '@/components';
import { CONSTANTS } from '@/config';
import { ROUTES } from '@/config/route';
import { navigate } from '@/navigations/root';
import { dailyMission } from '@/store/reducers/user';
import { Colors } from '@/theme/colors';
import Images from '@/theme/images';
import Layout from '@/theme/layout';
import { useAppSelector } from '@/utils/hooks';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from 'react-redux';

const TabbarMe = () => {
  const dispatch = useDispatch();
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const balance = useAppSelector((state) => state.user.balance);
  const user = useAppSelector((state) => state.user.user);
  const historyList = useAppSelector((state) => state.history.list);
  const myFollowingCount = useAppSelector(
    (state) => state.user.myFollowingCount,
  );
  const myFavTopicCount = useAppSelector((state) => state.user.myFavTopicCount);
  const isSigned = useAppSelector((state) => state.user.isSigned);
  const signDays = useAppSelector((state) => state.user.signDays);
  const signDate = useAppSelector((state) => state.user.signDate);

  const [isSignedToday, setIsSignedToday] = useState(false);

  useEffect(() => {
    setIsSignedToday(
      isSigned && signDate === dayjs().format(CONSTANTS.SIGN_DATE_FORMAT),
    );
  }, [isSigned, signDate]);

  return (
    <View>
      <View style={[Layout.fill, styles.container]}>
        <TouchableOpacity
          style={[Layout.fullWidth, Layout.row, styles.userBox]}
          onPress={() => !isLogged && navigate(ROUTES.LOGIN, {})}>
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
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => isLogged && navigate(ROUTES.FOLLOW, {})}>
            <Text style={styles.gridItemValue}>
              {isLogged ? isLogged && myFollowingCount : '-'}
            </Text>
            <Text style={styles.gridItemTitle}>关注的人</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => isLogged && navigate(ROUTES.FAV_TOPIC, {})}>
            <Text style={styles.gridItemValue}>
              {isLogged ? myFavTopicCount : '-'}
            </Text>
            <Text style={styles.gridItemTitle}>收藏主题</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigate(ROUTES.HISTORY, {})}>
            <Text style={styles.gridItemValue}>{historyList.length}</Text>
            <Text style={styles.gridItemTitle}>已读主题</Text>
          </TouchableOpacity>
        </View>
        {isLogged && (
          <View style={styles.list}>
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => !isSignedToday && dispatch(dailyMission(true))}>
              <Text style={styles.listItemText}>
                {isSignedToday ? '今日已签到' : '立即签到'}
              </Text>
              <Text style={styles.listItemRightText}>
                连续签到 {signDays} 天
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              navigate(ROUTES.ABOUT, null);
            }}>
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
  listItemRightText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  listItemArrow: {
    width: 16,
    height: 16,
  },
});

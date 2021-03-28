import { IHistory } from '@/interfaces/history';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import dayjs from 'dayjs';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  TouchableOpacity,
  SectionList,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import Record from './components/record';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Colors } from '@/theme/colors';
import { useNavigation } from '@react-navigation/core';
import { historyActions } from '@/store/reducers/history';
import Common from '@/theme/common';
import updateLocale from 'dayjs/plugin/updateLocale';
dayjs.extend(updateLocale);

dayjs.extend(localizedFormat);
dayjs.updateLocale('zh-cn', {
  formats: {
    L: 'M月D日',
    LL: 'YYYY年M月D日',
  },
});

interface IGroupMap {
  [date: string]: Array<IHistory>;
}

interface IGroupSection {
  title: string;
  data: Array<IHistory>;
}

const History = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.history.list);
  const [groups, setGroups] = useState<Array<IGroupSection>>([]);

  useLayoutEffect(() => {
    let headerRight = null;

    if (list.length > 0) {
      headerRight = () => (
        <TouchableOpacity
          style={Common.headerRight}
          onPress={() => {
            Alert.alert('提示', '确认清空历史记录吗？', [
              {
                text: '确认',
                onPress: () => dispatch(historyActions.clear({})),
                style: 'default',
              },
              {
                text: '取消',
                style: 'cancel',
              },
            ]);
          }}>
          <Text style={Common.headerRightText}>清空</Text>
        </TouchableOpacity>
      );
    }

    navigation.setOptions({
      headerRight: headerRight,
    });
  }, [list, dispatch, navigation]);

  // group items in an array by date
  useEffect(() => {
    const group: IGroupMap = {};
    const today = dayjs().format('YYYY-MM-DD');

    list.forEach((item) => {
      const date = dayjs(item.recordedAt).format('YYYY-MM-DD');

      if (!group[date]) {
        group[date] = [];
      }

      group[date].push(item);
    });

    const _groups = Object.keys(group).map((key) => {
      // replace with 'Today' if formated date is equal with today
      const date = today === key ? '今天' : dayjs(key).format('L');

      return {
        title: date,
        data: group[key],
      };
    });

    setGroups(_groups);
  }, [list]);

  return (
    <View style={styles.container}>
      <SectionList
        sections={groups}
        renderItem={({ item }) => <Record item={item} />}
        keyExtractor={(item) => `history_${item.id}`}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        contentContainerStyle={styles.sectionContainer}
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGrey,
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 16,
  },
});

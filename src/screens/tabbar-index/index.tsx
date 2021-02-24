import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Header } from '@/components';
import { fetchHottestTopic } from '@/store/reducers/topic';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import images from '@/theme/images';
import { colors } from '@/theme/colors';
import dayjs from 'dayjs';

const TabbarIndex = () => {
  const dispatch = useAppDispatch();
  const topicList = useAppSelector((state) => state.topicReducer.topicList);

  useEffect(() => {
    dispatch(fetchHottestTopic());
  }, [dispatch]);
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.topicList}>
        {topicList.map((topic) => {
          return (
            <TouchableOpacity key={topic.id} style={styles.topicItem}>
              <View style={styles.topicTop}>
                <View style={styles.topicTopLeft}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: topic.member.avatar_normal }}
                  />
                  <View style={styles.topicInfo}>
                    <Text>{topic.member.username}</Text>
                    <View style={styles.topicInfoBottom}>
                      <Text style={styles.node}>{topic.node.title}</Text>
                      <View style={styles.topicAttr}>
                        <Image
                          style={styles.topicAttrIcon}
                          source={images.timeCycleGrey}
                        />
                        <Text style={styles.topicAttrText}>
                          {dayjs.unix(topic.created).fromNow()}
                        </Text>
                      </View>
                      <View style={styles.topicAttr}>
                        <Image
                          style={styles.topicAttrIcon}
                          source={images.moreCycleGrey}
                        />
                        <Text style={styles.topicAttrText}>
                          {topic.replies}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TabbarIndex;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  topicList: {
    marginHorizontal: 16,
    marginBottom: 45,
  },
  topicItem: {
    marginVertical: 12,
  },
  topicTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicTopLeft: {
    flexDirection: 'row',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 36,
  },
  topicInfo: {
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 12,
  },
  topicInfoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replies: {
    fontSize: 8,
  },
  topicTitle: {
    fontSize: 14,
    marginTop: 8,
  },
  node: {
    fontSize: 10,
    paddingVertical: 1,
    paddingHorizontal: 8,
    backgroundColor: colors.lightGrey,
    borderRadius: 4,
    color: colors.secondaryText,
  },
  topicAttr: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  topicAttrIcon: {
    width: 12,
    height: 12,
  },
  topicAttrText: {
    fontSize: 10,
    color: colors.secondaryText,
    marginLeft: 2,
  },
});

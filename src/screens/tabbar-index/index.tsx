import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Avatar, Header } from '@/components';
import { fetchHottestTopic } from '@/store/reducers/topic';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import Images from '@/theme/images';
import { Colors } from '@/theme/colors';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import Common from '@/theme/common';

const TabbarIndex = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const topicList = useAppSelector((state) => state.topic.topicList);

  useEffect(() => {
    dispatch(fetchHottestTopic());
  }, [dispatch]);

  const openTopic = (topicId: number, title: string) => {
    navigation.navigate('topic', { topicId, title });
  };

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        contentContainerStyle={styles.topicList}
        data={topicList}
        renderItem={({ item: topic }) => {
          return (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicItem}
              onPress={() => openTopic(topic.id, topic.title)}>
              <View style={styles.topicTop}>
                <View style={styles.topicTopLeft}>
                  <Avatar
                    userId={topic.member.id}
                    size={32}
                    source={{ uri: topic.member.avatar_normal }}
                  />
                  <View style={styles.topicInfo}>
                    <Text>{topic.member.username}</Text>
                    <View style={styles.topicInfoBottom}>
                      <Text style={[Common.node, Common.nodeSmall]}>
                        {topic.node.title}
                      </Text>
                      <View style={styles.topicAttr}>
                        <Image
                          style={styles.topicAttrIcon}
                          source={Images.timeCycleGrey}
                        />
                        <Text style={styles.topicAttrText}>
                          {dayjs.unix(topic.created).fromNow()}
                        </Text>
                      </View>
                      <View style={styles.topicAttr}>
                        <Image
                          style={styles.topicAttrIcon}
                          source={Images.moreCycleGrey}
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
        }}
      />
    </View>
  );
};

export default TabbarIndex;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
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
  topicInfo: {
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  topicInfoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicTitle: {
    fontSize: 16,
    marginTop: 8,
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
    color: Colors.secondaryText,
    marginLeft: 2,
  },
});

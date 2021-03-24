import { fetchTopicDetails } from '@/store/reducers/topic';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import HTML from 'react-native-render-html';

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components';
import Reply from './components/reply';
import { ITopic } from '@/interfaces/topic';

type ParamList = {
  Detail: {
    topic: ITopic;
  };
};

const Topic = () => {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();

  const dispatch = useAppDispatch();
  const topicDetails = useAppSelector((state) => state.topic.currentTopic);
  const replyList = useAppSelector((state) => state.topic.replyList);

  const currentTopic = { ...route.params.topic, ...topicDetails };

  useEffect(() => {
    const { topic } = route.params;
    dispatch(
      fetchTopicDetails({
        topicId: topic.id,
        page: 1,
      }),
    );
  }, [dispatch, route.params]);

  const renderHeader = React.useMemo(() => {
    if (!currentTopic.id) {
      return <View />;
    }
    return (
      <>
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{currentTopic.title}</Text>
          </View>
        </View>
        <View style={styles.postInfo}>
          <Avatar
            username={currentTopic.author}
            size={24}
            source={{ uri: currentTopic.avatar }}
          />
          <Text style={styles.topicAuthor}>{currentTopic.author}</Text>
          <Text style={styles.topicDesc}>
            {currentTopic.createdAt && dayjs(currentTopic.createdAt).fromNow()}
          </Text>
          {currentTopic.views && (
            <Text
              style={styles.topicDesc}>{`${currentTopic.views}次访问`}</Text>
          )}
          <Text style={Common.node}>{currentTopic.nodeTitle}</Text>
        </View>
        <View style={Common.divider} />
        <HTML source={{ html: currentTopic.content || '<p></p>' }} />
        <View style={Common.divider} />
        <Text style={styles.replyCount}>
          {`回复 ${currentTopic.replyCount || 0}`}
        </Text>
        <View style={Common.divider} />
      </>
    );
  }, [currentTopic]);

  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled
        data={replyList}
        keyExtractor={(item) => `reply_${item.no}`}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.replyList}
        renderItem={({ item }) => <Reply item={item} />}
      />
    </View>
  );
};

export default Topic;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
  },
  postInfo: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicAuthor: {
    marginHorizontal: 8,
    fontSize: 14,
    color: Colors.black,
  },
  topicDesc: {
    marginRight: 8,
    fontSize: 12,
    color: Colors.secondaryText,
  },
  replyCount: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 40,
  },
  replyList: {
    padding: 12,
  },
});

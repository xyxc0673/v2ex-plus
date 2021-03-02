import { fetchRepliesById, fetchTopicById } from '@/store/reducers/topic';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import Markdown from 'react-native-markdown-display';

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components';
import Reply from './components/reply';

type ParamList = {
  Detail: {
    topicId: number;
    title: string;
  };
};

const Topic = () => {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();

  const dispatch = useAppDispatch();
  const currentTopic = useAppSelector((state) => state.topic.currentTopic);
  const replyList = useAppSelector((state) => state.topic.replyList);

  useEffect(() => {
    const { topicId } = route.params;
    dispatch(fetchTopicById(topicId));
    dispatch(fetchRepliesById(topicId));
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
            user={currentTopic.member}
            size={24}
            source={{ uri: currentTopic.member?.avatar_normal }}
          />
          <Text style={styles.topicAuthor}>
            {currentTopic.member?.username}
          </Text>
          <Text style={styles.topicDesc}>
            {currentTopic.created && dayjs.unix(currentTopic.created).fromNow()}
          </Text>
          <Text style={Common.node}>{currentTopic.node?.title}</Text>
        </View>
        <View style={Common.divider} />
        <Markdown>{currentTopic.content}</Markdown>
        <View style={Common.divider} />
        <Text style={styles.replyCount}>
          {`回复 ${currentTopic.replies || 0}`}
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
        keyExtractor={(item) => `reply_${item.id}`}
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
    marginLeft: 8,
    fontSize: 14,
    color: Colors.black,
  },
  topicDesc: {
    marginHorizontal: 8,
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

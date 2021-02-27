import { fetchRepliesById, fetchTopicById } from '@/store/reducers/topic';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Images from '@/theme/images';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import Markdown from 'react-native-markdown-display';

import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from '@/components';

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

  console.log('currentTopic', currentTopic);
  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{currentTopic.title}</Text>
        </View>
      </View>
      <View style={styles.postInfo}>
        <Avatar
          user={currentTopic.member}
          size={24}
          source={{ uri: currentTopic.member.avatar_normal }}
        />
        <Text style={styles.topicAuthor}>{currentTopic.member?.username}</Text>
        <Text style={styles.topicDesc}>
          {currentTopic.created && dayjs.unix(currentTopic.created).fromNow()}
        </Text>
        <Text style={Common.node}>{currentTopic.node?.title}</Text>
      </View>
      <View style={styles.divider} />
      <Markdown>{currentTopic.content}</Markdown>
      <View style={styles.divider} />

      <View style={styles.replyContainer}>
        <Text style={styles.replyCount}>
          {`回复 ${currentTopic.replies || 0}`}
        </Text>
        <View style={styles.divider} />
        <View style={styles.replyList}>
          <FlatList
            nestedScrollEnabled
            data={replyList}
            renderItem={({ item: reply, index }) => {
              return (
                <View key={`${reply.id}`} style={styles.reply}>
                  <View style={styles.replyHeader}>
                    <Avatar
                      user={reply.member}
                      size={36}
                      source={{ uri: reply.member.avatar_large }}
                    />
                    <View style={styles.replyHeaderLeft}>
                      <View style={styles.replyHeaderLeftInfo}>
                        <View>
                          <Text>{reply.member.username}</Text>
                          <Text style={styles.replyCreated}>
                            {dayjs.unix(reply.created).fromNow()}
                          </Text>
                        </View>
                        <Text style={styles.replyIndex}>{`#${index}`}</Text>
                      </View>
                      <Markdown>{reply.content}</Markdown>
                    </View>
                  </View>
                  <View style={styles.replyOpt}>
                    <TouchableOpacity style={styles.replyOptBtn}>
                      <Image
                        style={styles.replyOptBtnIcon}
                        source={Images.heartGrey}
                      />
                      <Text style={styles.replyThanksNumber}>2</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider} />
                </View>
              );
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Topic;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: Colors.white,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 14,
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
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.lightGrey,
    marginVertical: 8,
  },
  replyContainer: {
    marginTop: 40,
  },
  replyCount: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  replyList: {
    width: '100%',
  },
  reply: {},
  replyHeader: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  replyHeaderLeft: {
    flex: 1,
    marginLeft: 8,
  },
  replyHeaderLeftInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  replyCreated: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  replyIndex: {
    fontSize: 12,
    color: Colors.thirdText,
  },
  replyOpt: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  replyOptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyOptBtnIcon: {
    width: 16,
    height: 16,
    marginLeft: 16,
  },
  replyThanksNumber: {
    fontSize: 14,
    marginLeft: 4,
    color: Colors.secondaryText,
  },
});

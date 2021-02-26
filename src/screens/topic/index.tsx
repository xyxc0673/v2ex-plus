import { fetchRepliesById, fetchTopicById } from '@/store/reducers/topic';
import { colors } from '@/theme/colors';
import Common from '@/theme/common';
import images from '@/theme/images';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ParamList = {
  Detail: {
    topicId: number;
    title: string;
  };
};

const Topic = () => {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();

  const dispatch = useAppDispatch();
  const currentTopic = useAppSelector(
    (state) => state.topicReducer.currentTopic,
  );
  const replyList = useAppSelector((state) => state.topicReducer.replyList);

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
        <Image
          style={styles.avatarPoster}
          source={{ uri: currentTopic.member?.avatar_normal }}
        />
        <Text style={styles.topicAuthor}>{currentTopic.member?.username}</Text>
        <Text style={styles.topicDesc}>
          {currentTopic.created && dayjs.unix(currentTopic.created).fromNow()}
        </Text>
        <Text style={Common.node}>{currentTopic.node?.title}</Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.content}>{currentTopic.content}</Text>
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
                    <Image
                      style={styles.avatarReply}
                      source={{ uri: reply.member.avatar_normal }}
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
                      <Text style={styles.replyContent}>{reply.content}</Text>
                    </View>
                  </View>
                  <View style={styles.replyOpt}>
                    <TouchableOpacity style={styles.replyOptBtn}>
                      <Image
                        style={styles.replyOptBtnIcon}
                        source={images.heartGrey}
                      />
                      {/* <Text style={styles.replyThanksNumber}>2</Text> */}
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
    backgroundColor: colors.white,
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
  avatarPoster: {
    width: 24,
    height: 24,
    borderRadius: 24,
  },
  topicAuthor: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.black,
  },
  topicDesc: {
    marginHorizontal: 8,
    fontSize: 12,
    color: colors.secondaryText,
  },
  content: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.lightGrey,
    marginVertical: 8,
  },
  replyContainer: {
    marginTop: 40,
  },
  replyCount: {
    fontSize: 14,
    color: colors.secondaryText,
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
  avatarReply: {
    width: 36,
    height: 36,
    borderRadius: 36,
  },
  replyAuthor: {
    fontSize: 14,
  },
  replyCreated: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  replyContent: {
    marginTop: 8,
    lineHeight: 24,
  },
  replyIndex: {
    fontSize: 12,
    color: colors.thirdText,
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
    color: colors.secondaryText,
  },
});

import {
  fetchTopicDetails,
  replyTopic,
  thanksReplyById,
  topicActions,
} from '@/store/reducers/topic';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import HTML from 'react-native-render-html';

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, LoadingModal } from '@/components';
import Reply from './components/reply';
import { ITopic } from '@/interfaces/topic';
import Layout from '@/theme/layout';
import { Alert } from '@/utils';
import Images from '@/theme/images';

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
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const replyContent = useAppSelector((state) => state.topic.replyContent);
  const isReplying = useAppSelector((state) => state.topic.isReplying);

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

  const [contentHeight, setContentHeight] = useState(42);

  useEffect(() => {
    // reset content height
    if (replyContent === '') {
      setContentHeight(42);
    }
  }, [replyContent]);

  const handleReply = useCallback(() => {
    dispatch(replyTopic({ topicId: topicDetails.id }));
  }, [dispatch, topicDetails]);

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
          {currentTopic.views !== undefined && (
            <Text
              style={styles.topicDesc}>{`${currentTopic.views}次访问`}</Text>
          )}
          <Text style={Common.node}>{currentTopic.nodeTitle}</Text>
        </View>
        <View style={Common.divider} />

        <HTML source={{ html: currentTopic.content || '<p></p>' }} />
        {currentTopic.supplementList && (
          <View style={styles.supplementList}>
            {currentTopic.supplementList?.map((supplement, index) => (
              <>
                <View
                  style={styles.supplement}
                  key={`topic-${currentTopic.id}-supplement-${index}`}>
                  <View style={[styles.supplementHeader, Layout.row]}>
                    <Text style={styles.supplementInfo}>
                      {`附言 ${index + 1} · ${dayjs(
                        supplement.createdAt,
                      ).fromNow()}`}
                    </Text>
                  </View>
                  <HTML source={{ html: supplement.content || '<p></p>' }} />
                </View>
              </>
            ))}
          </View>
        )}
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
      <LoadingModal visible={isReplying} />

      <FlatList
        nestedScrollEnabled
        data={replyList}
        keyExtractor={(item) => `reply_${item.id}`}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.replyList}
        renderItem={({ item, index }) => (
          <Reply
            item={item}
            topicAuthor={topicDetails.author}
            onThanks={() =>
              Alert.confirm({
                message: `确认花费 10 个铜币向 @${item.author} 的这条回复发送感谢？`,
                onConfirm: () =>
                  dispatch(thanksReplyById({ replyId: item.id, index })),
              })
            }
          />
        )}
      />
      {isLogged && (
        <View style={[Layout.row, styles.bottomBar]}>
          <TextInput
            style={[styles.input, { height: contentHeight }]}
            placeholder="请尽量让自己的回复能够对别人有帮助"
            multiline
            value={replyContent}
            onChangeText={(value) =>
              dispatch(topicActions.setReplyContent(value))
            }
            onContentSizeChange={(e) => {
              setContentHeight(e.nativeEvent.contentSize.height);
            }}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleReply}>
            <Image source={Images.send} />
          </TouchableOpacity>
        </View>
      )}
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
  supplementList: {
    marginTop: 8,
    backgroundColor: Colors.grey10,
    borderRadius: 4,
  },
  supplement: {
    padding: 8,
  },
  supplementHeader: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  supplementInfo: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  bottomBar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: Colors.white,
    alignItems: 'center',

    shadowColor: Colors.vi,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
});

import {
  favouriteTopic,
  fetchTopicDetails,
  replyTopic,
  thanksReplyById,
  topicActions,
  unfavouriteTopic,
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
import { IReply } from '@/interfaces/reply';
import { RelatedReply } from './components';
import { bottomSheetRef } from './components/related-reply';

type ParamList = {
  Detail: {
    topic: ITopic;
  };
};

const Topic = () => {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const topicDetails = useAppSelector((state) => state.topic.currentTopic);
  const replyList = useAppSelector((state) => state.topic.replyList);
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const replyContent = useAppSelector((state) => state.topic.replyContent);
  const showLoadingModal = useAppSelector(
    (state) => state.topic.showLoadingModal,
  );
  const maxPage = useAppSelector((state) => state.topic.maxPage);
  const currPage = useAppSelector((state) => state.topic.currPage);
  const relatedReplyList = useAppSelector(
    (state) => state.topic.relatedReplyList,
  );

  const [currentTopic, setCurrentTopic] = useState<ITopic>({} as ITopic);
  const [noMore, setNoMore] = useState(false);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(true);

  useEffect(() => {
    setCurrentTopic({ ...route.params.topic, ...topicDetails });
  }, [route, topicDetails]);

  useEffect(() => {
    setNoMore(currPage >= (maxPage || 1));
  }, [maxPage, currPage]);

  useEffect(() => {
    const { topic } = route.params;

    dispatch(
      fetchTopicDetails({
        topicId: topic.id,
      }),
    );

    return () => {
      dispatch(topicActions.resetTopic());
    };
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

  // 关闭相关回复弹窗时，清除数据
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === 0) {
        setIsModalOpen(false);
        dispatch(topicActions.resetRelatedReplys());
      }
    },
    [dispatch],
  );

  const handleLike = () => {
    if (currentTopic.isCollect) {
      dispatch(unfavouriteTopic(null));
    } else {
      dispatch(favouriteTopic(null));
    }
  };

  const renderHeader = React.useMemo(() => {
    if (!currentTopic.id) {
      return <View />;
    }
    return (
      <>
        <LoadingModal visible={showLoadingModal} />

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
  }, [showLoadingModal, currentTopic]);

  const ListFooterComponent = React.useMemo(() => {
    return (
      <>
        <View style={styles.listFooter}>
          <Text style={styles.listFooterText}>
            {noMore ? '没有更多的回复了' : '加载中'}
          </Text>
        </View>
      </>
    );
  }, [noMore]);

  const renderReply = (item: IReply, index: number) => {
    return (
      <Reply
        key={item.id}
        item={item}
        topicAuthor={topicDetails.author}
        onThanks={() =>
          Alert.confirm({
            message: `确认花费 10 个铜币向 @${item.author} 的这条回复发送感谢？`,
            onConfirm: () =>
              dispatch(thanksReplyById({ replyId: item.id, index })),
          })
        }
        onMentionedPress={(mentionedUsername) => {
          if (isModalOpen) {
            return;
          }
          bottomSheetRef.current?.snapTo(1);
          dispatch(topicActions.getRelatedReplys({ index, mentionedUsername }));
          setIsModalOpen(true);
        }}
      />
    );
  };

  return (
    <>
      <FlatList
        nestedScrollEnabled
        data={replyList}
        keyExtractor={(item) => `reply_${item.id}`}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.replyList}
        renderItem={({ item, index }) => renderReply(item, index)}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum) {
            setOnEndReachedCalledDuringMomentum(true);
            if (currPage < (maxPage || 1)) {
              dispatch(
                fetchTopicDetails({
                  topicId: topicDetails.id,
                }),
              );
            }
          }
        }}
        onEndReachedThreshold={noMore ? null : 0.01}
        ListFooterComponent={() => ListFooterComponent}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
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
          <TouchableOpacity
            style={[styles.sendButton, Layout.row]}
            onPress={handleLike}>
            <Image
              source={
                currentTopic.isCollect ? Images.starFilled : Images.starOutline
              }
            />
            {currentTopic.likes! > 0 && (
              <Text style={styles.likeText}>{currentTopic.likes}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <RelatedReply
        data={relatedReplyList}
        renderReply={renderReply}
        onChange={handleSheetChanges}
      />
    </>
  );
};

export default Topic;

const styles = StyleSheet.create({
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
    backgroundColor: Colors.white,
    flexGrow: 1,
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
    borderTopColor: Colors.lightGrey,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
    padding: 8,
  },
  sendButton: {
    marginLeft: 16,
    alignItems: 'center',
  },
  likeText: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginLeft: 4,
  },
  listFooter: {
    marginVertical: 16,
    marginBottom: 30,
    alignItems: 'center',
  },
  listFooterText: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
});

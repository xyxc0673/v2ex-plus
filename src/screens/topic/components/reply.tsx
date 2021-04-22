import { Avatar } from '@/components';
import { IReply } from '@/interfaces/reply';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Images from '@/theme/images';
import Layout from '@/theme/layout';
import dayjs from 'dayjs';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HTML from 'react-native-render-html';

interface IProps {
  item: IReply;
  onThanks: () => void;
  topicAuthor: string;
  onMentionedPress: (username: string) => void;
}

const Reply = ({
  item: reply,
  onThanks,
  topicAuthor,
  onMentionedPress,
}: IProps) => {
  return (
    <View style={styles.reply}>
      <View style={styles.replyHeader}>
        <Avatar
          username={reply.author}
          size={36}
          source={{ uri: reply.avatar }}
        />
        <View style={styles.replyHeaderLeft}>
          <View style={styles.replyHeaderLeftInfo}>
            <View>
              <View style={[Layout.row, styles.authorWrapper]}>
                <Text>{reply.author}</Text>
                {reply.author === topicAuthor && (
                  <Text style={styles.isTopicAuthor}>楼主</Text>
                )}
              </View>
              <Text style={styles.replyCreated}>
                {dayjs(reply.createdAt).fromNow()}
              </Text>
            </View>
            <Text style={styles.replyIndex}>{`#${reply.no}`}</Text>
          </View>
          <HTML
            source={{ html: reply.content || '<p></p>' }}
            containerStyle={styles.content}
            onLinkPress={(event, href) => {
              if (href.slice(0, 8) === '/member/') {
                onMentionedPress && onMentionedPress(href.slice(8));
              }
            }}
          />
        </View>
      </View>
      <View style={styles.replyOpt}>
        <TouchableOpacity
          style={styles.replyOptBtn}
          onPress={() => (reply.author !== topicAuthor ? onThanks() : null)}>
          <Image
            style={styles.replyOptBtnIcon}
            source={reply.thanked ? Images.heartRed : Images.heartGrey}
          />
          <Text style={styles.replyThanksNumber}>{reply.thanks || ''}</Text>
        </TouchableOpacity>
      </View>
      <View style={Common.divider} />
    </View>
  );
};

export default React.memo(Reply);

const styles = StyleSheet.create({
  reply: {
    marginBottom: 8,
  },
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
    fontSize: 10,
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
    fontSize: 12,
    marginLeft: 4,
    color: Colors.secondaryText,
  },
  content: {
    marginTop: 8,
  },
  authorWrapper: {
    alignItems: 'center',
  },
  isTopicAuthor: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.white,
    backgroundColor: Colors.vi,
    marginLeft: 4,
  },
});

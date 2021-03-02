import { Avatar } from '@/components';
import { IReply } from '@/interfaces/reply';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Images from '@/theme/images';
import dayjs from 'dayjs';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface IProps {
  item: IReply;
}

const Reply = ({ item: reply }: IProps) => {
  return (
    <View style={styles.reply}>
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
            {/* <Text style={styles.replyIndex}>{`#${index}`}</Text> */}
          </View>
          <Markdown>{reply.content}</Markdown>
        </View>
      </View>
      <View style={styles.replyOpt}>
        <TouchableOpacity style={styles.replyOptBtn}>
          <Image style={styles.replyOptBtnIcon} source={Images.heartGrey} />
          {/* <Text style={styles.replyThanksNumber}>2</Text> */}
        </TouchableOpacity>
      </View>
      <View style={Common.divider} />
    </View>
  );
};

export default React.memo(Reply);

const styles = StyleSheet.create({
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
  //   replyIndex: {
  //     fontSize: 12,
  //     color: Colors.thirdText,
  //   },
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
  //   replyThanksNumber: {
  //     fontSize: 14,
  //     marginLeft: 4,
  //     color: Colors.secondaryText,
  //   },
});

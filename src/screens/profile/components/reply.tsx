import { IUserReply } from '@/interfaces/userReply';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HTML from 'react-native-render-html';

interface IProps {
  item: IUserReply;
}

const Reply = ({ item: reply }: IProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.reply}>
      <View style={[Layout.row, styles.replyInfo]}>
        <Text style={styles.replyTxt}>发表了评论</Text>
        <Text style={styles.replyTxt}>{reply.createdAt}</Text>
      </View>
      <HTML
        source={{ html: reply.content || '<p></p>' }}
        containerStyle={styles.content}
      />
      <TouchableOpacity
        style={styles.topic}
        onPress={() =>
          navigation.navigate('topic', { topicId: reply.topicId })
        }>
        <View style={[Layout.row, styles.topicInfo]}>
          <Text style={styles.topicAuthor}>{reply.author}</Text>
          <Text style={styles.nodeTitle}>{reply.nodeTitle}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.topicTitle}>{reply.topicTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(Reply);

const styles = StyleSheet.create({
  reply: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  replyInfo: {
    justifyContent: 'space-between',
  },
  replyTxt: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  content: {
    marginTop: 12,
    fontSize: 14,
  },
  topic: {
    marginTop: 12,
    backgroundColor: Colors.lightGrey,
    padding: 8,
    borderRadius: 4,
  },
  topicInfo: {
    justifyContent: 'space-between',
  },
  topicAuthor: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  nodeTitle: {
    fontSize: 12,
    marginLeft: 8,
    color: Colors.secondaryText,
  },
  divider: {
    marginVertical: 8,
    height: 1,
    width: '100%',
    backgroundColor: Colors.grey,
    opacity: 0.2,
  },
  topicTitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    flexWrap: 'wrap',
  },
});

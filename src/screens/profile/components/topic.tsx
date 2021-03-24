import { ITopic } from '@/interfaces/topic';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Images from '@/theme/images';
import Layout from '@/theme/layout';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
  item: ITopic;
}

const Topic = ({ item: topic }: IProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      key={`user_topic_${topic.id}`}
      style={styles.topic}
      onPress={() => navigation.navigate('topic', { topic: { id: topic.id } })}>
      <Text style={styles.topicTitle}>{topic.title}</Text>
      <View style={[Layout.row, styles.topicInfo]}>
        <Text style={Common.node}>{topic.nodeTitle}</Text>
        <View style={[Layout.row, styles.topicDesctem]}>
          <Image style={styles.topicDescIcon} source={Images.timeCycleGrey} />
          <Text style={styles.topicDescText}>
            {dayjs(topic.createdAt).fromNow()}
          </Text>
        </View>
        <View style={[Layout.row, styles.topicDesctem]}>
          <Image style={styles.topicDescIcon} source={Images.moreCycleGrey} />
          <Text style={styles.topicDescText}>{topic.replyCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(Topic);

const styles = StyleSheet.create({
  topic: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  topicTitle: {
    fontSize: 14,
  },
  topicInfo: {
    marginTop: 8,
  },
  topicDesctem: {
    marginLeft: 8,
    alignItems: 'center',
  },
  topicDescIcon: {
    width: 12,
    height: 12,
  },
  topicDescText: {
    fontSize: 12,
    marginLeft: 2,
    color: Colors.secondaryText,
  },
});

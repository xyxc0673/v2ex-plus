import { Avatar } from '@/components';
import { ITopic } from '@/interfaces/topic';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Images from '@/theme/images';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface IProps {
  item: ITopic;
  style?: StyleProp<ViewStyle>;
}

const Topic = ({ item: topic, style = {} }: IProps) => {
  const navigation = useNavigation();

  const openTopic = () => {
    navigation.navigate('topic', { topic });
  };

  return (
    <TouchableOpacity
      style={[styles.topicItem, style]}
      onPress={() => openTopic()}>
      <View style={styles.topicTop}>
        <View style={styles.topicTopLeft}>
          <Avatar
            username={topic.author}
            size={32}
            source={{ uri: topic.avatar }}
          />
          <View style={styles.topicInfo}>
            <Text>{topic.author}</Text>
            <View style={styles.topicInfoBottom}>
              {topic.nodeTitle !== '' && (
                <Text style={[Common.node, Common.nodeSmall, styles.node]}>
                  {topic.nodeTitle}
                </Text>
              )}
              <View style={styles.topicAttr}>
                <Image
                  style={styles.topicAttrIcon}
                  source={Images.timeCycleGrey}
                />
                <Text style={styles.topicAttrText}>
                  {dayjs(topic.lastReplyDatetime).fromNow()}
                </Text>
              </View>
              <View style={styles.topicAttr}>
                <Image
                  style={styles.topicAttrIcon}
                  source={Images.moreCycleGrey}
                />
                <Text style={styles.topicAttrText}>{topic.replyCount}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.topicTitle}>{topic.title}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(Topic);

const styles = StyleSheet.create({
  topicItem: {
    marginVertical: 12,
  },
  topicTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicTopLeft: {
    flexDirection: 'row',
  },
  topicInfo: {
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  topicInfoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicTitle: {
    fontSize: 16,
    marginTop: 8,
  },
  node: {
    marginRight: 8,
  },
  topicAttr: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  topicAttrIcon: {
    width: 12,
    height: 12,
  },
  topicAttrText: {
    fontSize: 10,
    color: Colors.secondaryText,
    marginLeft: 2,
  },
});

import { ROUTES } from '@/config/route';
import { IHistory } from '@/interfaces/history';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Layout from '@/theme/layout';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
  item: IHistory;
}

const RecordComponent = ({ item: topic }: IProps) => {
  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    navigation.navigate(ROUTES.TOPIC, { topic: { ...topic, createdAt: '' } });
  }, [topic, navigation]);

  return (
    <TouchableOpacity
      key={`user_topic_${topic.id}`}
      style={styles.topic}
      onPress={handlePress}>
      <Text style={styles.topicTitle}>{topic.title}</Text>
      <View style={[Layout.row, styles.topicInfo]}>
        <Text style={Common.node}>{topic.nodeTitle}</Text>
        <View style={[Layout.row, styles.topicDesctem]}>
          <Image style={styles.topicDescIcon} source={{ uri: topic.avatar }} />
          <Text style={styles.topicDescText}>{topic.author}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Record = React.memo(RecordComponent);

export default Record;

const styles = StyleSheet.create({
  topic: {
    padding: 12,
    marginVertical: 4,
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
    width: 16,
    height: 16,
    borderRadius: 16,
  },
  topicDescText: {
    fontSize: 14,
    marginLeft: 4,
    color: Colors.secondaryText,
  },
});

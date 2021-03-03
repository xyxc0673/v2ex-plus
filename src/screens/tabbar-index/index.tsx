import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Header } from '@/components';
import { fetchHottestTopic } from '@/store/reducers/topic';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';
import Topic from './components/topic';

const TabbarIndex = () => {
  const dispatch = useAppDispatch();
  const topicList = useAppSelector((state) => state.topic.topicList);

  useEffect(() => {
    dispatch(fetchHottestTopic());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        contentContainerStyle={styles.topicList}
        data={topicList}
        keyExtractor={(item) => `topic_${item.id}`}
        renderItem={({ item }) => <Topic item={item} />}
      />
    </View>
  );
};

export default TabbarIndex;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  topicList: {
    marginHorizontal: 16,
  },
});

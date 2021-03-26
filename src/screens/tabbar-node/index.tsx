import { Header } from '@/components';
import { fetchIndexNodes } from '@/store/reducers/node';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const TabbarNode = () => {
  const cateNodeList = useAppSelector((state) => state.node.cateNodeList);
  const disaptch = useAppDispatch();

  useEffect(() => {
    disaptch(fetchIndexNodes());
  }, [disaptch]);

  return (
    <View style={Layout.fill}>
      <Header />
      <ScrollView contentContainerStyle={[styles.container]}>
        {cateNodeList.map((group) => {
          return (
            <View key={group.category} style={styles.category}>
              <Text>{group.category}</Text>
              <View style={[Layout.row, styles.nodeList]}>
                {group.nodeList.map((node) => (
                  <TouchableOpacity key={node.name}>
                    <Text style={[Common.node, styles.node]}>{node.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TabbarNode;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  category: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  nodeList: {
    flexWrap: 'wrap',
    marginTop: 8,
  },
  node: {
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 4,
  },
});

import { ICateNodes } from '@/interfaces/node';
import { navigate } from '@/navigations/root';
import { fetchIndexNodes } from '@/store/reducers/node';
import { fetchMyNodes } from '@/store/reducers/user';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const TabbarNode = () => {
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const myNodeList = useAppSelector((state) => state.user.myNodeList);
  const cateNodeList = useAppSelector((state) => state.node.cateNodeList);
  const disaptch = useAppDispatch();

  useEffect(() => {
    if (isLogged) {
      disaptch(fetchMyNodes());
    }
    disaptch(fetchIndexNodes());
  }, [isLogged, disaptch]);

  const [allNodeList, setAllNodeList] = useState<Array<ICateNodes>>([]);

  useEffect(() => {
    setAllNodeList([
      { category: '我收藏的节点', nodeList: myNodeList },
      ...cateNodeList,
    ]);
  }, [myNodeList, cateNodeList]);

  return (
    <View style={Layout.fill}>
      <ScrollView contentContainerStyle={[styles.container]}>
        {allNodeList.map((group) => {
          return (
            group.nodeList.length > 0 && (
              <View key={group.category} style={styles.category}>
                <Text>{group.category}</Text>
                <View style={[Layout.row, styles.nodeList]}>
                  {group.nodeList.map((node) => (
                    <TouchableOpacity
                      key={node.name}
                      onPress={() =>
                        navigate('nodeTopic', {
                          nodeName: node.name,
                          nodeTitle: node.title,
                        })
                      }>
                      <Text style={[Common.node, styles.node]}>
                        {node.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )
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
    flexGrow: 1,
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

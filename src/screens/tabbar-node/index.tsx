import { navigate } from '@/navigations/root';
import { fetchIndexNodes } from '@/store/reducers/node';
import { fetchMyNodes } from '@/store/reducers/user';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
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

  const allNodeList = useMemo(
    () => [{ key: '我收藏的节点', data: [myNodeList] }, ...cateNodeList],
    [myNodeList, cateNodeList],
  );

  return (
    <SectionList
      sections={allNodeList}
      contentContainerStyle={styles.container}
      stickySectionHeadersEnabled
      renderItem={({ item: group }) => (
        <View style={[Layout.row, styles.nodeList]}>
          {group.map((node) => (
            <TouchableOpacity
              key={node.name}
              onPress={() =>
                navigate('nodeTopic', {
                  nodeName: node.name,
                  nodeTitle: node.title,
                })
              }>
              <Text style={[Common.node, styles.node]}>{node.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.key}</Text>
      )}
    />
  );
};

export default TabbarNode;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  nodeList: {
    flexWrap: 'wrap',
  },
  sectionHeader: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
  },
  node: {
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 4,
  },
});

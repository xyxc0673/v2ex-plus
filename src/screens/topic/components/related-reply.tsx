import { IReply } from '@/interfaces/reply';
import { Colors } from '@/theme/colors';
import React, { FunctionComponent, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

interface IProps {
  data?: Array<IReply>;
  renderReply: (item: IReply, index: number) => JSX.Element;
  onChange?: (index: number) => void;
}

export const bottomSheetRef = React.createRef<BottomSheet>();

const RelatedReply: FunctionComponent<IProps> = (props) => {
  const snapPoints = useMemo(() => [-100, '50%'], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={props.onChange}
      style={styles.sheetContainer}>
      <BottomSheetFlatList
        data={props.data}
        keyExtractor={(item) => `reply_${item.id}`}
        renderItem={({ item, index }) => props.renderReply(item, index)}
        contentContainerStyle={styles.modalContainer}
      />
    </BottomSheet>
  );
};

export default React.memo(RelatedReply);

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: Colors.white,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,

    shadowColor: Colors.secondaryText,
  },
  modalContainer: {
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
});

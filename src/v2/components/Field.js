import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import Icon from './Icon';

export default function Field({ icon, right, onRightPress, style, inputStyle, ...props }) {
  return (
    <View style={[styles.box, style]}>
      {icon ? <Icon name={icon} size={18} style={{ marginRight: 12 }} /> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, inputStyle]}
        {...props}
      />
      {right ? (
        <TouchableOpacity onPress={onRightPress} hitSlop={10}>
          <Icon name={right} size={18} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 10 },
});

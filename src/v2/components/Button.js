import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  right,
  left,
  loading,
  style,
  disabled,
  testID,
}) {
  const v = VARIANTS[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.base, v.box, disabled && { opacity: 0.6 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={v.text.color} />
      ) : (
        <>
          {left ? (
            <Text style={[styles.txt, v.text, { marginRight: 8 }]}>{left}</Text>
          ) : null}
          <Text style={[styles.txt, v.text]}>{title}</Text>
          {right ? (
            <Text style={[styles.txt, v.text, { marginLeft: 8 }]}>{right}</Text>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}

const VARIANTS = {
  primary: {
    box: { backgroundColor: colors.primary },
    text: { color: '#fff' },
  },
  outline: {
    box: {
      backgroundColor: '#fff',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    text: { color: colors.primary },
  },
  danger: {
    box: {
      backgroundColor: '#fff',
      borderWidth: 1.5,
      borderColor: colors.danger,
    },
    text: { color: colors.danger },
  },
  light: {
    box: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: { color: colors.text },
  },
};

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  txt: { fontSize: 16, fontWeight: '700' },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import Icon from './Icon';

export function Screen({ children, style, bg = colors.bg }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[{ flex: 1, backgroundColor: bg, paddingTop: insets.top }, style]}
    >
      {children}
    </View>
  );
}

export function Header({ title, onBack, right, onRight }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        testID="header-back"
        onPress={onBack}
        style={styles.side}
        hitSlop={10}
      >
        {onBack ? <Icon name="back" size={22} color={colors.text} /> : null}
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <TouchableOpacity
        onPress={onRight}
        style={[styles.side, { alignItems: 'flex-end' }]}
        hitSlop={10}
      >
        {right ? <Icon name={right} size={20} color={colors.text} /> : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  side: { width: 40 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
});

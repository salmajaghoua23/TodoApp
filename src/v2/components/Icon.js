import React from 'react';
import { Text } from 'react-native';

// Icônes basées sur des glyphes/emoji : aucune dépendance native à installer.
const GLYPHS = {
  home: '🏠', search: '🔍', calendar: '📅', profile: '👤', mail: '✉️', lock: '🔒',
  eye: '👁', eyeOff: '🙈', plus: '＋', back: '←', menu: '☰', bell: '🔔', flag: '🚩',
  check: '✓', trash: '🗑', edit: '✏️', dots: '⋮', chevron: '›', down: '⌄', settings: '⚙️',
  logout: '↪', info: 'ⓘ', list: '📋', star: '☆', clock: '🕒', trophy: '🏆', folder: '📁',
  pencil: '✍️', grid: '▦', rocket: '🚀', arrow: '→', user: '🙂',
};

export default function Icon({ name, size = 18, color, style }) {
  return <Text style={[{ fontSize: size, lineHeight: size + 6, color }, style]}>{GLYPHS[name] || '•'}</Text>;
}

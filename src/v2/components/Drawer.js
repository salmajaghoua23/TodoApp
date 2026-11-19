import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import Icon from './Icon';

const W = Math.min(Dimensions.get('window').width * 0.8, 340);

// Ligne du menu (définie hors de Drawer pour ne pas être recréée à chaque rendu).
function Item({ icon, label, count, onPress, active }) {
  return (
    <TouchableOpacity
      testID={`drawer-${label}`}
      style={[styles.item, active && styles.itemActive]}
      onPress={onPress}
    >
      <Icon name={icon} size={20} style={styles.itemIcon} />
      <Text style={styles.itemTxt}>{label}</Text>
      {count !== undefined ? (
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{count}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

// Menu latéral sombre (écran 8 du design).
export default function Drawer({ open, onClose, counts, onSelect, onLogout }) {
  const insets = useSafeAreaInsets();
  const x = useRef(new Animated.Value(-W)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    let timer;
        if (open) {
          setMounted(true);
          Animated.timing(x, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(x, {
            toValue: -W,
            duration: 180,
            useNativeDriver: true,
          }).start();
          // le menu disparaît toujours, même si l'animation ne se termine pas
          timer = setTimeout(() => setMounted(false), 200);
        }
        return () => clearTimeout(timer);
      }, [open, x]);

  if (!mounted) return null;

  return (
    <Pressable
          testID="drawer-overlay"
          style={StyleSheet.absoluteFill}
          pointerEvents={open ? 'auto' : 'none'}
          onPress={onClose}
        >
     <View pointerEvents="none" style={styles.overlay} />
      <Animated.View
        style={[
          styles.panel,
          {
            width: W,
            paddingTop: insets.top + 16,
            transform: [{ translateX: x }],
          },
        ]}
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoTxt}>✓</Text>
          </View>
          <Text style={styles.brandTxt}>TodoApp</Text>
        </View>
        <Item
          icon="home"
          label="All Tasks"
          active
          onPress={() => onSelect('All')}
        />
        <Item
          icon="check"
          label="Completed"
          count={counts.done}
          onPress={() => onSelect('Completed')}
        />
        <Item
          icon="clock"
          label="Pending"
          count={counts.pending}
          onPress={() => onSelect('Pending')}
        />
        <Item
          icon="star"
          label="Important"
          count={counts.important}
          onPress={() => onSelect('Important')}
        />
        <View style={styles.sep} />
        <Item
          icon="settings"
          label="Settings"
          onPress={() => onSelect('__settings')}
        />
        <Item icon="logout" label="Log Out" onPress={onLogout} />
        <View style={styles.footer}>
          <Icon name="trophy" size={26} />
          <Text style={styles.footerTxt}>Stay productive!</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.darkBg,
    paddingHorizontal: 14,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    paddingHorizontal: 6,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoTxt: { color: '#fff', fontSize: 22, fontWeight: '900' },
  brandTxt: { color: '#fff', fontSize: 22, fontWeight: '800' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 2,
  },
  itemActive: { backgroundColor: colors.darkItem },
  itemIcon: { width: 30 },
  itemTxt: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  badge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#5A4BD0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  sep: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 12,
  },
  footer: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2552',
    borderRadius: 16,
    padding: 16,
  },
  footerTxt: { color: '#fff', fontWeight: '700', fontSize: 15, marginLeft: 12 },
});

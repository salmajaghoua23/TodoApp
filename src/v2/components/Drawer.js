import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import Icon from './Icon';

const W = Math.min(Dimensions.get('window').width * 0.8, 340);

// Menu latéral sombre (écran 8 du design).
export default function Drawer({ open, onClose, counts, onSelect, onLogout }) {
  const insets = useSafeAreaInsets();
  const x = useRef(new Animated.Value(-W)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(x, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    } else {
      Animated.timing(x, { toValue: -W, duration: 180, useNativeDriver: true }).start(() => setMounted(false));
    }
  }, [open, x]);

  if (!mounted) return null;

  const Item = ({ icon, label, count, filter, onPress, active }) => (
    <TouchableOpacity style={[styles.item, active && styles.itemActive]} onPress={onPress || (() => onSelect(filter))}>
      <Icon name={icon} size={20} style={{ width: 30 }} />
      <Text style={styles.itemTxt}>{label}</Text>
      {count !== undefined ? (
        <View style={styles.badge}><Text style={styles.badgeTxt}>{count}</Text></View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.panel, { width: W, paddingTop: insets.top + 16, transform: [{ translateX: x }] }]}>
        <View style={styles.brand}>
          <View style={styles.logo}><Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>✓</Text></View>
          <Text style={styles.brandTxt}>TodoApp</Text>
        </View>
        <Item icon="home" label="All Tasks" filter="All" active />
        <Item icon="check" label="Completed" count={counts.done} filter="Completed" />
        <Item icon="clock" label="Pending" count={counts.pending} filter="Pending" />
        <Item icon="star" label="Important" count={counts.important} filter="Important" />
        <View style={styles.sep} />
        <Item icon="settings" label="Settings" filter="__settings" />
        <Item icon="logout" label="Log Out" onPress={onLogout} />
        <View style={styles.footer}>
          <Icon name="trophy" size={26} />
          <Text style={styles.footerTxt}>Stay productive!</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  panel: { position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: colors.darkBg, paddingHorizontal: 14 },
  brand: { flexDirection: 'row', alignItems: 'center', marginBottom: 22, paddingHorizontal: 6 },
  logo: { width: 46, height: 46, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  brandTxt: { color: '#fff', fontSize: 22, fontWeight: '800' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, marginBottom: 2 },
  itemActive: { backgroundColor: colors.darkItem },
  itemTxt: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  badge: { minWidth: 26, height: 26, borderRadius: 13, backgroundColor: '#5A4BD0', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 12 },
  footer: { position: 'absolute', left: 14, right: 14, bottom: 30, flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A2552', borderRadius: 16, padding: 16 },
  footerTxt: { color: '#fff', fontWeight: '700', fontSize: 15, marginLeft: 12 },
});

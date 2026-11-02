import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ShopTheme } from '@/constants/shop-theme';
import { SHOP_CATEGORIES, type ShopCategory } from '@/data/shop-products';

type MenuPosition = {
  left: number;
  top: number;
  width: number;
};

export function CategorySelect({
  value,
  onChange,
}: {
  value: ShopCategory;
  onChange: (category: ShopCategory) => void;
}) {
  const triggerRef = useRef<View>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const openMenu = () => {
    triggerRef.current?.measureInWindow((left, top, width) => {
      setMenuPosition({ left, top: top + 76, width });
    });
  };

  const closeMenu = () => setMenuPosition(null);

  return (
    <>
      <View style={styles.wrapper}>
        <TouchableOpacity
          ref={triggerRef}
          accessibilityRole="button"
          accessibilityLabel={`Catégorie sélectionnée : ${value}`}
          accessibilityState={{ expanded: menuPosition !== null }}
          activeOpacity={0.8}
          onPress={openMenu}
          style={styles.trigger}
        >
          <Text style={styles.triggerText}>{value}</Text>
          <View style={[styles.caret, menuPosition !== null && styles.caretOpen]} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuPosition !== null}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modal}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fermer le menu des catégories"
            onPress={closeMenu}
            style={StyleSheet.absoluteFill}
          />
          {menuPosition !== null && (
            <View
              accessibilityRole="menu"
              style={[
                styles.menu,
                {
                  left: menuPosition.left,
                  top: menuPosition.top,
                  width: menuPosition.width,
                },
              ]}
            >
              {SHOP_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: category === value }}
                  activeOpacity={0.8}
                  onPress={() => {
                    onChange(category);
                    closeMenu();
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 18,
    marginTop: -36,
    position: 'relative',
    zIndex: 2,
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: ShopTheme.colors.card,
    borderRadius: 15,
    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.18)',
    elevation: 3,
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    paddingLeft: 18,
    paddingRight: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },
  triggerText: {
    color: ShopTheme.colors.text,
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 16,
  },
  caret: {
    borderLeftColor: 'transparent',
    borderLeftWidth: 7,
    borderRightColor: 'transparent',
    borderRightWidth: 7,
    borderTopColor: '#111111',
    borderTopWidth: 8,
    height: 0,
    width: 0,
  },
  caretOpen: {
    borderBottomColor: '#111111',
    borderBottomWidth: 8,
    borderTopColor: 'transparent',
    borderTopWidth: 0,
  },
  modal: {
    flex: 1,
  },
  menu: {
    backgroundColor: ShopTheme.colors.card,
    borderRadius: 12,
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.25)',
    elevation: 8,
    overflow: 'hidden',
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  menuItem: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  menuText: {
    color: ShopTheme.colors.text,
    fontFamily: ShopTheme.fonts.regular,
    fontSize: 16,
  },
});

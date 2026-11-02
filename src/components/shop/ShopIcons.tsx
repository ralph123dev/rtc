import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { ShopTheme } from '@/constants/shop-theme';

type TabIconName = 'basket' | 'ticket' | 'shop' | 'grid';

const tabPaths: Record<TabIconName, string> = {
  basket:
    'M13 16l5-9M27 16l-5-9M5 16h30M8 16l3 16h18l3-16M16 21v7M20 21v7M24 21v7',
  ticket:
    'M6 11h28a1 1 0 0 1 1 1v5a3 3 0 0 0 0 6v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5a3 3 0 0 0 0-6v-5a1 1 0 0 1 1-1zM14 18h12M14 23h8',
  shop:
    'M5 14l3-8h24l3 8v3a4 4 0 0 1-7.5 1.5 4 4 0 0 1-7 0 4 4 0 0 1-7 0A4 4 0 0 1 5 17zM8 21v13h24V21M16 34V25h8v9',
  grid:
    'M28.5 22v13M22 28.5h13',
};

export function ShopTabIcon({
  name,
  color,
  size = ShopTheme.dimensions.tabIconSize,
}: {
  name: TabIconName;
  color: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {name === 'grid' ? (
        <>
          <Rect x="6" y="6" width="11" height="11" rx="3" stroke={color} strokeWidth="2.4" />
          <Rect x="23" y="6" width="11" height="11" rx="3" stroke={color} strokeWidth="2.4" />
          <Rect x="6" y="23" width="11" height="11" rx="3" stroke={color} strokeWidth="2.4" />
          <Path
            d={tabPaths.grid}
            stroke={color}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </>
      ) : (
        <Path
          d={tabPaths[name]}
          stroke={color}
          strokeWidth={name === 'shop' ? 2.4 : 2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

export function BasketPlusIcon() {
  return (
    <Svg width={32} height={32} viewBox="0 0 40 40" fill="none">
      <G
        stroke={ShopTheme.colors.text}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d={tabPaths.basket} />
      </G>
      <Circle cx="31" cy="31" r="7.5" fill={ShopTheme.colors.active} />
      <Path
        d="M31 27.5v7M27.5 31h7"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

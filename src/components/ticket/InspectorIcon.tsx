import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export function InspectorIcon({ size = 46, color = '#1D1D1D' }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M38 33c-2-11 4-18 13-18 8 0 13 5 11 18-4-1-8-5-10-9-4 5-9 8-14 9z" />
      <Path d="M38 33v6c0 8 5 13 12 13s12-5 12-13v-6" />
      <Path d="M38 36c-4 0-4 7 0 7M62 36c4 0 4 7 0 7" />
      <Circle cx={45} cy={38} r={1} fill={color} />
      <Circle cx={55} cy={38} r={1} fill={color} />
      <Path d="M50 39v4h2M46 47c2.5 2 5.5 2 8 0" />
      <Path d="M45 52v6M55 52v6M45 58l5 6 5-6" />
      <Path d="M48 64h4l-.8 3h-2.4zM49.2 67l-2 16 2.8 3 2.8-3-2-16" />
      <Path d="M45 58l-9 4c-12 4-21 9-21 22v10M55 58l9 4c12 4 21 9 21 22v10M15 94h70" />
      <Path d="M42 62l-5 13 8 19M58 62l5 13-8 19" />
      <Path d="M65 80h10M66 80l1-5h6l1 5" />
    </Svg>
  );
}

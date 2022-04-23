import {Dimensions, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {charInfo, Origin} from '../utils/data';
import Svg, {Path} from 'react-native-svg';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {TAU} from '../utils/constants';
import {buildPath} from '../utils/utils';

type ChartProps = {
  rotation: Animated.SharedValue<number>;
};

const {width, height} = Dimensions.get('window');

const STROKE_WIDTH = 2;
const R = width * 0.4;

const Chart: React.FC<ChartProps> = ({rotation}) => {
  const [paths, setPaths] = useState<string[]>([]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${-rotation.value}rad`}],
    };
  });

  useEffect(() => {
    const origins: Origin[] = [];
    for (let i = 0; i < charInfo.length; i++) {
      const start =
        i === 0
          ? {x: R + R * Math.cos(0), y: R + -(R * Math.sin(0))}
          : origins[i - 1].end;

      let combinedPercentage = 0;
      for (let j = 0; j <= i; j++) {
        combinedPercentage += charInfo[j].percentage;
      }

      const end = {
        x: R + R * Math.cos(TAU * combinedPercentage),
        y: R + -(R * Math.sin(TAU * combinedPercentage)),
      };

      origins.push({start, end});
    }

    const ds = buildPath(origins, charInfo.length, R);
    setPaths(ds);
  }, []);

  return (
    <Animated.View style={[styles.svg, rStyle]}>
      <Svg
        width={R * 2 + STROKE_WIDTH}
        height={R * 2 + STROKE_WIDTH}
        renderToHardwareTextureAndroid={true}>
        {paths.map((path, index) => {
          return (
            <Path
              d={path}
              key={`path-${index}`}
              fill={charInfo[index].color}
              stroke={'#fff'}
              strokeWidth={2}
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
    top: height - R * 2,
    borderRadius: R,
    alignSelf: 'center',
  },
});

export default Chart;

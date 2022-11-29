import React, { useState, useEffect, RefObject } from 'react';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import { APITypes } from "plyr-react";

import styles from 'styles/Home.module.scss';
import { ColorHex, ColorHexCodec } from "types/colors.codec";

type MainProps = { colors: Array<ColorHex>, videoRef: RefObject<APITypes> };
type ItemProps = { color: ColorHex, isPlaying: boolean };

const isHexColor = (colorsList: Array<string>) =>
  colorsList.filter(hex => E.isRight(ColorHexCodec.decode(hex)))

const FoggyItem = ({ color, isPlaying }: ItemProps) => {
  const [translateX, setTranslateX] = useState<number>(0);

  useEffect(() => {
    const shouldAnimate = !isPlaying && !window?.matchMedia('(prefers-reduced-motion: reduce)')?.matches;
    shouldAnimate && setTimeout(() => setTranslateX(Math.random() * 100 / 3), 1500);
  }, [translateX])

  return (
    <span style={{ backgroundColor: color, transform: `translateX(${translateX}%)` }}>
      {color}
    </span>
  )
}

export const FoggyBackground: React.FC<MainProps> = ({ colors, videoRef }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // I tried to use videoRef.on() + useEffect for getting access to events, but didn´t work 😥

  return pipe(colors,
    O.fromNullable,
    O.filter(list => list?.length >= 1),
    O.map(isHexColor),
    O.fold(
      () => (<code className='failed' />),
      (hexList) => (
        <code className={styles.foggyList}>
          {hexList.map(hex => (
            <FoggyItem
              isPlaying={isPlaying}
              color={hex}
              key={hex}
            />
          ))}
        </code>
      ),
    )
  )
}
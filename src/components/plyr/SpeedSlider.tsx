import React, { useState, useEffect, RefObject, SyntheticEvent } from "react";
import type { APITypes } from "plyr-react";
import { pipe } from "fp-ts/lib/function";
import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IOOption';

import styles from 'styles/Home.module.scss';
import { getSavedPlyrSettings } from "helpers/plyrHelpers";

export const SpeedHandler: React.FC<{ videoRef: RefObject<APITypes> }> = ({ videoRef }) => {
  const [speedInfo, setSpeedInfo] = useState<number>(1);

  useEffect(() => pipe('speed',
    getSavedPlyrSettings,
    IO.match(
      () => console.log('Starting w/ default speed: 1x'),
      setSpeedInfo,
    )
  ), [])

  const changePace = (ev: SyntheticEvent<HTMLInputElement>) => pipe(ev,
    O.fromNullable,
    O.map(ev => ev?.target?.valueAsNumber),
    O.fold(
      () => io.of(undefined),
      (value) => {
        videoRef.current.plyr.speed = value;
        setSpeedInfo(value);
      }
    ));

  return (
    <>
      <input
        className={styles.speedSlider}
        type="range"
        min="0.5"
        max="2"
        step="0.25"
        defaultValue={speedInfo}
        onChange={ev => changePace(ev)}
      />
      <span>Actual Speed: {speedInfo}x</span>
    </>
  );
}
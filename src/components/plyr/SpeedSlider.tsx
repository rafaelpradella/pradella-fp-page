import React, { useState, useEffect, RefObject, SyntheticEvent } from "react";
import type { APITypes } from 'plyr-react';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as IO from 'fp-ts/IOOption';

import styles from '~/styles/Home.module.scss';
import { getSavedPlyrSettings } from '~/helpers/plyrHelpers';

export const SpeedSlider: React.FC<{ videoRef: RefObject<APITypes> }> = ({ videoRef }) => {
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
    O.chain(() => O.fromNullable(ev?.currentTarget?.valueAsNumber)),
    O.fold(
      () => console.error('SpeedSlider: Couldn´t change speed value right now'),
      (value) => {
        videoRef.current.plyr.speed = value;
        setSpeedInfo(value);
      }
    ));

  return (
    <div className={styles.speedSlider}>
      <input
        id="speedRange"
        type="range"
        min="0.5"
        max="2"
        step="0.25"
        defaultValue={speedInfo}
        onChange={ev => changePace(ev)}
      />
      <label htmlFor="speedRange">Actual Speed: {speedInfo}x</label>
    </div>
  );
}
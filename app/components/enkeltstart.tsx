// app/components/Enkeltstart.tsx
'use client';

import React, { memo, useState } from 'react';
import { RaceData, RacerScore, SegmentScore } from '@/app/types';
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  
} from '@tremor/react';
import { parseDurationTime, millisecondsToDurationTime } from '@/app/utils/timeUtils';

type EnkeltstartProps = {
  data: RaceData;
  category: string;
  race: string;
};

const Enkeltstart: React.FC<EnkeltstartProps> = ({ data, category, race }) => {
  if (!data.racerScores || !Array.isArray(data.racerScores)) {
    return <p>No racer scores available for Enkeltstart.</p>;
  }

  // Sort racers by durationTime ascending (faster times first)
  const sortedRacers = [...data.racerScores].sort((a, b) => {
    const durationA = parseDurationTime(a.durationTime);
    const durationB = parseDurationTime(b.durationTime);
    return durationA - durationB;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{category} {race}</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell align='left'>Navn</TableHeaderCell>
            <TableHeaderCell>Tid</TableHeaderCell>
            <TableHeaderCell>Point</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRacers.map((racer: RacerScore) => (
            <TableRow key={racer.athleteId}>
              <TableCell align='left'>
                <Text>{racer.name}</Text>
              </TableCell>
              <TableCell>
                <Text>{racer.durationTime}</Text>
              </TableCell>
              <TableCell align='center'>
                <Text>{racer.finPoints}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-center">
      </div>
    </div>
  );
};

export default memo(Enkeltstart);


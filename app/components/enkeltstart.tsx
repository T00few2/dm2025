'use client';

import React, { memo } from 'react';
import { RaceData, RacerScore } from '@/app/types';
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
} from '@tremor/react';
import { parseDurationTime } from '@/app/utils/timeUtils';

type EnkeltstartProps = {
  data: RaceData;
  category: string;
  race: string;
};

const Enkeltstart: React.FC<EnkeltstartProps> = ({ data, category, race }) => {
  const { racerScores, segmentScores } = data;

  if (!racerScores || !Array.isArray(racerScores)) {
    return <p>No racer scores available for Enkeltstart.</p>;
  }

  if (!segmentScores || !Array.isArray(segmentScores)) {
    return <p>No segment scores available for Enkeltstart.</p>;
  }

  // Aggregate all split times per racer
  const splits = segmentScores.reduce((acc, segment, segmentIndex) => {
    segment.fal.forEach((fal) => {
      if (!acc[fal.athleteId]) {
        acc[fal.athleteId] = { name: fal.name, splits: [] };
      }
      acc[fal.athleteId].splits[segmentIndex] = fal.eventTimeDisplay;
    });
    return acc;
  }, {} as Record<string, { name: string; splits: string[] }>);

  // Sort racers by durationTime ascending (faster times first)
  const sortedRacers = [...racerScores].sort((a, b) => {
    const durationA = parseDurationTime(a.durationTime);
    const durationB = parseDurationTime(b.durationTime);
    return durationA - durationB;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {category} {race}
      </h2>
      <Table className="table-auto border-separate border-spacing-4">
        <TableHead>
          <TableRow>
            <TableHeaderCell className="text-left">Navn</TableHeaderCell>
            {segmentScores.map((segment, index) => (
              <TableHeaderCell key={index} className="text-center">
                {segment.name} [{segment.repeat}]
              </TableHeaderCell>
            ))}
            <TableHeaderCell className="text-center">Tid</TableHeaderCell>
            <TableHeaderCell className="text-center">Point</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRacers.map((racer: RacerScore) => {
            const racerSplits = splits[racer.athleteId]?.splits || [];
            return (
              <TableRow key={racer.athleteId}>
                <TableCell className="text-left">
                  <Text>{racer.name}</Text>
                </TableCell>
                {segmentScores.map((_, index) => (
                  <TableCell key={index} className="text-center">
                    <Text>{racerSplits[index] || '-'}</Text>
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <Text>{racer.durationTime}</Text>
                </TableCell>
                <TableCell className="text-center">
                  <Text>{racer.leaguePoints}</Text>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default memo(Enkeltstart);

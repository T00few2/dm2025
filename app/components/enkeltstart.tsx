// app/components/races/Enkeltstart.tsx
'use client';

import React, { memo } from 'react';
import { RaceData, RacerScore } from '@/app/types';

import {
  Table,
  Text,
  Box,
  Heading,
} from '@chakra-ui/react';
import { parseDurationTime } from '@/app/utils/timeUtils';

type EnkeltstartProps = {
  data: RaceData;
  category: string;
  race: string;
};

const Enkeltstart: React.FC<EnkeltstartProps> = ({ data, category, race }) => {
  const { racerScores, segmentScores } = data;

  if (!racerScores || !Array.isArray(racerScores)) {
    return <Text>No racer scores available for Enkeltstart.</Text>;
  }

  if (!segmentScores || !Array.isArray(segmentScores)) {
    return <Text>No segment scores available for Enkeltstart.</Text>;
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
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        {category} {race}
      </Heading>
      <Table.Root colorScheme="gray" size="md" minW="full">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader textAlign="left">Navn</Table.ColumnHeader>
            {segmentScores.map((segment, index) => (
              <Table.ColumnHeader key={index} textAlign="center">
                {segment.name} [{segment.repeat}]
              </Table.ColumnHeader>
            ))}
            <Table.ColumnHeader textAlign="center">Tid</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Point</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedRacers.map((racer: RacerScore) => {
            const racerSplits = splits[racer.athleteId]?.splits || [];
            return (
              <Table.Row key={racer.athleteId}>
                <Table.Cell textAlign="left">
                  <Text>{racer.name}</Text>
                </Table.Cell>
                {segmentScores.map((_, index) => (
                  <Table.Cell key={index} textAlign="center">
                    <Text>{racerSplits[index] || '-'}</Text>
                  </Table.Cell>
                ))}
                <Table.Cell textAlign="center">
                  <Text>{racer.durationTime}</Text>
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <Text>{racer.leaguePoints}</Text>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default memo(Enkeltstart);

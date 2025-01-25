// app/components/races/Point.tsx
'use client';

import React, { memo } from 'react';
import { RaceData } from '@/app/types';
import {
  Table,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';

type PointProps = {
  data: RaceData;
  category: string;
  race: string;
};

const Point: React.FC<PointProps> = ({ data, category, race }) => {
  if (!data.segmentScores) {
    return <Text>No segment scores available for Point race.</Text>;
  }

  // Step 1: Create a map for leaguePoints from racerScores
  const leaguePointsMap = data.racerScores?.reduce((acc, racer) => {
    acc[racer.athleteId] = racer.leaguePoints;
    return acc;
  }, {} as Record<string, number>) || {};

  // Step 2: Aggregate FAL points by rider across all segments and calculate totals
  const aggregatedPoints = data.segmentScores.reduce((acc, segment) => {
    segment.fal.forEach((fal) => {
      if (!acc[fal.athleteId]) {
        acc[fal.athleteId] = { name: fal.name, points: {}, total: 0, leaguePoints: 0 };
      }
      acc[fal.athleteId].points[segment.name] = fal.points;
      acc[fal.athleteId].total += fal.points;
      // Assign leaguePoints from the map
      acc[fal.athleteId].leaguePoints = leaguePointsMap[fal.athleteId] || 0;
    });
    return acc;
  }, {} as Record<string, { name: string; points: Record<string, number>; total: number; leaguePoints: number }>);
  
  // Step 3: Extract all segment names for table columns
  const segmentHeaders = data.segmentScores.map(
    (segment) => `${segment.name}-${segment.repeat}`
  );

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        {category} {race}
      </Heading>
      <Table.Root size="md">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Navn</Table.ColumnHeader>
            {segmentHeaders.map((header) => (
              <Table.ColumnHeader key={header}>
                {header.split('-')[0]} [{header.split('-')[1]}]
              </Table.ColumnHeader>
            ))}
            {/* Total Column */}
            <Table.ColumnHeader textAlign="right">Total</Table.ColumnHeader>
            {/* League Points Column */}
            <Table.ColumnHeader textAlign="center">League Points</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.values(aggregatedPoints).map(({ name, points, leaguePoints, total }) => (
            <Table.Row key={name}>
              <Table.Cell>
                <Text>{name}</Text>
              </Table.Cell>
              {segmentHeaders.map((header) => (
                <Table.Cell key={header} textAlign="center">
                  <Text>{points[header.split('-')[0]] || 0}</Text>
                </Table.Cell>
              ))}
              {/* Total Cell */}
              <Table.Cell textAlign="right">
                <Text>{total}</Text>
              </Table.Cell>
              {/* League Points Cell */}
              <Table.Cell textAlign="center">
                <Text>{leaguePoints}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default memo(Point);

// app/components/races/Point.tsx
'use client';

import React, { memo } from 'react';
import { RaceData } from '@/app/types';

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
} from '@tremor/react';

type PointProps = {
  data: RaceData;
  category: string;
  race: string;
};

const Point: React.FC<PointProps> = ({ data, category, race }) => {
  if (!data.segmentScores) {
    return <p>No segment scores available for Point race.</p>;
  }

  // Aggregate FAL points by rider across all segments and calculate totals
  const aggregatedPoints = data.segmentScores.reduce((acc, segment) => {
    segment.fal.forEach((fal) => {
      if (!acc[fal.athleteId]) {
        acc[fal.athleteId] = { name: fal.name, points: {}, total: 0 };
      }
      acc[fal.athleteId].points[segment.name] = fal.points;
      acc[fal.athleteId].total += fal.points;
    });
    return acc;
  }, {} as Record<string, { name: string; points: Record<string, number>; total: number }>);

  // Extract all segment names for table columns
  const segmentHeaders = data.segmentScores.map(
    (segment) => `${segment.name}-${segment.repeat}`
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {category} {race}
      </h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell align="left">Navn</TableHeaderCell>
            {segmentHeaders.map((header) => (
              <TableHeaderCell key={header}>
                {header.split('-')[0]} [{header.split('-')[1]}]
              </TableHeaderCell>
            ))}
            <TableHeaderCell align="right">Total</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(aggregatedPoints).map(({ name, points, total }) => (
            <TableRow key={name}>
              <TableCell>
                <Text>{name}</Text>
              </TableCell>
              {segmentHeaders.map((header) => (
                <TableCell key={header} align="center">
                  <Text>{points[header.split('-')[0]] || 0}</Text>
                </TableCell>
              ))}
              <TableCell align="right">
                <Text>{total}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default memo(Point);

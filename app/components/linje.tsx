// app/components/races/Linje.tsx
'use client';

import React, { memo } from 'react';
import { RaceData, SegmentScore } from '@/app/types';

type LinjeProps = {
  data: RaceData;
  category: string;
  race: string;
};

const Linje: React.FC<LinjeProps> = ({ data }) => {
  if (!data.segmentScores) {
    return <p>No segment scores available for Linje race.</p>;
  }

  return (
    <div>
      <h2>Linje Race Details</h2>
      {data.segmentScores.map((segment: SegmentScore) => (
        <div key={`${segment.name}-${segment.repeat}`}>
          <h3>{segment.name} [Repeat: {segment.repeat}]</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>FAL Points</th>
                <th>FTS Points</th>
              </tr>
            </thead>
            <tbody>
              {segment.fal.map((fal) => (
                <tr key={fal.athleteId}>
                  <td>{fal.name}</td>
                  <td>{fal.points}</td>
                  <td>{/* Insert FTS Points if applicable */}</td>
                </tr>
              ))}
              {/* Repeat for FTS points if necessary */}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default memo(Linje);

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ref, onValue, off } from 'firebase/database';
import { getDb } from '../../utils/firebaseClient';

/** Adjust these to match your actual DB structure. */
type RacerScore = {
  athleteId: number;
  name: string;
  falPointTotal: number;
  ftsPointTotal: number;
  finPoints: number;
  pointTotal: number;
};

type SegmentScore = {
  name: string;
  fal: { athleteId: number; name: string; points: number }[];
  fts: { athleteId: number; name: string; points: number }[];
};

type RaceData = {
  timestamp?: string;
  racerScores?: RacerScore[];
  segmentScores?: SegmentScore[];
};

export default function EventIDPage() {
  const { eventID } = useParams(); // from /results/[eventID]

  const [data, setData] = useState<RaceData | null>(null);
  const [loading, setLoading] = useState(true);

  // Dropdown #1: View type ("racerScores" or "segmentScores")
  const [viewType, setViewType] = useState<'racerScores' | 'segmentScores'>('racerScores');

  // Dropdown #2: Which segment is selected (only relevant if viewType === 'segmentScores')
  const [selectedSegmentName, setSelectedSegmentName] = useState<string>('');

  useEffect(() => {
    if (!eventID) return;
    const db = getDb();
    // We'll read from "race_results/<eventID>/B" (per your code)
    const dbPath = `race_results/${eventID}/B`;
    const dbRef = ref(db, dbPath);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData(null);
      }
      setLoading(false);
    });

    return () => off(dbRef, 'value', unsubscribe);
  }, [eventID]);

  /** Helper to sort racerScores by pointTotal descending */
  function renderRacerScores() {
    if (!data?.racerScores) return <p>No racer scores found.</p>;

    // Sort by descending pointTotal
    const sorted = [...data.racerScores].sort((a, b) => b.pointTotal - a.pointTotal);

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>FAL</th>
            <th>FTS</th>
            <th>FIN</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((racer) => (
            <tr key={racer.athleteId}>
              <td>{racer.name}</td>
              <td>{racer.falPointTotal}</td>
              <td>{racer.ftsPointTotal}</td>
              <td>{racer.finPoints}</td>
              <td>{racer.pointTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  /** Helper to render a list of segments in a dropdown, then display the chosen segment by fal points */
  function renderSegmentScores() {
    if (!data?.segmentScores) return <p>No segment scores found.</p>;

    // Build the dropdown of segment names
    const segmentNames = data.segmentScores.map((seg) => seg.name);

    // Find the selected segment object
    const chosenSegment = data.segmentScores.find((seg) => seg.name === selectedSegmentName);

    return (
      <>
        <label htmlFor="segmentSelect">
          Choose a segment:
          <select
            id="segmentSelect"
            value={selectedSegmentName}
            onChange={(e) => setSelectedSegmentName(e.target.value)}
          >
            <option value="">-- Select --</option>
            {segmentNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        {chosenSegment ? (
          <SegmentTable segment={chosenSegment} />
        ) : (
          selectedSegmentName && <p>No data for segment {selectedSegmentName}</p>
        )}
      </>
    );
  }

  /** Render a table for a single segment, sorted by fal points descending */
  function SegmentTable({ segment }: { segment: SegmentScore }) {
    // segment.fal is the array of fal points
    const sortedFal = [...segment.fal].sort((a, b) => b.points - a.points);

    return (
      <>
        <h2>{segment.name}</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>FAL Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedFal.map((entry) => (
              <tr key={entry.athleteId}>
                <td>{entry.name}</td>
                <td>{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  if (loading) return <p>Loading data for {eventID}...</p>;
  if (!data) return <p>No data found for {eventID}.</p>;

  return (
    <main>
      <h1>Race Data for {eventID}</h1>
      {data.timestamp && <p>Timestamp: {data.timestamp}</p>}

      {/* Dropdown to switch between "racerScores" and "segmentScores" */}
      <label htmlFor="viewSelect">
        Select View:
        <select
          id="viewSelect"
          value={viewType}
          onChange={(e) => setViewType(e.target.value as 'racerScores' | 'segmentScores')}
        >
          <option value="racerScores">Racer Scores</option>
          <option value="segmentScores">Segment Scores</option>
        </select>
      </label>

      {viewType === 'racerScores' ? renderRacerScores() : renderSegmentScores()}
    </main>
  );
}

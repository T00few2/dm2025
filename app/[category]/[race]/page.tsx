'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ref, onValue, off } from 'firebase/database';
import { getDb } from '@/app/utils/firebaseClient';
import rawEventMap from '@/app/data/eventMap.json';

// 1) RaceEvents can have any string keys
type RaceEvents = {
  [key: string]: string;
};

// 2) eventMap is Record<string, RaceEvents>
type EventMap = Record<string, RaceEvents>;
const eventMap = rawEventMap as EventMap;

// 3) Example shapes
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
  repeat: number;
  fal: { athleteId: number; name: string; points: number }[];
  fts: { athleteId: number; name: string; points: number }[];
};

type RaceData = {
  timestamp?: string;
  racerScores?: RacerScore[];
  segmentScores?: SegmentScore[];
};

export default function RacePage() {
  const { category, race } = useParams();

  // Convert any array or undefined to a single string
  const categoryStr = Array.isArray(category) ? category[0] : category ?? '';
  const raceStr = Array.isArray(race) ? race[0] : race ?? '';

  // Lowercase to match JSON
  const categoryKey = categoryStr.toLowerCase();
  const raceKey = raceStr.toLowerCase();

  // eventID from JSON
  const eventID = eventMap[categoryKey]?.[raceKey];

  const [data, setData] = useState<RaceData | null>(null);
  const [loading, setLoading] = useState(true);

  const [viewType, setViewType] = useState<'racerScores' | 'segmentScores'>('racerScores');
  const [selectedSegmentName, setSelectedSegmentName] = useState('');

  // Fetch data from Firebase if eventID is found
  useEffect(() => {
    if (!eventID) {
      setLoading(false);
      return;
    }
    const db = getDb();
    // Note: If your data is at `race_results/<eventID>/B` or something else,
    // adjust the path. Right now it's `race_results/<eventID>`.
    const dbRef = ref(db, `race_results/${eventID}`);

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

  // Default "latest" if we switch to segmentScores
  useEffect(() => {
    if (viewType === 'segmentScores' && !selectedSegmentName) {
      setSelectedSegmentName('latest');
    }
  }, [viewType, selectedSegmentName]);

  // Helper to show scores
  function renderRacerScores() {
    if (!data?.racerScores) return <p>No racer scores found.</p>;

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

  function renderSegmentScores() {
    if (!data?.segmentScores) return <p>No segment scores found.</p>;

    // Build a map of label -> segment object
    // label is "name [repeat]"
    const segmentsMap = new Map<string, SegmentScore>();
    for (const seg of data.segmentScores) {
      const label = `${seg.name} [${seg.repeat}]`;
      segmentsMap.set(label, seg);
    }

    // Sort the labels if desired (optional)
    const segmentLabels = Array.from(segmentsMap.keys());

    // Determine which segment is chosen
    let chosenSegment: SegmentScore | undefined;
    if (selectedSegmentName === 'latest') {
      // "latest" -> last segment in the array
      chosenSegment = data.segmentScores[data.segmentScores.length - 1];
    } else {
      // Otherwise, find by the label in segmentsMap
      chosenSegment = segmentsMap.get(selectedSegmentName);
    }

    return (
      <>
        <label htmlFor="segmentSelect">
          Choose a segment:
          <select
            id="segmentSelect"
            value={selectedSegmentName}
            onChange={(e) => setSelectedSegmentName(e.target.value)}
          >
            <option value="latest">Latest</option>
            {segmentLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {chosenSegment ? <SegmentTable segment={chosenSegment} /> : <p>No data.</p>}
      </>
    );
  }

  function SegmentTable({ segment }: { segment: SegmentScore }) {
    // Default fal or fts to an empty array if they're missing/undefined:
    const falArray = segment.fal ?? [];
    const ftsArray = segment.fts ?? [];
  
    const sortedFal = [...falArray].sort((a, b) => b.points - a.points);
    // If you need to sort fts as well:
    // const sortedFts = [...ftsArray].sort((a, b) => b.points - a.points);
  
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
  

  // 1) If eventID not found in JSON -> invalid route
  if (!eventID) {
    return (
      <main>
        <h1>Invalid Route</h1>
        <p>
          No eventID found for category "{categoryStr}" and race "{raceStr}" in
          eventMap.json.
        </p>
      </main>
    );
  }

  // 2) If still loading from Firebase
  if (loading) {
    return <p>Loading data for eventID: {eventID}...</p>;
  }

  // 3) If eventID was found but no data in Firebase
  if (!data) {
    return <p>No results. Stay tuned!</p>;
  }

  // 4) Normal rendering
  return (
    <main>
      <h1>
        Race Data for {categoryStr}/{raceStr} (Event ID: {eventID})
      </h1>
      {data.timestamp && <p>Timestamp: {data.timestamp}</p>}

      <label htmlFor="viewSelect">
        Select View:
        <select
          id="viewSelect"
          value={viewType}
          onChange={(e) =>
            setViewType(e.target.value as 'racerScores' | 'segmentScores')
          }
        >
          <option value="racerScores">Racer Scores</option>
          <option value="segmentScores">Segment Scores</option>
        </select>
      </label>

      {viewType === 'racerScores' ? renderRacerScores() : renderSegmentScores()}
    </main>
  );
}

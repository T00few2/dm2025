// app/pages/[category]/[race]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ref, onValue, off } from 'firebase/database';
import { getDb } from '@/app/utils/firebaseClient';
import rawEventMap from '@/app/data/eventMap.json';

import { RaceData, EventMap } from '@/app/types';
import Heat1 from '@/app/components/heat1';
import Point from '@/app/components/point';
import Linje from '@/app/components/linje';

import * as styles from './page.module.css';

const eventMap = rawEventMap as EventMap;

const RacePage: React.FC = () => {
  const { category, race } = useParams();

  // Convert any array or undefined to a single string
  const categoryStr = Array.isArray(category) ? category[0] : category ?? '';
  const raceStr = Array.isArray(race) ? race[0] : race ?? '';

  // Lowercase to match JSON keys
  const categoryKey = categoryStr.toLowerCase();
  const raceKey = raceStr.toLowerCase();

  // Get eventID from JSON
  const eventID = eventMap[categoryKey]?.[raceKey];

  const [data, setData] = useState<RaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Firebase if eventID is found
  useEffect(() => {
    if (!eventID) {
      setLoading(false);
      return;
    }

    const db = getDb();
    const dbRef = ref(db, `race_results/${eventID}`);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData(snapshot.val());
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching race data:', err);
        setError('Failed to load race data. Please try again later.');
        setLoading(false);
      }
    );

    return () => off(dbRef, 'value', unsubscribe);
  }, [eventID]);
 

  // Function to render race-specific component
  const renderRaceComponent = (raceData: RaceData) => {
    switch (raceKey) {
      case 'heat1':
        return <Heat1 data={raceData} category={category as string} race={race as string} />;
      case 'point':
        return <Point data={raceData} category={category as string} race={race as string} />;
      case 'linje':
        return <Linje data={raceData} category={category as string} race={race as string}  />;
      default:
        return (
          <div>
            <h1>Unknown Race Type</h1>
            <p>The race type {raceStr} is not recognized.</p>
          </div>
        );
    }
  };
  return (
    <main className={(styles as any).background}>
      <div className={(styles as any).content}>
        {loading && <p>Loading data for eventID: {eventID}...</p>}
        {error && (
          <>
            <h1>Error</h1>
            <p>{error}</p>
          </>
        )}
        {!loading && !error && !data && <p>No results. Stay tuned!</p>}
        {!loading && !error && data && renderRaceComponent(data)}
      </div>
    </main>
  );
};

export default RacePage;
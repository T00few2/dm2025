// app/pages/[category]/[race]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ref, onValue, off } from 'firebase/database';
import { getDb } from '@/app/utils/firebaseClient';
import rawEventMap from '@/app/data/eventMap.json';

import { RaceData, EventMap } from '@/app/types';
import Heat1 from '@/app/components/heat1';
import Heat2 from '@/app/components/heat2';
import Heat3 from '@/app/components/heat3';
import Heat2Live from '@/app/components/heat2_live';
import Heat2Fallback from '@/app/components/heat2fallback';


const eventMap = rawEventMap as EventMap;

const RacePage: React.FC = () => {
  const { category, race } = useParams();

  // Convert any array or undefined to a single string
  const categoryStr = Array.isArray(category) ? category[0] : category ?? '';
  const raceStr = Array.isArray(race) ? race[0] : race ?? '';

  // Lowercase to match JSON keys
  const categoryKey = categoryStr.toLowerCase();
  const raceKey = raceStr.toLowerCase();

  const formattedRaceKey = raceKey === 'heat2_live' ? 'heat2' : raceKey;

  // Get eventID from JSON
  const eventID = eventMap[categoryKey]?.[formattedRaceKey];

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

  const renderRaceComponent = (raceData: RaceData) => {
    if (raceKey === 'heat2') {
      const hasPosition = raceData.racerScores?.some((racer) => 'position' in racer);
      if (hasPosition) {
        return <Heat2Fallback data={raceData} category={category as string} />;
      }
      return <Heat2 data={raceData} category={category as string} />;
    }

    switch (raceKey) {
      case 'heat1':
        return <Heat1 data={raceData} category={category as string} />;
      case 'heat3':
        return <Heat3 data={raceData} category={category as string} />;
      case 'heat2_live':
        return <Heat2Live data={raceData} category={category as string} />;
      default:
        return (
          <div>
            <h1>Unknown Race Type</h1>
            <p>The race type {raceStr} is not recognized.</p>
          </div>
        );
    }
  };

  // Handle invalid eventID
  if (!eventID && !loading) {
    return (
      <main>
        <h1>Invalid Route</h1>
        <p>
          No eventID found for category {categoryStr} and race {raceStr} in
          eventMap.json.
        </p>
      </main>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <main>
        <p>Loading data for eventID: {eventID}...</p>
      </main>
    );
  }

  // Handle error state
  if (error) {
    return (
      <main>
        <h1>Error</h1>
        <p>{error}</p>
      </main>
    );
  }

  // Handle no data state
  if (!data) {
    return (
      <main>
        <p>No results. Stay tuned!</p>
      </main>
    );
  }

  // At this point, data is guaranteed to be non-null
  return (
    <main>
      {/* Render the race-specific component */}
      {renderRaceComponent(data)}
    </main>
  );
};

export default RacePage;

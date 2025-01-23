'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import eventMap from '@/app/data/eventMap.json'; // Adjust import if needed
import styles from './page.module.css';

// Because you used an index signature in your other code, let's keep it here too.
// If each category can have arbitrary race keys, we'll do something like:
type RaceEvents = {
  [raceKey: string]: string;
};

type EventMap = {
  [categoryKey: string]: RaceEvents;
};

// We'll tell TypeScript to treat the JSON as that type:
const typedEventMap = eventMap as EventMap;

export default function Home() {
  const router = useRouter();

  // We'll store the currently selected category, race, etc.
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRace, setSelectedRace] = useState<string>('');

  // The categories are just the top-level keys
  const categories = Object.keys(typedEventMap);

  // If a category is chosen, get the list of races from that category
  let races: string[] = [];
  if (selectedCategory) {
    // Convert to lowercase if needed
    const catKey = selectedCategory.toLowerCase();
    if (typedEventMap[catKey]) {
      // The keys in that object are the race names (like "itt", "sprint", etc.)
      races = Object.keys(typedEventMap[catKey]);
    }
  }

  // Handler for the "Go" button to navigate to /[category]/[race]
  // In your other code, you also lowercased in the dynamic page. 
  // So let's also do that here for consistency:
  function handleGo() {
    if (!selectedCategory || !selectedRace) return;
    const catKey = selectedCategory.toLowerCase();
    const raceKey = selectedRace.toLowerCase();
    router.push(`/${catKey}/${raceKey}`);
  }

  return (
    <div className={styles.page}>
      <h1>Løbsresultater DM2025</h1>
      <p>Resultater findes på <code>/[kategori]/[løb]</code></p>
      <p>
        For eksempel <code>/h50/enkeltstart</code> (or any of your actual keys).
      </p>

      <hr />

      <h2>Vælg kategori og løb</h2>
      <div>
        {/* Category dropdown */}
        <label>
          Kategori:{' '}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              // Reset the race if category changed
              setSelectedRace('');
            }}
          >
            <option value="">-- Vælg kategori --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {/* Race dropdown, depends on category */}
        <label>
          Løb:{' '}
          <select
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">-- Vælg løb --</option>
            {races.map((race) => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {/* Button to navigate */}
        <button onClick={handleGo} disabled={!selectedCategory || !selectedRace}>
          Gå til resultater
        </button>
      </div>
    </div>
  );
}

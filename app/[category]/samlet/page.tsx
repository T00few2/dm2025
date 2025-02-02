'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ref, onValue, off } from 'firebase/database';
import { getDb } from '@/app/utils/firebaseClient';
import rawEventMap from '@/app/data/eventMap.json';
import { RaceData, EventMap, RacerScore } from '@/app/types';
import { Table, Text, Box, Heading, Flex, Image, Stack } from '@chakra-ui/react';

const eventMap = rawEventMap as EventMap;

const SamletPage: React.FC = () => {
  const { category } = useParams();

  // Convert category to string & lowercase key
  const categoryStr = Array.isArray(category) ? category[0] : category ?? '';
  const categoryKey = categoryStr.toLowerCase();
  const formattedCategory = categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);

  // Get eventIDs for heat1, heat2, heat3
  const heatIDs = {
    heat1: eventMap[categoryKey]?.['heat1'],
    heat2: eventMap[categoryKey]?.['heat2'],
    heat3: eventMap[categoryKey]?.['heat3'],
  };

  const [data, setData] = useState<{ [heat: string]: RaceData | null }>({
    heat1: null,
    heat2: null,
    heat3: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!heatIDs.heat1 && !heatIDs.heat2 && !heatIDs.heat3) {
      setLoading(false);
      return;
    }

    const db = getDb();
    const subscriptions: (() => void)[] = [];

    Object.entries(heatIDs).forEach(([heat, eventID]) => {
      if (!eventID) return;

      const dbRef = ref(db, `race_results/${eventID}`);
      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          setData((prev) => ({ ...prev, [heat]: snapshot.exists() ? snapshot.val() : null }));
          setLoading(false);
        },
        () => setLoading(false)
      );

      subscriptions.push(() => off(dbRef, 'value', unsubscribe));
    });

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, [categoryKey]);

  if (loading) {
    return <Text>Loading results...</Text>;
  }

  // Aggregate points per rider
  const totalPoints: Record<string, { name: string; total: number | 'DNF'; heatPoints: number[]; racesPresent: number }> = {};

  Object.entries(data).forEach(([heat, heatData]) => {
    if (!heatData?.racerScores) return;

    heatData.racerScores.forEach((racer: RacerScore) => {
      if (!totalPoints[racer.athleteId]) {
        totalPoints[racer.athleteId] = {
          name: racer.name,
          total: 0, // Initially set to 0, will be updated later
          heatPoints: [0, 0, 0], // Heat 1, Heat 2, Heat 3
          racesPresent: 0, // Track how many heats they were present in
        };
      }

      const heatIndex = Object.keys(heatIDs).indexOf(heat);
      totalPoints[racer.athleteId].heatPoints[heatIndex] = racer.leaguePoints ?? 0;
      totalPoints[racer.athleteId].racesPresent += 1; // Mark the rider as present in this heat
    });
  });

  // Assign DNF only if a rider is missing from at least one heat
  Object.values(totalPoints).forEach((racer) => {
    if (racer.racesPresent < 3) {
      racer.total = 'DNF';
    } else {
      racer.total = racer.heatPoints.reduce((acc, points) => acc + points, 0);
    }
  });

  // Sort by total league points (descending), but place DNF riders at the bottom
  const sortedRacers = Object.values(totalPoints).sort((a, b) => {
    if (a.total === 'DNF' && b.total !== 'DNF') return 1;
    if (b.total === 'DNF' && a.total !== 'DNF') return -1;
    if (typeof b.total === 'number' && typeof a.total === 'number') {
      if (b.total !== a.total) {
        return b.total - a.total; // Sort by total points (descending)
      }
      return b.heatPoints[2] - a.heatPoints[2]; // If tie, sort by Heat 3 points (descending)
    }
    return 0;
  });



  return (
    <Box 
      minH="100vh"
      bgImage="url('/resultat_baggrund.jpg')" 
      bgSize="cover"
      position="relative"
      color="white"
      display="flex"
      flexDirection="column"
    >
      {/* Blue Overlay */}
      <Box 
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bg="rgba(77, 93, 146, 0.5)"
        backdropFilter="blur(5px)"
        zIndex={1}
      />

      <Stack>
        {/* HEADER */}
        <Box position="relative" zIndex={2} textAlign="center" py={6}>
          <Heading color="white" fontWeight="bolder" as="h2" size="7xl">DM e-cykling 2025</Heading>
        </Box>

        {/* PNG Logo in Top Right Corner */}
        <Box position="absolute" top="40px" right="40px" zIndex={10}>
          <Image src="/DCU_Fullcolour_transparent.png" alt="Top Right Logo" width="150px" />
        </Box>

        {/* Table Container */}
        <Flex flex={1} alignItems="center" justifyContent="center" position="relative" zIndex={2} marginTop={6}>
          <Box 
            boxShadow="lg" 
            borderRadius="md" 
            overflow="hidden"
            bg="rgba(255, 255, 255, 0.1)" 
            backdropFilter="blur(10px)"
          >
            <Table.Root color='white' size="lg" minW="80vw" maxW="90vw" minH="40vh" textStyle="xl">
              <Table.Header textStyle="2xl">
                <Table.Row bg="rgb(31, 35, 62)" color="white">
                  <Table.ColumnHeader color='white' textAlign="right" width="10%" px="5px">Samlet</Table.ColumnHeader>
                  <Table.ColumnHeader color='white' textAlign="left" width="25%" px="5px">{formattedCategory}</Table.ColumnHeader>
                  <Table.ColumnHeader color='white' textAlign="center" width="15%">Heat 1</Table.ColumnHeader>
                  <Table.ColumnHeader color='white' textAlign="center" width="15%">Heat 2</Table.ColumnHeader>
                  <Table.ColumnHeader color='white' textAlign="center" width="15%">Heat 3</Table.ColumnHeader>
                  <Table.ColumnHeader color='white' textAlign="center" width="20%">Samlet resultat</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedRacers.map((racer, index) => (
                  <Table.Row key={racer.name} bg={index % 2 === 0 ? 'rgb(0, 5, 35)' : 'rgb(31, 35, 62)'}>
                    <Table.Cell textAlign="right" px="15px">
                      <Text>{index + 1}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="left">
                      <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{racer.name}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text>{racer.heatPoints[0] && racer.heatPoints[0] > 0 ? racer.heatPoints[0] : '-'}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text>{racer.heatPoints[1] && racer.heatPoints[1] > 0 ? racer.heatPoints[1] : '-'}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text>{racer.heatPoints[2] && racer.heatPoints[2] > 0 ? racer.heatPoints[2] : '-'}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                    <Text fontWeight="bold">
                      {typeof racer.total === 'number' && racer.total > 0 ? racer.total : racer.total === 'DNF' ? 'DNF' : '-'}
                    </Text>
                  </Table.Cell>

                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Flex>

        {/* Bottom Banner */}
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" mt={10}>
          <Image 
            src="/dm_banner.PNG"
            alt="Bottom Banner"
            width="50%"
            maxW="60%"
            objectFit="contain"
            zIndex={2}
            mb={6}
            opacity={0.5}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default SamletPage;

'use client';

import React, { memo } from 'react';
import { RaceData, RacerScore } from '@/app/types';
import { Table, Text, Box, Heading, Flex, Image, Stack } from '@chakra-ui/react';

type Heat2Props = {
  data: RaceData;
  category: string;
};

const Heat2: React.FC<Heat2Props> = ({ data, category}) => {
  const { racerScores = [], segmentScores = [] } = data;

  // Aggregate split points per racer
  const splits = segmentScores.reduce((acc, segment, segmentIndex) => {
    if (Array.isArray(segment.fal)) {
      segment.fal.forEach((fal) => {
        if (!acc[fal.athleteId]) {
          acc[fal.athleteId] = { name: fal.name, splits: [] };
        }
        acc[fal.athleteId].splits[segmentIndex] = fal.points;
      });
    }

    // If it's the last segment, award finPoints from racerScores
    if (segmentIndex === segmentScores.length - 1) {
      racerScores.forEach((racer) => {
        if (acc[racer.athleteId]) {
          // Add finPoints to the last segment
          acc[racer.athleteId].splits[segmentIndex] =
            (acc[racer.athleteId].splits[segmentIndex] ?? 0) + (racer.finPoints ?? 0);
        }
      });
    }

    return acc;
  }, {} as Record<string, { name: string; splits: number[] }>);

  // Sort racers by total points (descending)
  const sortedRacers = [...racerScores].sort((a, b) => (b.pointTotal ?? 0) - (a.pointTotal ?? 0));

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
        <Image
          src="/DCU_Fullcolour_transparent.png"
          alt="Top Right Logo"
          position="absolute"
          top="40px"
          right="40px"
          width="150px"
          zIndex={10}
        />
        <Flex flex={1} alignItems="center" justifyContent="center" position="relative" zIndex={2} marginTop={6}>
          <Box 
            boxShadow="lg" 
            borderRadius="md" 
            overflow="hidden"
            bg="rgba(255, 255, 255, 0.1)" 
            backdropFilter="blur(10px)"
          >
            <Table.Root color='white' size="lg" minW="80vw" maxW="90vw" minH="40vh" textStyle="xl">
              <Table.Header color='white' textStyle="2xl">
                <Table.Row bg="rgb(31, 35, 62)" color="white">
                  <Table.ColumnHeader color='white' textAlign="right" width="10%" px="5px">Heat 2</Table.ColumnHeader>
                  <Table.ColumnHeader color='white' textAlign="left" width="15%" px="5px">{category.charAt(0).toUpperCase() + category.slice(1)}</Table.ColumnHeader>
                  {segmentScores.map((segment, index) => (<Table.ColumnHeader color='white' key={index} textAlign="center" width="10%">Spurt {segment.repeat}</Table.ColumnHeader>))}
                  <Table.ColumnHeader color='white' textAlign="center" width="10%">Samlet</Table.ColumnHeader>
                  <Table.ColumnHeader color='white' textAlign="center" width="15%">Resultat Heat 2</Table.ColumnHeader> {/* New column for leaguePoints */}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedRacers.map((racer: RacerScore, index: number) => (
                    <Table.Row key={racer.athleteId} bg={index % 2 === 0 ? 'rgb(0, 5, 35)' : 'rgb(31, 35, 62)'}>
                    <Table.Cell textAlign="right" px="15px"><Text>{index + 1}</Text></Table.Cell>
                    <Table.Cell whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" textAlign="left"><Text>{racer.name}</Text></Table.Cell>
                    {segmentScores.map((_, segmentIndex) => (<Table.Cell key={segmentIndex} textAlign="center"><Text>{splits[racer.athleteId]?.splits[segmentIndex] ?? '-'}</Text></Table.Cell>))}
                    <Table.Cell textAlign="center"><Text>{racer.pointTotal && racer.pointTotal > 0 ? racer.pointTotal : '-'}</Text></Table.Cell>
                    <Table.Cell textAlign="center"><Text>{racer.leaguePoints ?? '-'}</Text></Table.Cell>
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

export default memo(Heat2);

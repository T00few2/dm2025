'use client';

import React, { memo } from 'react';
import { RaceData, RacerScore } from '@/app/types';
import { 
  Table, 
  Text, 
  Box, 
  Heading
} from '@chakra-ui/react';
import { millisecondsToDurationTime } from '@/app/utils/timeUtils';

type Heat1Props = {
  data: RaceData;
  category: string;
  
};

const Heat1: React.FC<Heat1Props> = ({ data, category }) => {
  const { racerScores } = data;

  if (!racerScores || !Array.isArray(racerScores)) {
    return <Text>Ingen resultater for enkeltstarten.</Text>;
  }

  // Sort racers by durationMs, placing those without it at the bottom
  const topRacers = [...racerScores]
    .sort((a, b) => {
      const timeA = a.durationMs ?? Number.MAX_VALUE; // Move missing times to the bottom
      const timeB = b.durationMs ?? Number.MAX_VALUE;
      return timeA - timeB;
    })
    .slice(0, 16); // Still only show top 16
  
    return (
      <Box 
        p={4} 
        minH="100vh"
        bgImage="url('/resultat_baggrund.jpg')" 
        bgSize="cover"
        bgPos={'center'}
        position="relative"
        color="white"
      >
        {/* Blue Overlay */}
        <Box 
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(0, 0, 255, 0.5)"
          zIndex={1}
        />
  
        <Box position="relative" zIndex={2} textAlign="center">
          <Heading as="h2" size="lg" mb={4}>
            DM e-cykling 2025
          </Heading>
          <Heading as="h2" size="lg" mb={4}>
            {category.charAt(0).toUpperCase() + category.slice(1)} Heat 1
          </Heading>
          <Table.ScrollArea borderWidth="1px" rounded="md" maxH="80vh">
            <Table.Root stickyHeader size="sm" minW="full" interactive showColumnBorder>
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader textAlign="center" width="50px">
                    #
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="left" bg="bg.subtle">
                    Navn
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Tid</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Resultat Heat 1</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {topRacers.map((racer, index) => (
                  <Table.Row key={racer.athleteId}>
                    <Table.Cell textAlign="center">
                      <Text>{index + 1}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="left" bg="bg.subtle">
                      <Text>{racer.name}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {racer.durationMs !== undefined ? (
                        <Text>{millisecondsToDurationTime(racer.durationMs)}</Text>
                      ) : (
                        <Text>-</Text>
                      )}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text>{racer.leaguePoints ?? '-'}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Box>
      </Box>
    );
  };
  
  export default memo(Heat1);
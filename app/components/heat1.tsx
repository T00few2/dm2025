'use client';

import React, { memo } from 'react';
import { RaceData } from '@/app/types';
import { 
  Table, 
  Text, 
  Box, 
  Heading,
  Flex
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
          bg="rgba(0, 0, 255, 0.5)"
          zIndex={1}
        />
  
        {/* HEADER - Fixed at the top */}
        <Box 
          position="relative" 
          zIndex={2} 
          textAlign="center" 
          py={6} 
          
        >
          <Heading color={'black'} fontWeight={'bolder'} as="h2" size="7xl">
            DM e-cykling 2025
          </Heading>
          <Heading color={'black'} fontWeight={'bolder'} as="h2" size="5xl">
            {category.charAt(0).toUpperCase() + category.slice(1)} Heat 1
          </Heading>
        </Box>
  
        {/* FLEX CONTAINER - Centers the table */}
        <Flex 
          flex={1} 
          alignItems="center"
          justifyContent="center"
          position="relative" 
          zIndex={2} 
        >
          <Box>
              <Table.Root size="md" minW="70vw" minH='40vh' textStyle={'xl'} striped colorPalette={'blue'}>
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader textAlign="center" width="50px">#</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="left" bg="bg.subtle">Navn</Table.ColumnHeader>
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
                      <Table.Cell textAlign="left">
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
            
          </Box>
        </Flex>
      </Box>
    );
  };
  
  export default memo(Heat1);
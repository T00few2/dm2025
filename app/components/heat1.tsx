'use client';

import React, { memo } from 'react';
import { EventMap, RaceData, RacerScore } from '@/app/types';
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
  race: string;
};

const Heat1: React.FC<Heat1Props> = ({ data, category, race }) => {
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
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        DM e-cykling 2025 : {category.charAt(0).toUpperCase() + category.slice(1)} Heat 1
      </Heading>
      <Table.ScrollArea borderWidth="1px" rounded="md" maxH={'80vh'}>
        <Table.Root stickyHeader size="sm" minW="full" interactive showColumnBorder>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              <Table.ColumnHeader textAlign="center" width="50px">
                #
              </Table.ColumnHeader>
              <Table.ColumnHeader 
                textAlign="left" 
                bg="bg.subtle"
              >
                Navn
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Tid</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Resultat Heat 1</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {topRacers.map((racer: RacerScore, index) => {
              const formattedDuration = racer.durationMs !== undefined 
                ? millisecondsToDurationTime(racer.durationMs) 
                : '-';

              return (
                <Table.Row key={racer.athleteId}>
                  <Table.Cell textAlign="center">
                    <Text>{index + 1}</Text> {/* Placement number */}
                  </Table.Cell>
                  <Table.Cell textAlign="left" bg="bg.subtle">
                    <Text>{racer.name}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {formattedDuration !== '-' ? (
                      <>
                        {formattedDuration.split('.')[0]}
                        {formattedDuration.includes('.') && (
                          <Text as="span" fontSize="xs" ml={1}>
                            .{formattedDuration.split('.')[1]}
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text>-</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Text>{racer.leaguePoints ?? '-'}</Text> {/* Show "-" if missing */}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};

export default memo(Heat1);

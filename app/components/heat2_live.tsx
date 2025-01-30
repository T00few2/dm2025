'use client';

import React, { memo } from 'react';
import { RaceData, RacerScore } from '@/app/types';
import { Table, Text, Box } from '@chakra-ui/react';

type SimpleTableProps = {
  data: RaceData;
  category: string;
};

const Heat2Live: React.FC<SimpleTableProps> = ({ data, category }) => {
  const { racerScores = [] } = data;

  // Format category name with first letter capitalized
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  // Sort racers by total points (descending)
  const sortedRacers = [...racerScores].sort((a, b) => (b.pointTotal ?? 0) - (a.pointTotal ?? 0));

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      bg="black"  // Background for better contrast in OBS
    >
      <Table.Root 
        size="lg" 
        minW="80vw" 
        maxW="90vw" 
        color="white"
        borderWidth="2px" 
        borderColor="gray.700" 
      >
        <Table.Header textStyle="2xl">
          <Table.Row bg="rgb(31, 35, 62)">
            <Table.ColumnHeader textAlign="right" width="10%" px="5px">Heat 2</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="left" width="40%" px="5px">{formattedCategory}</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center" width="20%">Samlet</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sortedRacers.map((racer: RacerScore, index: number) => (
            <Table.Row key={racer.athleteId} bg={index % 2 === 0 ? 'rgb(0, 5, 35)' : 'rgb(31, 35, 62)'}>
              <Table.Cell textAlign="right" px="15px">
                <Text fontSize="2xl">{index + 1}</Text>
              </Table.Cell>
              <Table.Cell textAlign="left">
                <Text fontSize="2xl">{racer.name}</Text>
              </Table.Cell>
              <Table.Cell textAlign="center">
                <Text fontSize="2xl">{racer.pointTotal ?? '-'}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default memo(Heat2Live);

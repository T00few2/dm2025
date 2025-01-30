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
      bg="transparent"
    >
      <Table.Root 
        size="lg" 
        minW="80vw" 
        maxW="90vw" 
        color="white"
        borderWidth="2px" 
        borderColor="gray.700" 
      >
        <Table.Header color='white' textStyle="2xl">
          <Table.Row color='white' bg="rgb(31, 35, 62)">
            <Table.ColumnHeader whiteSpace="nowrap" color='white' textAlign="right" width="15%" px="5px">Heat 2</Table.ColumnHeader>
            <Table.ColumnHeader color='white' textAlign="left" width="55%" px="5px">{formattedCategory}</Table.ColumnHeader>
            <Table.ColumnHeader color='white' textAlign="center" width="25%">Samlet</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedRacers.map((racer: RacerScore, index: number) => (
            <Table.Row key={racer.athleteId} bg={index % 2 === 0 ? 'rgb(0, 5, 35)' : 'rgb(31, 35, 62)'}>
              <Table.Cell textAlign="right" px="15px">
                <Text fontSize="2xl">{index + 1}</Text>
              </Table.Cell>
              <Table.Cell textAlign="left">
                <Text fontSize="2xl"  whiteSpace="nowrap" textOverflow="ellipsis">
                  {(() => {
                    const nameParts = racer.name.split(" ");
                    if (nameParts.length > 1) {
                      return `${nameParts[0].charAt(0).toUpperCase()}. ${nameParts.slice(1).join(" ")}`;
                    }
                    return racer.name; // Fallback if there's only one name part
                  })()}
                </Text>
              </Table.Cell>
              <Table.Cell textAlign="center">
                <Text fontSize="2xl">{racer.pointTotal && racer.pointTotal > 0 ? racer.pointTotal : '-'}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default memo(Heat2Live);

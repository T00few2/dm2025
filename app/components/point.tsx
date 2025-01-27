'use client';

import React, { memo, useState } from 'react';
import { RaceData, RacerScore } from '@/app/types';
import { 
  Table, 
  Text, 
  Box, 
  Heading, 
  createListCollection,
  Flex,
} from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';

type EnkeltstartProps = {
  data: RaceData;
  category: string;
  race: string;
};

const Enkeltstart: React.FC<EnkeltstartProps> = ({ data, category, race }) => {
  const { racerScores, segmentScores } = data;

  const [selectedSegment, setSelectedSegment] = useState<string>('All'); // State is a single string

  if (!racerScores || !Array.isArray(racerScores)) {
    return <Text>Ingen resultater for pointløbet.</Text>;
  }

  if (!segmentScores || !Array.isArray(segmentScores)) {
    return <Text>Ingen resultater for pointløbet.</Text>;
  }

  // Create a collection for segment selection
  const segmentOptions = createListCollection({
    items: [
      { label: 'All', value: 'All' },
      { label: 'Point (Total)', value: 'Total' },
      ...segmentScores.map((segment, index) => ({
        label: `${segment.name} [${segment.repeat}]`,
        value: index.toString(),
      })),
    ],
  });

  // Aggregate all split points per racer
  const splits = segmentScores.reduce((acc, segment, segmentIndex) => {
    if (Array.isArray(segment.fal)) { // Ensure `segment.fal` is an array
      segment.fal.forEach((fal) => {
        if (!acc[fal.athleteId]) {
          acc[fal.athleteId] = { name: fal.name, splits: [] };
        }
        acc[fal.athleteId].splits[segmentIndex] = fal.points; // Assign fal.points
      });
    }
    return acc;
  }, {} as Record<string, { name: string; splits: number[] }>);

  // Sort racers based on the selected segment
  const sortedRacers = [...racerScores].sort((a, b) => {
    if (selectedSegment === 'All' || selectedSegment === 'Total') {
      const pointsA = a.pointTotal ?? 0;
      const pointsB = b.pointTotal ?? 0;
      return pointsB - pointsA; // Sort by total points (descending)
    } else {
      const segmentIndex = parseInt(selectedSegment, 10);
      const pointsA = splits[a.athleteId]?.splits[segmentIndex] ?? 0;
      const pointsB = splits[b.athleteId]?.splits[segmentIndex] ?? 0;
      return pointsB - pointsA; // Sort by segment points (descending)
    }
  });

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        DM e-cykling 2025 : {category.charAt(0).toUpperCase() + category.slice(1)} {race}
      </Heading>
      <SelectRoot
        collection={segmentOptions}
        size="sm"
        width="320px"
        onValueChange={(details) => {
          const value = Array.isArray(details.value) ? details.value[0] : details.value;
          setSelectedSegment(value);
        }}
      >
        <Flex align="center" mb={4}>
          <SelectLabel mr={4}>Segment</SelectLabel>
          <SelectTrigger width={'300px'}>
            <SelectValueText placeholder="Select segment" />
          </SelectTrigger>
          <SelectContent>
            {segmentOptions.items.map((option) => (
              <SelectItem item={option} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Flex>
      </SelectRoot>
      <Table.ScrollArea borderWidth="1px" rounded="md" maxH={'80vh'}>
        <Table.Root stickyHeader size="sm" minW="full" interactive showColumnBorder>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              <Table.ColumnHeader 
                textAlign="left" 
                position="sticky" 
                left="0" 
                bg="bg.subtle"
              >
                Navn
              </Table.ColumnHeader>
              {selectedSegment === 'All' &&
                segmentScores.map((segment, index) => (
                  <Table.ColumnHeader key={index} textAlign="center">
                    {segment.name} [{segment.repeat}]
                  </Table.ColumnHeader>
                ))}
              {(selectedSegment === 'All' || selectedSegment === 'Total') && (
                <Table.ColumnHeader textAlign="center">Point (Total)</Table.ColumnHeader>
              )}
              {selectedSegment !== 'All' && selectedSegment !== 'Total' && (
                <Table.ColumnHeader textAlign="center">
                  {segmentScores[parseInt(selectedSegment, 10)]?.name} [
                  {segmentScores[parseInt(selectedSegment, 10)]?.repeat}]
                </Table.ColumnHeader>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedRacers.map((racer: RacerScore) => {
              const racerSplits = splits[racer.athleteId]?.splits || [];
              return (
                <Table.Row key={racer.athleteId}>
                  <Table.Cell 
                    textAlign="left" 
                    position="sticky" 
                    left="0" 
                    zIndex="1" 
                    bg="bg.subtle"
                  >
                    <Text>{racer.name}</Text>
                  </Table.Cell>
                  {selectedSegment === 'All' &&
                    segmentScores.map((_, index) => (
                      <Table.Cell key={index} textAlign="center">
                        <Text>
                          {racerSplits[index] !== undefined ? racerSplits[index] : '-'}
                        </Text>
                      </Table.Cell>
                    ))}
                  {(selectedSegment === 'All' || selectedSegment === 'Total') && (
                    <Table.Cell textAlign="center">
                      <Text>{racer.pointTotal ?? '-'}</Text>
                    </Table.Cell>
                  )}
                  {selectedSegment !== 'All' && selectedSegment !== 'Total' && (
                    <Table.Cell textAlign="center">
                      <Text>
                        {racerSplits[parseInt(selectedSegment, 10)] ?? '-'}
                      </Text>
                    </Table.Cell>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};

export default memo(Enkeltstart);

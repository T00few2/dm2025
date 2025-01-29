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

type Heat2Props = {
  data: RaceData;
  category: string;
  race: string;
};

const Heat2: React.FC<Heat2Props> = ({ data, category, race }) => {
  const { racerScores = [], segmentScores = [] } = data;

  // Default value as an array of strings
  const [selectedSegment, setSelectedSegment] = useState<string[]>(['Total']);

  // Create a collection for segment selection
  const segmentOptions = createListCollection({
    items: [
      { label: 'All', value: 'All' },
      { label: 'Total', value: 'Total' },
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
    const selectedValue = selectedSegment[0]; // Get the first selected value
    if (selectedValue === 'All' || selectedValue === 'Total') {
      const pointsA = a.pointTotal ?? 0;
      const pointsB = b.pointTotal ?? 0;
      return pointsB - pointsA; // Sort by total points (descending)
    } else {
      const segmentIndex = parseInt(selectedValue, 10);
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
        value={selectedSegment} // Use array of strings
        onValueChange={(details) => {
          const value = Array.isArray(details.value) ? details.value : [details.value];
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
              {selectedSegment[0] === 'All' &&
                segmentScores.map((segment, index) => (
                  <Table.ColumnHeader key={index} textAlign="center">
                    {segment.name} [{segment.repeat}]
                  </Table.ColumnHeader>
                ))}
              {(selectedSegment[0] === 'All' || selectedSegment[0] === 'Total') && (
                <Table.ColumnHeader textAlign="center">Total</Table.ColumnHeader>
              )}
              {selectedSegment[0] !== 'All' && selectedSegment[0] !== 'Total' && (
                <Table.ColumnHeader textAlign="center">
                  {segmentScores[parseInt(selectedSegment[0], 10)]?.name} [
                  {segmentScores[parseInt(selectedSegment[0], 10)]?.repeat}]
                </Table.ColumnHeader>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedRacers.length > 0 ? (
              sortedRacers.map((racer: RacerScore) => {
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
                    {selectedSegment[0] === 'All' &&
                      segmentScores.map((_, index) => (
                        <Table.Cell key={index} textAlign="center">
                          <Text>
                            {racerSplits[index] !== undefined ? racerSplits[index] : '-'}
                          </Text>
                        </Table.Cell>
                      ))}
                    {(selectedSegment[0] === 'All' || selectedSegment[0] === 'Total') && (
                      <Table.Cell textAlign="center">
                        <Text>{racer.pointTotal ?? '-'}</Text>
                      </Table.Cell>
                    )}
                    {selectedSegment[0] !== 'All' && selectedSegment[0] !== 'Total' && (
                      <Table.Cell textAlign="center">
                        <Text>
                          {racerSplits[parseInt(selectedSegment[0], 10)] ?? '-'}
                        </Text>
                      </Table.Cell>
                    )}
                  </Table.Row>
                );
              })
            ) : (
              // Render 16 rows with "-" when there are no results
              Array.from({ length: 16 }).map((_, rowIndex) => (
                <Table.Row key={`placeholder-${rowIndex}`}>
                  <Table.Cell
                    textAlign="left"
                    position="sticky"
                    left="0"
                    zIndex="1"
                    bg="bg.subtle"
                  >
                    <Text>-</Text>
                  </Table.Cell>
                  {selectedSegment[0] === 'All' &&
                    segmentScores.map((_, index) => (
                      <Table.Cell key={`placeholder-segment-${rowIndex}-${index}`} textAlign="center">
                        <Text>-</Text>
                      </Table.Cell>
                    ))}
                  {(selectedSegment[0] === 'All' || selectedSegment[0] === 'Total') && (
                    <Table.Cell textAlign="center">
                      <Text>-</Text>
                    </Table.Cell>
                  )}
                  {selectedSegment[0] !== 'All' && selectedSegment[0] !== 'Total' && (
                    <Table.Cell textAlign="center">
                      <Text>-</Text>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>

        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};

export default memo(Heat2);

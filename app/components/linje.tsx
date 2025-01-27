'use client';

import React, { memo, useState } from 'react';
import { RaceData, RacerScore } from '@/app/types';
import { 
  Table, 
  Text, 
  Box, 
  Heading, 
  createListCollection ,
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
import { parseDurationTime } from '@/app/utils/timeUtils';

type EnkeltstartProps = {
  data: RaceData;
  category: string;
  race: string;
};

const Enkeltstart: React.FC<EnkeltstartProps> = ({ data, category, race }) => {
  const { racerScores, segmentScores } = data;

  const [selectedSegment, setSelectedSegment] = useState<string>('All'); // State is a single string

  if (!racerScores || !Array.isArray(racerScores)) {
    return <Text>Ingen resultater for linjeløbet.</Text>;
  }
  console.log(racerScores)

  if (!segmentScores || !Array.isArray(segmentScores)) {
    return <Text>Ingen resultater for linjeløbet.</Text>;
  }

  // Create a collection for segment selection
  const segmentOptions = createListCollection({
    items: [
      { label: 'All', value: 'All' },
      ...segmentScores.map((segment, index) => ({
        label: `${segment.name} [${segment.repeat}]`,
        value: index.toString(),
      })),
    ],
  });

  // Aggregate all split times per racer
  const splits = segmentScores.reduce((acc, segment, segmentIndex) => {
    if (Array.isArray(segment.fal)) { // Ensure `segment.fal` is an array
      segment.fal.forEach((fal) => {
        if (!acc[fal.athleteId]) {
          acc[fal.athleteId] = { name: fal.name, splits: [] };
        }
        acc[fal.athleteId].splits[segmentIndex] = fal.eventTimeDisplay;
      });
    }
    return acc;
  }, {} as Record<string, { name: string; splits: string[] }>);

  // Sort racers based on the selected segment
  const sortedRacers = [...racerScores].sort((a, b) => {
    if (selectedSegment === 'All') {
      const durationA = parseDurationTime(a.durationTime);
      const durationB = parseDurationTime(b.durationTime);
      return durationA - durationB;
    } else {
      const segmentIndex = parseInt(selectedSegment, 10);
      const timeA = parseDurationTime(splits[a.athleteId]?.splits[segmentIndex] || '99:99:99');
      const timeB = parseDurationTime(splits[b.athleteId]?.splits[segmentIndex] || '99:99:99');
      return timeA - timeB;
    }
  });

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        {category} {race}
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
        <SelectLabel mr={4}>Mellemtider</SelectLabel>
        <SelectTrigger width={'300px'}>
        <SelectValueText placeholder="Vælg mellemtid" />
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
        >Navn</Table.ColumnHeader>
              {selectedSegment === 'All'
                ? segmentScores.map((segment, index) => (
                    <Table.ColumnHeader key={index} textAlign="center">
                      {segment.name} [{segment.repeat}]
                    </Table.ColumnHeader>
                  ))
                : (
                    <Table.ColumnHeader textAlign="center">
                      {segmentScores[parseInt(selectedSegment, 10)]?.name} [
                      {segmentScores[parseInt(selectedSegment, 10)]?.repeat}]
                    </Table.ColumnHeader>
                  )}
              {selectedSegment === 'All' && (
                <>
                  <Table.ColumnHeader textAlign="center">Tid</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Point</Table.ColumnHeader>
                </>
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
                  {selectedSegment === 'All'
                    ? segmentScores.map((_, index) => (
                        <Table.Cell key={index} textAlign="center">
                          <Text>
                            {racerSplits[index]?.split('.')[0] || '-'}
                            {racerSplits[index]?.includes('.') && (
                              <Text as="span" fontSize="xs" ml={1}>
                                .{racerSplits[index]?.split('.')[1]}
                              </Text>
                            )}
                          </Text>
                        </Table.Cell>
                      ))
                    : (
                        <Table.Cell textAlign="center">
                          <Text>
                            {racerSplits[parseInt(selectedSegment, 10)]?.split('.')[0] || '-'}
                            {racerSplits[parseInt(selectedSegment, 10)]?.includes('.') && (
                              <Text as="span" fontSize="xs" ml={1}>
                                .{racerSplits[parseInt(selectedSegment, 10)]?.split('.')[1]}
                              </Text>
                            )}
                          </Text>
                        </Table.Cell>
                      )}
                  {selectedSegment === 'All' && (
  <>
    <Table.Cell textAlign="center">
      <Text>
        {racer.durationTime === 'N/A' ? '-' : racer.durationTime.split('.')[0]}
        {racer.durationTime !== 'N/A' && racer.durationTime.includes('.') && (
          <Text as="span" fontSize="xs" ml={1}>
            .{racer.durationTime.split('.')[1]}
          </Text>
        )}
      </Text>
    </Table.Cell>
    <Table.Cell textAlign="center">
      <Text>{racer.durationTime === 'N/A' ? '-' : racer.leaguePoints}</Text>
    </Table.Cell>
  </>
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

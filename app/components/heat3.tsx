'use client';

import React, { memo } from 'react';
import { RaceData } from '@/app/types';
import { 
  Table, 
  Text, 
  Box, 
  Heading,
  Flex,
  Image,
  Stack
} from '@chakra-ui/react';
import { millisecondsToDurationTime } from '@/app/utils/timeUtils';

type Heat3Props = {
  data: RaceData;
  category: string;
  
};

const Heat3: React.FC<Heat3Props> = ({ data, category }) => {
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
          bg="rgba(77, 93, 146, 0.5)"
          backdropFilter="blur(5px)"
          zIndex={1}
        />
      <Stack>
        {/* HEADER - Fixed at the top */}
        <Box 
          position="relative" 
          zIndex={2} 
          textAlign="center" 
          py={6} 
        >
          <Heading color={'black'} fontWeight={'bolder'} as="h2" size="7xl">DM e-cykling 2025</Heading>
          {/*<Heading color={'black'} fontWeight={'bolder'} as="h2" size="5xl">
            {category.charAt(0).toUpperCase() + category.slice(1)} Heat 1
          </Heading> */}
        </Box>

         {/* PNG Image in Top Right Corner */}
      <Image
        src="/DCU_Fullcolour_transparent.png" // Change this to your actual image path
        alt="Top Right Logo"
        position="absolute"
        top="40px"
        right="40px"
        width={'150px'}
        zIndex={10}
      />
  
        {/* FLEX CONTAINER - Centers the table */}
        <Flex 
          flex={1} 
          alignItems="center"
          justifyContent="center"
          position="relative" 
          zIndex={2} 
          marginTop={6}
        >
          <Box 
            boxShadow="lg" // Large shadow
            borderRadius="md" // Rounded corners
            overflow="hidden" // Ensures the shadow applies correctly
            bg="rgba(255, 255, 255, 0.1)" // Semi-transparent white background
            backdropFilter="blur(10px)" // Adds a frosted-glass effect
          >
              <Table.Root size='lg' minW="70vw" maxW='90vw' minH='40vh' textStyle={'xl'} >
                <Table.Header textStyle={'2xl'}>
                  <Table.Row bg='rgb(31, 35, 62)' color="white">
                    <Table.ColumnHeader textAlign="right" width='10%' px='5px'>Heat 3</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="left" width='25%' px='5px'>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" width='20%'>Tid</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" width='20%'>Forskel</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" width='25%'>Resultat Heat 3</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {topRacers.map((racer, index) => (
                    <Table.Row key={racer.athleteId} bg={index % 2 === 0 ? 'rgb(0, 5, 35)' : 'rgb(31, 35, 62)'}>
                      <Table.Cell textAlign="right" px='15px'>
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
                      <Table.Cell textAlign="center"> {/* New Cell for Time Difference */}
                      {index === 0 ? (
                          <Text>-</Text> // First row shows "-"
                        ) : (
                          <Text>+ {racer.timeDifference ?? '-'}</Text> // Other rows show "+ timeDifference"
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
          <Box 
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          mt={10} // Adds spacing between table and banner
          
          >
            <Image 
              src="/dm_banner.png" // Replace with actual image path
              alt="Bottom Banner"
              width="50%" // Adjust the size as needed
              maxW="60%" // Ensures it doesn’t get too large
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
  
  export default memo(Heat3);
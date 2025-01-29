'use client';

import { Box, Heading, Table, Text, Flex, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import eventMap from '@/app/data/eventMap.json'; // Adjust import if needed

type RaceEvents = {
  [raceKey: string]: string;
};

type EventMap = {
  [categoryKey: string]: RaceEvents;
};

const typedEventMap = eventMap as EventMap;

export default function Home() {
  const categories = Object.keys(typedEventMap);

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
          <Heading color="black" fontWeight="bolder" as="h2" size="7xl">DM e-cykling 2025</Heading>
          <Heading color="black" fontWeight="bolder" as="h2" size="4xl">Løbsresultater</Heading>
        </Box>

        {/* PNG Logo in Top Right Corner */}
        <Box position="absolute" top="40px" right="40px" zIndex={10}>
          <img src="/DCU_Fullcolour_transparent.png" alt="Top Right Logo" width="150px" />
        </Box>

        {/* Table Container */}
        <Flex flex={1} alignItems="center" justifyContent="center" position="relative" zIndex={2} marginTop={6}>
          <Box 
            boxShadow="lg" 
            borderRadius="md" 
            overflow="hidden"
            bg="rgba(255, 255, 255, 0.1)" 
            backdropFilter="blur(10px)"
          >
            <Table.Root size="lg" minW="80vw" maxW="90vw" minH="40vh" textStyle="xl">
              <Table.Header textStyle="2xl">
                <Table.Row bg="rgb(31, 35, 62)" color="white">
                  <Table.ColumnHeader textAlign="left" px="25px" width = '40%'>Kategori</Table.ColumnHeader>
                  {Object.keys(typedEventMap[categories[0]]).map((race) => (
                    <Table.ColumnHeader key={race} textAlign="center" width = '15%'>{race.replace(/heat(\d+)/i, 'Heat $1')}</Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
  {categories.map((category, catIndex) => {
    // Capitalize first letter of category
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    return (
      <Table.Row key={catIndex} bg={catIndex % 2 === 0 ? 'rgb(0, 5, 35)' : 'rgb(31, 35, 62)'}>
        <Table.Cell textAlign="left" px="25px">
          <Text fontWeight="bold">{formattedCategory}</Text>
        </Table.Cell>
        {Object.keys(typedEventMap[category]).map((race, raceIndex) => {
          return (
            <Table.Cell key={raceIndex} textAlign="center">
              <Link href={`/${category.toLowerCase()}/${race.toLowerCase()}`} passHref>
                <Text color="white" _hover={{ textDecoration: 'underline' }}>Link</Text>
              </Link>
            </Table.Cell>
          );
        })}
      </Table.Row>
    );
  })}
</Table.Body>

            </Table.Root>
          </Box>
        </Flex>

        {/* Bottom Banner */}
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" mt={10}>
          <img 
            src="/dm_banner.PNG"
            alt="Bottom Banner"
            width="50%"
            style={{ maxWidth: "60%", objectFit: "contain", zIndex: 2, marginBottom: "6px", opacity: 0.5 }}
          />
        </Box>
      </Stack>
    </Box>
  );
}

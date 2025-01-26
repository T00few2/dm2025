'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  createListCollection,
} from '@chakra-ui/react';
import {
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  SelectLabel,
} from '@/components/ui/select';
import eventMap from '@/app/data/eventMap.json'; // Adjust import if needed

type RaceEvents = {
  [raceKey: string]: string;
};

type EventMap = {
  [categoryKey: string]: RaceEvents;
};

const typedEventMap = eventMap as EventMap;

export default function Home() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRace, setSelectedRace] = useState<string>('');

  const categories = Object.keys(typedEventMap);

  let races: string[] = [];
  if (selectedCategory) {
    const catKey = selectedCategory.toLowerCase();
    if (typedEventMap[catKey]) {
      races = Object.keys(typedEventMap[catKey]);
    }
  }

  const categoryCollection = createListCollection({
    items: categories.map((cat) => ({
      label: cat,
      value: cat,
    })),
  });

  const raceCollection = createListCollection({
    items: races.map((race) => ({
      label: race,
      value: race,
    })),
  });

  function handleGo() {
    if (!selectedCategory || !selectedRace) return;
    const catKey = selectedCategory.toLowerCase();
    const raceKey = selectedRace.toLowerCase();
    router.push(`/${catKey}/${raceKey}`);
  }

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      p={4} 
       // Optional background color
    >
      <Box maxW="600px" p={6} bg="red" shadow="md" borderRadius="md">
        <Heading fontWeight={'bolder'} as="h1" size="2xl" mb={6} textAlign="center">
          DM e-cykling 2025 - Løbsresultater
        </Heading>
        <Heading as="h2" size="xl" mb={4} textAlign="center">
          Vælg kategori og løb
        </Heading>

        <Stack gap={5} width="320px" mx="auto" mb={4}>
          {/* Category Select */}
          <SelectRoot
            size="md"
            collection={categoryCollection}
            onValueChange={(details) => {
              const value = Array.isArray(details.value) ? details.value[0] : details.value;
              setSelectedCategory(value);
              setSelectedRace(''); // Reset race when category changes
            }}
          >
            
            <SelectLabel fontWeight={'bold'}>Kategori</SelectLabel>
            <SelectTrigger>
              <SelectValueText fontWeight={'bold'} color={'white'} placeholder="-- Vælg kategori --" />
            </SelectTrigger>
            <SelectContent>
              {categoryCollection.items.map((category) => (
                <SelectItem item={category} key={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>

          {/* Race Select */}
          <SelectRoot
            size="md"
            collection={raceCollection}
            onValueChange={(details) => {
              const value = Array.isArray(details.value) ? details.value[0] : details.value;
              setSelectedRace(value);
            }}
            disabled={!selectedCategory}
          >
            <SelectLabel fontWeight={'bold'}>Løb</SelectLabel>
            <SelectTrigger>
              <SelectValueText fontWeight={'bold'} color={'white'} placeholder="-- Vælg løb --" />
            </SelectTrigger>
            <SelectContent>
              {raceCollection.items.map((race) => (
                <SelectItem item={race} key={race.value}>
                  {race.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Stack>

        <Button
          colorScheme="red"
          onClick={handleGo}
          disabled={!selectedCategory || !selectedRace}
          w="full"
          fontWeight={'bold'}
        >
          Gå til resultater
        </Button>
      </Box>
    </Flex>
  );
}

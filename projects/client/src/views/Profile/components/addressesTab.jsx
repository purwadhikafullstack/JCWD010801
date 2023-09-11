import React from 'react';
import {
  Box,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

const AddressesTab = ({ addresses }) => {
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box>
      <VStack spacing={3} mt={4} alignItems="flex-start">
        {addresses.map((address, index) => (
          <Box
            key={index}
            p={3}
            borderRadius="md"
            _hover={{ backgroundColor: hoverBgColor, cursor: 'pointer' }} // Efek hover
          >
            <Text fontWeight="bold">{address.street}</Text>
            <Text>{address.city}</Text>
            <Text>{address.state}</Text>
            <Text>{address.zipCode}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default AddressesTab;

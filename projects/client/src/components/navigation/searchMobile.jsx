import {
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { LuSearch } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";

export const SearchMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchRef = useRef();
  // const products = ['product 1', 'product 2', 'product 3'];
  const products = [];

  return (
    <>
      <Button
        onClick={onOpen}
        bgColor={"white"}
        rounded={"full"}
        display={{ base: "block", md: "none" }}
      >
        <Icon
          as={LuSearch}
          display={{ base: "block", sm: "none" }}
          w="5"
          h="5"
          color={"black"}
        />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement={"top"}
        onClose={onClose}
        size={"xs"}
        initialFocusRef={searchRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>
              <Flex alignItems={"center"}>
                <Input
                  ref={searchRef}
                  type={"search"}
                  focusBorderColor="gray.300"
                  w="100%"
                />
                <Button onClick={onClose} bgColor={"white"} rounded={"full"}>
                  <Icon as={RxCross1} color={"black"} w="5" h="5" />
                </Button>
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              {products.length > 0 ? (
                products.map((item, idx) => {
                  return <Text key={idx}>{item}</Text>;
                })
              ) : (
                <Text fontSize={"medium"} fontWeight={"medium"}>
                  Enter a search query...
                </Text>
              )}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};
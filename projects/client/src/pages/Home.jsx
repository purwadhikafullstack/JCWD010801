import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import HomepageView from "../views/Home";
import { Stack } from "@chakra-ui/react"

const Homepage = () => {
  return (
    <Stack w='100vw'>
      <HomepageView/>
    </Stack>
  );
};

export default Homepage;
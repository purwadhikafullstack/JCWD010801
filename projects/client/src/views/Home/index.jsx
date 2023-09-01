import { Banner } from "./banner";
import { Stack } from "@chakra-ui/react";
import { Features } from "./features";
import { Categories } from "./categories";
import { SUggestion } from "./products";

const HomepageView = () => {
  // return <div>WELCOME TO α MART TEST</div>;
  return (
    <Stack m={'3rem 5rem'} gap ={'4rem'}>
      <Banner/>
      <Features/>
      <Categories/>
      <SUggestion/>
    </Stack>
  )
};

export default HomepageView;
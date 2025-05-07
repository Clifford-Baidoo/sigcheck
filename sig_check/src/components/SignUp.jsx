 import { Box, Stack ,FieldRoot, FieldLabel, Input, Button,Heading } from "@chakra-ui/react";
 import { PasswordInput } from "./ui/password-input";
 
 export default function SignUP(){
     return(
         <Box minH="100vh" display="flex" alignItems="center" p={4} justifyContent="center">
             <Box as="form" minH="50vh" p={8} borderRadius={"md"} boxShadow={"lg"} w={["full","50%"]}>
                 <Stack spacing={10}>
                     <Heading paddingBottom={50}>Welcome to SIG-CHECK</Heading>
                     <FieldRoot>
                        <FieldLabel>First Name</FieldLabel>
                        <Input placeholder="John"/>
                     </FieldRoot>
                     <FieldRoot>
                        <FieldLabel>Last Name</FieldLabel>
                        <Input placeholder="Doe"/>
                     </FieldRoot>
                     <FieldRoot>
                         <FieldLabel>Email</FieldLabel>
                         <Input placeholder="example.email"/>
                     </FieldRoot>
                     <FieldRoot>
                         <FieldLabel>Password</FieldLabel>
                         <PasswordInput placeholder="password"/>
                     </FieldRoot>
                     <Button>
                         Sign Up
                     </Button>
                 </Stack>
             </Box>
         </Box>
     );
 };
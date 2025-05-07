import { Box, Stack ,FieldRoot, FieldLabel, Input, Button,Heading,Link } from "@chakra-ui/react";
import { PasswordInput } from "./ui/password-input";

export default function SignIn(){
    return(
        <Box minH="100vh" display="flex" alignItems="center" p={4} justifyContent="center">
            <Box as="form" minH="50vh" p={8} borderRadius={"md"} boxShadow={"lg"} w={["full","50%"]}>
                <Stack spacing={10}>
                    <Heading paddingBottom={50}>Welcome to SIG-CHECK</Heading>
                    <FieldRoot>
                        <FieldLabel>Email</FieldLabel>
                        <Input placeholder="example.email"/>
                    </FieldRoot>
                    <FieldRoot>
                        <FieldLabel>Password</FieldLabel>
                        <PasswordInput placeholder="password"/>
                    </FieldRoot>
                    <Button>
                        Sign In
                    </Button>
                    <Box>
                    <Link to="/signup">Don't have an account?</Link>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};
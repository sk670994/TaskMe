// client/src/views/Tasks/Tasks.jsx
import { useEffect, useState } from "react";
import CreateTaskModal from "../../components/CreateTaskModal";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  HStack,
  Spinner,
  useToast,
  Flex,
  Center,
} from "@chakra-ui/react";
import axios from "../../api"; // make sure this points to your Axios config
import ViewModal from "../../components/ViewModal";
import EditModal from "../../components/EditModal";

export default function Tasks() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`/api/files/${filename}`);
      toast({
        title: "File deleted",
        description: filename,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
        variant: "left-accent",
      });
      fetchFiles();
    } catch (err) {
      toast({
        title: "Error deleting file",
        description: err.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Box p={[4, 6, 8]} maxW="800px" mx="auto">
      <Flex justify="flex-end" mb={4}>
        <CreateTaskModal onSuccess={fetchFiles} />
      </Flex>

      <Heading mb={6}>Your Tasks</Heading>

      {loading ? (
        <Flex justify="center" align="center" h="100px">
          <Spinner size="lg" />
        </Flex>
      ) : (
        <VStack align="stretch" spacing={4}>
          {files.length === 0 ? (
            <Center py={10}>
              <VStack>
                <Text fontSize="lg">No tasks found.</Text>
                <Text fontSize="sm" color="gray.500">
                  Try creating your first task using the + button above.
                </Text>
              </VStack>
            </Center>
          ) : (
            files.map((filename, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="xl"
                boxShadow="md"
                bg="gray.50"
                _hover={{ boxShadow: "lg", bg: "gray.100" }}
              >
                <HStack justify="space-between">
                  <Text fontWeight="medium">{filename.replace(".txt", "")}</Text>
                  <HStack spacing={3}>
                    <ViewModal filename={filename} />
                    <EditModal filename={filename} onSuccess={fetchFiles} />
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(filename)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            ))
          )}
        </VStack>
      )}
    </Box>
  );
}

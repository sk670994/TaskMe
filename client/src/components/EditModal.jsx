import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "../api";

export default function EditModal({ filename, onSuccess }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [newTitle, setNewTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchFile = async () => {
    try {
      const res = await axios.get(`/api/files/${filename}`);
      setNewTitle(filename.replace(".txt", ""));
      setContent(res.data.content);
    } catch (err) {
      toast({
        title: "Error loading file",
        description: err.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`/files/${filename}`, { newTitle, content });
      toast({
        title: "Task updated",
        description: newTitle,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onClose();
      onSuccess();
    } catch (err) {
      toast({
        title: "Error saving task",
        description: err.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isOpen) fetchFile();
  }, [isOpen]);

  return (
    <>
      <Button onClick={onOpen} leftIcon={<EditIcon />} size="sm" colorScheme="blue">
        Edit
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Details</FormLabel>
              <Textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

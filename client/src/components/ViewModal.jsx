import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import axios from "../api";

export default function ViewModal({ filename }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filedata, setFiledata] = useState("");
  const toast = useToast();

  const fetchFile = async () => {
    try {
      const res = await axios.get(`/api/files/${filename}`);
      setFiledata(res.data.content);
    } catch (err) {
      toast({
        title: "Error fetching file",
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
      <Button onClick={onOpen} leftIcon={<ViewIcon />} size="sm">
        View
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{filename.replace(".txt", "")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody whiteSpace="pre-wrap">
            <Text>{filedata}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  show: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  show,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ModalContainer
            as={motion.div}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <h2>{title}</h2>
            <p>{message}</p>
            <ButtonGroup>
              <ConfirmButton onClick={onConfirm}>Eliminar</ConfirmButton>
              <CancelButton onClick={onCancel}>Cancelar</CancelButton>
            </ButtonGroup>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

// === Styled Components ===
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
  text-align: center;

  h2 {
    margin-top: 0;
    color: #111827;
  }

  p {
    color: #4b5563;
    margin: 16px 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #b91c1c;
  }
`;

const CancelButton = styled.button`
  background: #e5e7eb;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #d1d5db;
  }
`;

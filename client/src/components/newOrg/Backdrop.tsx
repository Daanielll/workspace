import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  onClick: () => void;
  children: ReactNode;
};
export function Backdrop({ children, onClick }: Props) {
  return (
    <motion.div
      className="aboslute top-0 left-0 h-full w-full bg-black bg-opacity-20 z-10 overflow-hidden"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

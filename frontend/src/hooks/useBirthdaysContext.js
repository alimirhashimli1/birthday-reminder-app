import { BirthdaysContext } from "../context/BirthdayContext";
import { useContext } from "react";

export const useBirthdaysContext = () => {
  const context = useContext(BirthdaysContext);

  if (!context) {
    throw Error(
      "useBirthdaysContext must be used in side the BirthdaysContextProvider"
    );
  }

  return context;
};

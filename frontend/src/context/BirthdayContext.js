import React, { useReducer } from "react";
import { createContext } from "react";

export const BirthdaysContext = createContext();

export const birthdaysReducer = (state, action) => {
  switch (action.type) {
    case "SET_BIRTHDAYS":
      return {
        birthdays: action.payload,
      };
    case "CREATE_BIRTHDAY":
      return {
        birthdays: [action.payload, ...state.birthdays],
      };
      case "DELETE_BIRTHDAY":
        return {
          birthdays: state.birthdays.filter((b) => b._id !== action.payload._id)
        }
    default:
      return state;
  }
};

export const BirthdaysContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(birthdaysReducer, {
    birthdays: null,
  });

  return (
    <BirthdaysContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BirthdaysContext.Provider>
  );
};

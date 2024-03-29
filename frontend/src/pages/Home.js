import React, { useEffect, useState } from "react";
import { useBirthdaysContext } from "../hooks/useBirthdaysContext";

// components
import BirthdayDetails from "../components/BirthdayDetails";
import BirthdayForm from "../components/BirthdayForm";

const Home = () => {
  const { birthdays, dispatch } = useBirthdaysContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch("/api/birthdays");
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_BIRTHDAYS", payload: json });
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="home">
      <div className="birthdays">
        {birthdays &&
          birthdays.map((birthday) => (
            <BirthdayDetails birthday={birthday} key={birthday._id} />
          ))}
      </div>
      <BirthdayForm />
    </div>
  );
};

export default Home;

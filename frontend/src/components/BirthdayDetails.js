import {useBirthdaysContext} from "../hooks/useBirthdaysContext"
import React, { useState, useEffect } from "react";

const BirthdayDetails = ({ birthday }) => {
  const {dispatch} = useBirthdaysContext()
  const date = new Date(birthday.birthdate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const handleClick = async () => {
    const response = await fetch("/api/birthdays/" + birthday._id, {
      method: "DELETE"
    })
    const json = await response.json()

    if(response.ok){
      dispatch({type: "DELETE_BIRTHDAY", payload: json})
    }
  }

  return (
    <div className="birthday-details" key={birthday._id}>
      <h4>
        {birthday.name} {birthday.surname}
      </h4>
      <p>
        <strong>Birthday on </strong>
        {day}-{month}-{year}
      </p>
      <p className="birthday-note">{birthday.note}</p>
      <img src={birthday.picture} alt="" width="100" height="100" />
      <span onClick={handleClick}>delete</span>
      
    </div>
  );
};

export default BirthdayDetails;

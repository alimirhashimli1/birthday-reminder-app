import React from "react";

const BirthdayDetails = ({ birthday }) => {
  const date = new Date(birthday.birthdate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return (
    <div className="birthday-details">
      <h4>
        {birthday.name} {birthday.surname}
      </h4>
      <p>
        <strong>Birthday on </strong>
        {day}-{month}-{year}
      </p>
      <p className="birthday-note">{birthday.note}</p>
      <img src={birthday.picture} alt="" width="100" height="100" />
    </div>
  );
};

export default BirthdayDetails;

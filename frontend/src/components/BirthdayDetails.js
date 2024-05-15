import React, { useState } from "react";
import { useBirthdaysContext } from "../hooks/useBirthdaysContext";

const BirthdayDetails = ({ birthday }) => {
  const { dispatch } = useBirthdaysContext();
  const date = new Date(birthday.birthdate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(birthday.name);
  const [newSurname, setNewSurname] = useState(birthday.surname);
  const [newNote, setNewNote] = useState(birthday.note);
  const [newBirthdate, setNewBirthdate] = useState(birthday.birthdate);
  const [newPicture, setNewPicture] = useState(birthday.picture);

  const handleClick = async () => {
    const response = await fetch("/api/birthdays/" + birthday._id, {
      method: "DELETE"
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_BIRTHDAY", payload: json });
    }
  };

  const handleEdit = async () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("surname", newSurname);
    formData.append("note", newNote);
    formData.append("birthdate", newBirthdate);
    formData.append("picture", newPicture);

    try {
      const response = await fetch("/api/birthdays/" + birthday._id, {
        method: "PATCH",
        body: formData
      });

      if (response.ok) {
        const updatedBirthday = await response.json();
        dispatch({ type: "EDIT_BIRTHDAY", payload: updatedBirthday });
        setEditing(false); // Exit editing mode after successful edit
      } else {
        const error = await response.json();
        console.error("Error editing birthday:", error);
      }
    } catch (error) {
      console.error("Error editing birthday:", error.message);
    }
  };

  const handleChangePicture = (e) => {
    setNewPicture(e.target.files[0]);
  };

  const handleSave = () => {
    handleEdit();
  };

  return (
    <div className="birthday-details" key={birthday._id}>
      {editing ? (
        <>
          <span onClick={handleSave}>Save</span>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="text"
            value={newSurname}
            onChange={(e) => setNewSurname(e.target.value)}
          />
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <input
            type="date"
            value={newBirthdate}
            onChange={(e) => setNewBirthdate(e.target.value)}
          />
          <input
            type="file"
            name="picture"
            onChange={handleChangePicture}
            accept="image/*"
          />
        </>
      ) : (
        <>
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
          <span onClick={() => setEditing(true)}>Edit</span>
        </>
      )}
    </div>
  );
};

export default BirthdayDetails;

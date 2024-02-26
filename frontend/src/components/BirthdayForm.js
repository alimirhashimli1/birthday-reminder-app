import React, { useState } from "react";
import { useBirthdaysContext } from "../hooks/useBirthdaysContext";

const BirthdayForm = () => {
  const { dispatch } = useBirthdaysContext();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [note, setNote] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const birthday = { name, surname, note, birthdate, picture: imageUrl };

    const response = await fetch("/api/birthdays", {
      method: "POST",
      body: JSON.stringify(birthday),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setName("");
      setSurname("");
      setNote("");
      setBirthdate("");
      setError(null);
      console.log("new birthday added", json);
      dispatch({ type: "CREATE_BIRTHDAY", payload: json });
    }
  };

  const handleFileUpload = async (files) => {
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("File uploaded successfully:", data.url);

      // Set the URL to state or pass it to your backend along with other form data
      // For now, let's set it to state
      setImageUrl(data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a Birthday</h3>

      <label>Name</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label>Surname</label>
      <input
        type="text"
        onChange={(e) => setSurname(e.target.value)}
        value={surname}
      />

      <label>Note</label>
      <input
        type="text"
        onChange={(e) => setNote(e.target.value)}
        value={note}
      />

      <label>Birth date</label>
      <input
        type="date"
        onChange={(e) => setBirthdate(e.target.value)}
        value={birthdate}
      />
      <label>Profile Picture</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files)}
      />
      {error && <p className="error">{error}</p>}
      <button>Add Birthday</button>
    </form>
  );
};

export default BirthdayForm;

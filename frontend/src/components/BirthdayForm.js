import React, { useState } from "react";

const BirthdayForm = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [note, setNote] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const birthday = { name, surname, note, birthdate };

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
      <button>Add Birthday</button>
    </form>
  );
};

export default BirthdayForm;

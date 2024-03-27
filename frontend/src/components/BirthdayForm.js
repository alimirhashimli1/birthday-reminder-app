import React, { useContext, useState } from "react";
import { BirthdaysContext } from "../context/BirthdayContext";

const FormComponent = () => {
  const { dispatch } = useContext(BirthdaysContext);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    note: "",
    birthdate: "",
    picture: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      picture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("surname", formData.surname);
    formDataToSend.append("note", formData.note);
    formDataToSend.append("birthdate", formData.birthdate);
    formDataToSend.append("picture", formData.picture);

    try {
      const res = await fetch("/api/birthdays", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await res.json();
      console.log(data);
      // Dispatch CREATE_BIRTHDAY action with the form data
      dispatch({ type: "CREATE_BIRTHDAY", payload: formDataToSend });
      // Reset form fields
      setFormData({
        name: "",
        surname: "",
        note: "",
        birthdate: "",
        picture: null,
      });
      setSubmitting(false);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <br />
      <label htmlFor="surname">Surname:</label>
      <input
        type="text"
        id="surname"
        name="surname"
        value={formData.surname}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="surname">note:</label>
      <input
        type="text"
        id="note"
        name="note"
        value={formData.note}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="surname">birthdate:</label>
      <input
        type="date"
        id="birthdate"
        name="birthdate"
        value={formData.birthdate}
        onChange={handleChange}
        required
      />
      <br />
      <label htmlFor="picture">Upload Picture:</label>
      <input
        type="file"
        id="picture"
        name="picture"
        onChange={handleFileChange}
        accept="image/*"
        required
      />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormComponent;

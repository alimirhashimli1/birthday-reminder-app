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
  const [previewURL, setPreviewURL] = useState(""); // State to store the image preview URL

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      picture: file,
    });
    
    // Create a URL for previewing the image
    const imageURL = URL.createObjectURL(file);
    setPreviewURL(imageURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("note", formData.note);
      formDataToSend.append("birthdate", formData.birthdate);
      formDataToSend.append("picture", formData.picture);

      const res = await fetch("/api/birthdays", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      console.log(data);

      // Dispatch CREATE_BIRTHDAY action with the response data
      dispatch({ type: "CREATE_BIRTHDAY", payload: data });

      // Reset form fields
      setFormData({
        name: "",
        surname: "",
        note: "",
        birthdate: "",
        picture: null,
      });
      setPreviewURL(""); // Reset preview URL

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
      <label htmlFor="note">Note:</label>
      <input
        type="text"
        id="note"
        name="note"
        value={formData.note}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="birthdate">Birthdate:</label>
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
      {previewURL && <img src={previewURL} alt="Preview" width="100" height="100" />} {/* Render the preview image */}
      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default FormComponent;

import React, { useState, useEffect } from "react";

const BirthdayDetails = ({ birthday }) => {
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const date = new Date(birthday.birthdate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(birthday.picture);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } catch (error) {
        console.error("Error loading image:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      // Clean up if necessary (e.g., revoke object URL)
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [birthday.picture]);

  return (
    <div className="birthday-details">
      {loading ? (
        <p>Loading...</p>
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
        </>
      )}
    </div>
  );
};

export default BirthdayDetails;

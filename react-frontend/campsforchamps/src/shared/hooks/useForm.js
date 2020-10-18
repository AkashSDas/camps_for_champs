import { useState } from "react";

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  return [
    values,
    setValues,

    // handle form changes
    (event) => {
      const isCheckbox = event.target.type === "checkbox";
      const isImageFile = event.target.type === "file";

      let targetValue = null;
      if (isCheckbox) {
        targetValue = event.target.checked;
      } else if (isImageFile) {
        try {
          targetValue = event.target.files[0];
        } catch (e) {
          console.log(e);
        }
      } else {
        targetValue = event.target.value;
      }

      setValues({
        ...values,
        [event.target.name]: targetValue,
      });
    },
  ];
};

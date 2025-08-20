import { useState } from 'react';

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = (onSubmit) => {
    return async (e) => {
      e.preventDefault();
      const validationErrors = validate ? validate(values) : {};
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        await onSubmit(values);
      }
    };
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues
  };
};

export default useForm;
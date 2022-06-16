import { useState, useEffect } from 'react';

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);

  function handleChange(e) {
    let { value, name, type } = e.target;

    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  }
  function handleNumberChange(value, target) {
    let { name, type } = target;
    // const { name } = target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = target.files;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  }
  function resetForm() {
    setInputs(initial);
  }
  return {
    inputs,
    handleChange,
    handleNumberChange,
    resetForm,
  };
}

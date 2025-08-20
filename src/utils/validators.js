// Validar email
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Validar contraseña (mínimo 6 caracteres)
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Validar que no esté vacío
export const validateRequired = (value) => {
  return value.trim() !== '';
};

// Validar número positivo
export const validatePositiveNumber = (value) => {
  return !isNaN(value) && parseFloat(value) > 0;
};

// Validar número entero positivo
export const validatePositiveInteger = (value) => {
  return Number.isInteger(Number(value)) && Number(value) > 0;
};
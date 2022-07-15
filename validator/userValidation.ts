export const createRule = {
    "email": "required|email",
    "firstName": "required|string",
    "lastName" : "required|string",
    "password": "required|string|min:6",
    "role": "required|numeric"
};

export const updateRule = {
    "email": "email",
    "firstName": "string",
    "lastName" : "string"
};

export const loginValidation = {
    "email": "required|email",
    "password": "required|string|min:6"
};
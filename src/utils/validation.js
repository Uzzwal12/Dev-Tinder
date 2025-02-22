const validator = require("validator");

const validateProfileData = (req) => {
  const allowedFieldsForEdit = [
    "firstName",
    "lastName",
    "about",
    "age",
    "gender",
    "photoUrl",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFieldsForEdit.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateProfileData,
};

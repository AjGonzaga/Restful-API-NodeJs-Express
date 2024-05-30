const getStudents = 'SELECT * FROM students ORDER BY id';
const getStudentById = `
SELECT id, name, email, age, dob, school, referenceid 
FROM students 
WHERE id = $1`;;
const checkEmailExist = 'SELECT * FROM students WHERE email = $1';
const addStudent = `
    INSERT INTO students (name, email, age, dob, school, referenceid)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
`;
const removeStudent = 'DELETE FROM students WHERE id = $1';
const updateStudent = 'UPDATE students SET name = $1, email = $3, age = $4, dob = $5, school = $6 WHERE id = $2';
const checkUsernameExist = 'SELECT * FROM studentval WHERE username = $1';
const addStudentCredentials = `
    INSERT INTO studentval (id, username, password)
    VALUES ($1, $2, $3)
    RETURNING *;
`;
const removeStudentCredentials = 'DELETE FROM studentval WHERE id = $1';

module.exports = {
    getStudents,
    getStudentById,
    checkEmailExist,
    addStudent,
    removeStudent,
    updateStudent,
    checkUsernameExist,
    addStudentCredentials,
    removeStudentCredentials,
};
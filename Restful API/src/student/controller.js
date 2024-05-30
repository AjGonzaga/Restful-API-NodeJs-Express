const pool = require('../../db');
const queries = require('./query');



const generateReferenceId = () => {
    return Math.floor(Math.random() * 1000000); // Generates a 6-digit reference ID
};

const getStudents = (req, res) => {
    pool.query(queries.getStudents, (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });

}

const getStudentById = (req, res) => {
    const id = parseInt(req.params.id);

    // Use a single query to retrieve student information and check existence
    const query = `
        SELECT id, name, email, age, dob, school, referenceid 
        FROM students 
        WHERE id = $1`;

    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const student = results.rows[0];

        res.status(200).json(student);
    });
};
const addStudent = (req, res) => {
    const { name, email, age, dob, school, username, password } = req.body;
    const referenceId = generateReferenceId();
    
    pool.query(queries.checkEmailExist, [email], (error, emailResult) => {
        if (error) throw error;

        if (emailResult.rows.length) {
            return res.status(400).send('Email already exists');
        }

        pool.query(queries.checkUsernameExist, [username], (error, usernameResult) => {
            if (error) throw error;

            if (usernameResult.rows.length) {
                return res.status(400).send('Username already exists');
            }

            // Add the student to the parent table with referenceId
            pool.query(queries.addStudent, [name, email, age, dob, school, referenceId], (error, studentResult) => {
                if (error) throw error;

                // Retrieve the id of the newly added student
                const studentId = studentResult.rows[0].id;

                // Add the username and password to the child table
                pool.query(queries.addStudentCredentials, [studentId, username, password], (error, credentialResult) => {
                    if (error) throw error;
                    res.status(201).json({ message: 'Student Created Successfully' });
                });
            });
        });
    });
};

const removeStudent = (req, res) => {
    const id = parseInt(req.params.id);

    // Delete related records in the 'studentval' table first
    pool.query(queries.removeStudentCredentials, [id], (error, results) => {
        if (error) throw error;

        // Now, remove the student from the 'students' table
        pool.query(queries.removeStudent, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send('Student removed from database');
        });
    });
};
const updateStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const {name, email, age, dob, school} = req.body;

    pool.query(queries.getStudentById, [id], (error, results) => {
        if (error) throw error;

        const noStudentFound = !results.rows.length;
        if (noStudentFound) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Update student information
        pool.query(queries.updateStudent, [name, id, email, age, dob, school], (error, results) => {
            if (error) throw error;
            res.status(200).json({message: 'Student Information was updated'});
        });
    });
};
// LOGIN VALIDATION
const loginStudent = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query to retrieve user by username and password
        const query = `SELECT id FROM studentval WHERE username=$1 AND password=$2`;
        const result = await pool.query(query, [username, password]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const userId = result.rows[0].id; // Retrieve the ID of the user

        res.json({ message: 'Login successful', userId: userId }); // Include the ID in the response
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    addStudent,
    removeStudent,
    updateStudent,
    loginStudent,
}
// import React, { useState } from 'react';
// import './ressetPassword.css';
// import { Link } from 'react-router-dom';

// const ressetPassword: React.FC = () => {
//   const [email, setEmail] = useState('');

//   const handleRessetPassword = () => {
//     const apiUrl = 'http://localhost:8080/resetPassword';

//     const requestBody = {
//       email: email,
//     };

//     console.log(requestBody);
//     fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestBody),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Register failed');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log('Register successful:', data);
//       })
//       .catch((error) => {
//         console.error('Register error:', error);
//       });
//   };

//   return (
//     <>
//       <div className="form">
//       <label htmlFor="email">Email:</label>
//       <input
//         type="email"
//         id="email"
//         name="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <button onClick={handleRessetPassword}>Resetuj hasło</button>
//     </div>
//     </>
//   );
// };

// export default ressetPassword;

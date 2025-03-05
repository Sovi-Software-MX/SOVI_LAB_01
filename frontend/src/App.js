import React, { useState, useEffect } from "react";
import { registerUser, loginUser, logoutUser, addDatabaseValue, listenToDatabase, getImageUrl, storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [dbData, setDbData] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Manejar autenticación
  const handleRegister = async () => {
    const newUser = await registerUser(email, password);
    if (newUser) setUser(newUser);
  };

  const handleLogin = async () => {
    const loggedInUser = await loginUser(email, password);
    if (loggedInUser) setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  // Subir datos en tiempo real a Firestore
  const handleAddData = async () => {
    if (nombre && edad) {
      await addDatabaseValue(nombre, edad);
      setNombre("");
      setEdad("");
    }
  };

  // Escuchar cambios en Firestore en tiempo real
  useEffect(() => {
    const unsubscribe = listenToDatabase(setDbData);
    return () => unsubscribe(); // Detiene la escucha cuando el componente se desmonta
  }, []);

  // Subir imagen en tiempo real a Firebase Storage
  const handleUploadImage = async () => {
    if (!imageFile) return;

    const storageRef = ref(storage, `imagenes/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(storageRef);
    setImageUrl(url);
    alert("Imagen subida correctamente");
  };

  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", padding: "20px" }}>
      <h1>PROYECTO "HOLA MUNDO" 🚀</h1>

      {/* 🔹 LOGIN */}
      <h2>1️⃣ Autenticación</h2>
      {user ? (
        <div>
          <p>Bienvenido, <strong>{user.email}</strong></p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <div>
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleRegister}>Registrarse</button>
          <button onClick={handleLogin}>Iniciar Sesión</button>
        </div>
      )}

      <hr />

      {/* 🔹 FIRESTORE */}
      <h2>2️⃣ Subir Datos en Tiempo Real a Firestore</h2>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input type="number" placeholder="Edad" value={edad} onChange={(e) => setEdad(e.target.value)} />
      <button onClick={handleAddData}>Agregar Datos</button>

      <h3>📌 Datos en Firestore (Actualización en Tiempo Real)</h3>
      {dbData.map((item) => (
        <p key={item.id}>
          <strong>{item.nombre}</strong> - {item.edad} años
        </p>
      ))}

      <hr />

      {/* 🔹 STORAGE */}
      <h2>3️⃣ Subir Imagen en Tiempo Real</h2>
      <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
      <button onClick={handleUploadImage}>Subir Imagen</button>

      {imageUrl && (
        <div>
          <h3>📌 Imagen subida</h3>
          <img src={imageUrl} alt="Imagen subida" width="300" />
        </div>
      )}
    </div>
  );
}

export default App;

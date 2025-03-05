import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Configuración de Firebase (Reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyDU8m30loCr6R0knK3YjZeQ6iDXXxK4LOY",
  authDomain: "sovi-lab-01.firebaseapp.com",
  projectId: "sovi-lab-01",
  storageBucket: "sovi-lab-01.firebasestorage.app",
  messagingSenderId: "15648749712",
  appId: "1:15648749712:web:8a928f5440174619f78015",
  measurementId: "G-6T4VT8PWKY"
};

// ✅ **Inicializar Firebase correctamente**
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔹 **Funciones de autenticación**
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Usuario cerró sesión.");
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
  }
};

// 🔹 **API_Db: Consultar un campo en Firestore**
export const getDatabaseValue = async () => {
  try {
    const docRef = doc(db, "testCollection", "pNql00Xp2q2bWAx5q6jM"); // Reemplaza con un ID real
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error al obtener datos:", error.message);
    return null;
  }
};

// 🔹 **API_Ms: Obtener una imagen de Firebase Storage**
export const getImageUrl = async (filePath) => {
  try {
    const storageRef = ref(storage, filePath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error al obtener la imagen:", error.message);
    return null;
  }
};

// 🔹 **Subir datos en tiempo real a Firestore**
export const addDatabaseValue = async (nombre, edad) => {
  try {
    await addDoc(collection(db, "testCollection"), {
      nombre: nombre,
      edad: Number(edad),
      timestamp: new Date() // Para ordenarlos por fecha
    });
  } catch (error) {
    console.error("Error al agregar datos:", error.message);
  }
};

// 🔹 **Escuchar cambios en Firestore en tiempo real**
export const listenToDatabase = (callback) => {
  return onSnapshot(collection(db, "testCollection"), (snapshot) => {
    const datos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(datos);
  });
};

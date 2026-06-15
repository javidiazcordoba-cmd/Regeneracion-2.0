/* ============================================================
   REGENERACIÓN 2.0 — Conexión con Firebase
   ------------------------------------------------------------
   👉 PASO ÚNICO: pega aquí los datos de tu proyecto Firebase.
      (Sigue la guía "INSTRUCCIONES-FIREBASE.md")

   Reemplaza los valores "TU_..." por los que te da Firebase.
   ============================================================ */

const firebaseConfig = {
  apiKey:            "AIzaSyDu-yBv8KYZEXbXVrqa1kCqmojxiHJqMJQ",
  authDomain:        "regeneracion-web.firebaseapp.com",
  projectId:         "regeneracion-web",
  storageBucket:     "regeneracion-web.firebasestorage.app",
  messagingSenderId: "64041821557",
  appId:             "1:64041821557:web:1f4de44825872e01c01f3c"
};

/* Clave que los participantes deben escribir para poder publicar.
   Cámbiala por la que quieras y compártela solo con tu grupo.   */
const CLAVE_DEL_GRUPO = "regeneracion2025";

/* ============================================================
   A partir de aquí NO necesitas tocar nada.
   ============================================================ */

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

window.RegenDB = {
  CLAVE_DEL_GRUPO,
  db,
  storage,

  /* Devuelve TODOS los artículos: primero los nuevos (Firebase),
     luego los originales del archivo articulos.json. */
  async cargarArticulos() {
    let remotos = [];
    try {
      const snap = await db.collection('articulos').orderBy('createdAt', 'desc').get();
      remotos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('No se pudo leer de Firebase (¿config pendiente?):', e.message);
    }

    let semilla = [];
    try {
      semilla = await fetch('articulos.json').then(r => r.json());
    } catch (e) {
      console.warn('No se pudo leer articulos.json:', e.message);
    }

    // Evita duplicados por slug (gana el de Firebase)
    const slugsRemotos = new Set(remotos.map(a => a.slug));
    const soloSemilla = semilla.filter(a => !slugsRemotos.has(a.slug));

    return [...remotos, ...soloSemilla];
  },

  /* Busca un artículo concreto por su slug. */
  async cargarPorSlug(slug) {
    const todos = await this.cargarArticulos();
    return todos.find(a => a.slug === slug);
  }
};

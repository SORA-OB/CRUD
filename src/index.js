require("dotenv").config();
const { sql } = require("@vercel/postgres");
const express = require("express");
const app = express();

app.use(express.json());

// --- OPERACIÓN: CREATE ---
app.post("/usuarios", async (req, res) => {
	const { nombre, email } = req.body;
	try {
		// Usamos el tag 'sql' para prevenir Inyección SQL automáticamente
		await sql`INSERT INTO Usuarios (Nombre, Email) VALUES (${nombre}, ${email});`;
		res.status(201).json({ mensaje: "Usuario creado con éxito" });
	} catch (error) {
		res.status(500).json({ error: "Error al crear usuario" });
	}
});

// --- OPERACIÓN: READ ---
app.get("/usuarios", async (req, res) => {
	try {
		const { rows } = await sql`SELECT * FROM Usuarios;`;
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener usuarios" });
	}
});

// --- OPERACIÓN: DELETE (Seguro) ---
app.delete("/usuarios/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await sql`DELETE FROM Usuarios WHERE id = ${id};`;
		res.json({ mensaje: `Usuario ${id} eliminado` });
	} catch (error) {
		res.status(500).json({ error: "Error al eliminar" });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));

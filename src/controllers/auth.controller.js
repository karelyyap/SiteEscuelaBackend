const authService = require("../services/auth.service");

const register = async(req, res) => {
    try {
        console.log(req.body);
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch(error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const login = async(req, res) => {
    try {
        const  result = await authService.login(req.body);
        res.json(result);
    } catch(error) {
        res.status(401).json({
            message : error.message
        });
    }
}

const getUsers = async(req, res) => {
    try{
        const users=await authService.getUsers();
        res.json(users);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
}
const getUserById = async(req, res) => {
    try{
        const user=await authService.getUserById(req.params.id);
        res.json(user);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
}
const deleteUser = async(req, res) => {
    try{
        const user=await authService.deleteUser(req.params.id);
        res.json(user);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
}
const updateUser = async(req, res) => {
    try{
        const user=await authService.updateUser(req.params.id, req.body);
        res.json(user);
    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
}

// --- FUNCIONES PARA MAESTROS ---

const getMaestros = async(req, res) => {
    try {
        const maestros = await authService.getMaestros();
        res.json(maestros);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const createMaestro = async(req, res) => {
    try {
        const nuevoMaestro = await authService.createMaestro(req.body);
        res.status(201).json(nuevoMaestro);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
};

const updateMaestro = async(req, res) => {
    try {
        const maestroActualizado = await authService.updateMaestro(req.params.id, req.body);
        res.json(maestroActualizado);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteMaestro = async(req, res) => {
    try {
        await authService.deleteMaestro(req.params.id);
        res.json({ message: "Maestro eliminado correctamente" });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// --- FUNCIONES PARA ALUMNOS ---

const getAlumnos = async(req, res) => {
    try {
        const alumnos = await authService.getAlumnos();
        res.json(alumnos);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const createAlumno = async(req, res) => {
    try {
        const nuevoAlumno = await authService.createAlumno(req.body);
        res.status(201).json(nuevoAlumno);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
};

const updateAlumno = async(req, res) => {
    try {
        const alumnoActualizado = await authService.updateAlumno(req.params.id, req.body);
        res.json(alumnoActualizado);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAlumno = async(req, res) => {
    try {
        await authService.deleteAlumno(req.params.id);
        res.json({ message: "Alumno eliminado correctamente" });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// --- NUEVA FUNCIÓN PARA CONTROLADOR IA ---
const generarReporteIA = async(req, res) => {
    try {
        const { id } = req.params; // Obtenemos el ID del alumno de la URL
        const reporte = await authService.generarResumenIA(id);
        res.json(reporte);
    } catch(error) {
        // Si la IA falla o el alumno no existe, mandamos error 500
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    login,
    register,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    getMaestros,
    createMaestro,
    updateMaestro,
    deleteMaestro,
    getAlumnos,
    createAlumno,
    updateAlumno,
    deleteAlumno,
    generarReporteIA
}
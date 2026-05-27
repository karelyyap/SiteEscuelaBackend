const prisma = require("../config/prisma");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Para llamadas a la API de Gemini

const register = async({ name, email, password }) => {
    const existeUsuario = await prisma.users.findUnique({
        where : { email } 
    });

    if (existeUsuario) {
        throw new Error("El correo ya está registrado");
    }

    const hashPassword = await bcrypt.hash(password,10);

    const user = await prisma.users.create({
        data: {
            name,
            email,
            password : hashPassword
        }
    });

    return {
        message : "Usuario registrado correctamente",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }
}

const login = async({ email, password }) => {

    const user = await prisma.users.findUnique({
        where : { email }
    });

    if(!user) {
        throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        throw new Error('Credenciales inválidas');
    }

    const  token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        message : 'Login correcto',
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
        }
    }
}

const getUsers = async() => {
    return await prisma.users.findMany({
        select:{
            id:true,
            name:true,
            email:true
        }
    });
}

const getUserById = async(id) => {
    const user= await prisma.users.findUnique({
        where :{id:Number(id)},
        select:{
            id:true,
            name:true,
            email:true
        }
    });

    if(!user){
        throw new Error('Usuario no encontrado');
    }
    return user;

}

const deleteUser = async(id) => {
    const user = await prisma.users.delete({
        where : { id : Number(id) }
    });

    if(!user){
        throw new Error('Usuario no encontrado');
    }
    return user;
}

const updateUser = async(id, { name, email, password }) => {
    const hashPassword = await bcrypt.hash(password,10);
    const user = await prisma.users.update({
        where : { id : Number(id) },
        data: {
            name,
            email,
            password : hashPassword
        }
    });
    return user;
}

// Funciones para maestros 
const getMaestros = async () => {
    return await prisma.maestros.findMany();
};

const createMaestro = async (data) => {
    return await prisma.maestros.create({
        data: {
            nombre: data.nombre,
            apellido: data.apellido,
            numeroEmpleado: data.numeroEmpleado,
            departamento: data.departamento,
            correo: data.correo
        }
    });
};

const updateMaestro = async (id, data) => {
    return await prisma.maestros.update({
        where: { id: Number(id) },
        data: {
            nombre: data.nombre,
            apellido: data.apellido,
            numeroEmpleado: data.numeroEmpleado,
            departamento: data.departamento,
            correo: data.correo
        }
    });
};

const deleteMaestro = async (id) => {
    return await prisma.maestros.delete({
        where: { id: Number(id) }
    });
};


// Funciones para alumnos
const getAlumnos = async () => {
    return await prisma.alumnos.findMany();
};

const createAlumno = async (data) => {
    return await prisma.alumnos.create({
        data: {
            nombre: data.nombre,
            apellido: data.apellido,
            matricula: data.matricula,
            carrera: data.carrera,
            cuatrimestre: data.cuatrimestre,
            correo: data.correo
        }
    });
};

const updateAlumno = async (id, data) => {
    return await prisma.alumnos.update({
        where: { id: Number(id) },
        data: {
            nombre: data.nombre,
            apellido: data.apellido,
            matricula: data.matricula,
            carrera: data.carrera,
            cuatrimestre: data.cuatrimestre,
            correo: data.correo
        }
    });
};

const deleteAlumno = async (id) => {
    return await prisma.alumnos.delete({
        where: { id: Number(id) }
    });
};

// --- NUEVA FUNCIÓN PARA GEMINI IA ---
const generarResumenIA = async (idAlumno) => {
    // 1. Buscamos al alumno real en la base de datos
    const alumno = await prisma.alumnos.findUnique({
        where: { id: Number(idAlumno) }
    });

    if (!alumno) {
        throw new Error('Alumno no encontrado para generar reporte.');
    }

    // 2. Construimos el prompt (la instrucción para Gemini)
    // Usamos el ejemplo formal que nos diste: "Resumen Formal de Expediente Escolar"
    const prompt = `Actúa como un director administrativo escolar muy profesional. Te voy a proporcionar los datos crudos de un estudiante. 
    
    Tu tarea es redactar y estructurar un "Resumen de Expediente Escolar". Por favor, organiza tú mismo la información de forma lógica, separando los datos personales de los académicos.
    
    Regla muy importante: Entrega tu respuesta directamente en código HTML puro. Usa las etiquetas <b> para las negritas, <br> para los saltos de línea y <hr> para líneas separadoras. No uses asteriscos ni formato Markdown. No incluyas las comillas invertidas de código al principio y al final, solo el texto HTML.
    
    No incluyas saludos, ni frases como "Aquí tienes el resumen". Entrégame directamente el documento finalizado.
    
    Datos crudos del alumno:
    - Nombre completo: ${alumno.nombre} ${alumno.apellido}
    - Matrícula: ${alumno.matricula}
    - Carrera: ${alumno.carrera}
    - Cuatrimestre: ${alumno.cuatrimestre}
    - Correo electrónico: ${alumno.correo}`;

    // 3. Hacemos la llamada real a Gemini usando Axios
    // Usamos la configuración exacta que mostraste en image_6.png
    try {
        const urlGemini = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const dataBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        const response = await axios.post(urlGemini, dataBody, {
            headers: { 'Content-Type': 'application/json' }
        });

        // 4. Extraemos el texto crudo que nos regresa la IA
        // Esta es la ruta estándar en la respuesta JSON de Gemini
        const textoGenerado = response.data.candidates[0].content.parts[0].text;
        
        return {
            id: alumno.id,
            nombreCompleto: `${alumno.nombre} ${alumno.apellido}`,
            resumenText: textoGenerado
        };

    } catch (error) {
        console.error('Error llamando a Gemini:', error.response ? error.response.data : error.message);
        throw new Error('Hubo un error al conectar con la Inteligencia Artificial.');
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
  generarResumenIA
};
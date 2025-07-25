const { User } = require('../models/index');
const adminService = require('../services/admin-service')


// ======================= CONTROLADOR DE ADMINISTRADOR =======================
exports.listDentists = async (req, res) => {

  // Extrae params de query con valores por defecto
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const doctors = await adminService.getAllDentists();
  res.status(200).json(doctors);
};

exports.getDentist = async (req, res) => {
  const { id } = req.params;

  try {
    const dentist = await adminService.getDentist(id);
    res.status(200).json(dentist);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// ======================= CONTROLADOR DE CLIENTES =======================

exports.getAllUsers = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const users = await adminService.getAllClients();
  res.status(200).json(users);
}

exports.getUser = async(req, res) => {
  const { id } = req.params;
  try{
    const user = await adminService.getClient(id);
    res.status(200).json(user);
  }catch(error) {
    res.status(404).json({ message: error.message });
  }
}
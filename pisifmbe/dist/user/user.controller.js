"use strict";
// Layer untuk handle request dan response
// Biasanya juga handle validasi body
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_services_1 = require("./user.services");
const router = express_1.default.Router();
router.get('/:id', async (_req, res) => {
    try {
        const user = await (0, user_services_1.getUserById)(_req.params.id);
        res.send(user);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
router.get('/', async (_req, res) => {
    const users = await (0, user_services_1.getAllUsers)();
    res.send(users);
});
router.post('/', async (_req, res) => {
    try {
        const newUser = _req.body;
        const users = await (0, user_services_1.createUser)(newUser.email, newUser.name);
        res.send({
            data: users,
            message: 'User berhasil dibuat',
        });
    }
    catch (error) {
        res.status(404).send(error);
    }
});
router.delete('/:id', async (_req, res) => {
    try {
        const userId = _req.params.id;
        await (0, user_services_1.deleteUser)(userId);
        res.send({
            data: userId,
            message: 'User berhasil dihapus',
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
});
router.put('/:id', async (_req, res) => {
    const userId = _req.params.id;
    const updatedUser = _req.body;
    if (!updatedUser.email && !updatedUser.name) {
        return res.status(400).send('Email dan nama harus diisi');
    }
    const user = await (0, user_services_1.editUserById)(userId, updatedUser.email, updatedUser.name);
    res.send({
        data: user,
        message: 'Sukses mengPut user',
    });
});
router.patch('/:id', async (_req, res) => {
    try {
        const userId = _req.params.id;
        const updatedUser = _req.body;
        const user = await (0, user_services_1.editUserById)(userId, updatedUser.email, updatedUser.name);
        res.send({
            data: user,
            message: 'Sukses mengPatch user',
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.default = router;

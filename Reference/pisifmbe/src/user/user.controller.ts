// Layer untuk handle request dan response
// Biasanya juga handle validasi body

import express from 'express';
import  { getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    editUserById }  from './user.services';


const router = express.Router();


router.get('/:id', async (_req, res) => {
    try {
        const user = await getUserById(_req.params.id);
        res.send(user);
        
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get('/', async (_req, res) => {
    const users = await getAllUsers();
    res.send(users);
});

router.post('/', async (_req, res) => {
    try {
        const newUser = _req.body;
        const users = await createUser(newUser.email, newUser.name);
        
        res.send({
        data: users,
        message: 'User berhasil dibuat',
    });
    } catch (error) {
        res.status(404).send(error);        
    }
});

router.delete('/:id', async (_req, res) => {
    try {
        const userId = _req.params.id;
        await deleteUser(userId);

        res.send({
        data: userId,
        message: 'User berhasil dihapus',
    });
        
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/:id', async (_req, res) => {
    const userId = _req.params.id;
    const updatedUser = _req.body;

    if (!updatedUser.email && !updatedUser.name) {
        return res.status(400).send('Email dan nama harus diisi');
    }

    const user = await editUserById(userId, updatedUser.email, updatedUser.name);
    res.send({
        data: user,
        message: 'Sukses mengPut user',
    });
});

router.patch('/:id', async (_req, res) => {
    try {
        const userId = _req.params.id;
        const updatedUser = _req.body;
    
        const user = await editUserById(userId, updatedUser.email, updatedUser.name);
        res.send({
            data: user,
            message: 'Sukses mengPatch user',
        });
        
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;
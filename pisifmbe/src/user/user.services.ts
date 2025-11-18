// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya
// reusable

import { get } from 'http';
import prisma from '../db';

const getAllUsers = async () => {
    return await prisma.user.findMany();
    
};

const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });
      if (!user) {
        throw Error('User tidak ditemukan');
    }
    return user;
};

const createUser = async (email: string, name: string) => {
    return await prisma.user.create({
        data: {
            email,
            name,
        },
    });

};

const deleteUser = async (id: string) => {
    const user = await getUserById(id);

    return await prisma.user.delete({
        where: {
            id,
        },
    });
};

const editUserById = async (id: string, email: string, name: string) => {
    await getUserById(id);
    const user = await prisma.user.update({
        where: {
            id,
        },
        data: {
            email,
            name,
        }
    });
    return user;
};

export {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    editUserById,
};
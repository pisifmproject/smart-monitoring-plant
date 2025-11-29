"use strict";
// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya
// reusable
// NOTE: Legacy code - not used in production server.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserById = exports.deleteUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const getAllUsers = async () => {
    // return await prisma.user.findMany();
    return [];
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id,
    //   },
    // });
    // if (!user) {
    //   throw Error("User tidak ditemukan");
    // }
    // return user;
    throw Error("User service not implemented");
};
exports.getUserById = getUserById;
const createUser = async (email, name) => {
    // return await prisma.user.create({
    //   data: {
    //     email,
    //     name,
    //   },
    // });
    throw Error("User service not implemented");
};
exports.createUser = createUser;
const deleteUser = async (id) => {
    // const user = await getUserById(id);
    // return await prisma.user.delete({
    //   where: {
    //     id,
    //   },
    // });
    throw Error("User service not implemented");
};
exports.deleteUser = deleteUser;
const editUserById = async (id, email, name) => {
    // await getUserById(id);
    // const user = await prisma.user.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     email,
    //     name,
    //   },
    // });
    // return user;
    throw Error("User service not implemented");
};
exports.editUserById = editUserById;

// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya
// reusable
// NOTE: Legacy code - not used in production server.ts

import { get } from "http";
import { db } from "../db";

const getAllUsers = async () => {
  // return await prisma.user.findMany();
  return [];
};

const getUserById = async (id: string) => {
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

const createUser = async (email: string, name: string) => {
  // return await prisma.user.create({
  //   data: {
  //     email,
  //     name,
  //   },
  // });
  throw Error("User service not implemented");
};

const deleteUser = async (id: string) => {
  // const user = await getUserById(id);
  // return await prisma.user.delete({
  //   where: {
  //     id,
  //   },
  // });
  throw Error("User service not implemented");
};

const editUserById = async (id: string, email: string, name: string) => {
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

export { getAllUsers, getUserById, createUser, deleteUser, editUserById };

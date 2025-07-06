import { prisma } from "../../config/db";

export const AdminService = {
  getAll: () =>
    prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        speciality: true,
        degree: true,
        experience: true,
        available: true,
        fees: true,
        date: true,
        slotsBooked: true,
        address: true,
        image: true,
        about: true,
        createdAt: true,
      },
    }),
  create: (data: any) => prisma.doctor.create({ data }),
  getDoctorByEmail: (email: string) =>
    prisma.doctor.findUnique({ where: { email } }),
};

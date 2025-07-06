import { prisma } from "../../config/db";

export const UserService = {
  getProfile: (id: number) => prisma.user.findUnique({ where: { id } }),
  create: (data: any) => prisma.user.create({ data }),
  getUser: (email: string) => prisma.user.findUnique({ where: { email } }),
  update: (data: any, id: number) =>
    prisma.user.update({ where: { id }, data }),
  bookAppointment: (data: any) => prisma.appointment.create({ data }),
  updateDoctor: async (slotsBooked: Record<string, string[]>, id: number) => {
    return await prisma.doctor.update({
      where: { id },
      data: {
        slotsBooked,
      },
    });
  },
};

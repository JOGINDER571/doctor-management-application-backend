import { prisma } from "../../config/db";

export const UserService = {
  getProfile: (id: number) => prisma.user.findUnique({ where: { id } }),
  create: (data: any) => prisma.user.create({ data }),
  getUser: (email: string) => prisma.user.findUnique({ where: { email } }),
  getAllUsers: () => prisma.user.findMany(),
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
  getAppointments: (userId: number) => {
    return prisma.appointment.findMany({
      where: { userId },
    });
  },
  getAppointment: (appointmentId: number) => {
    return prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
  },
  cancelAppointment: (appointmentId: number) => {
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { cancelled: true },
    });
  },
  updateAppointment: (appointmentId: number) => {
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { payment: true },
    });
  },

  getAllAppointments: () => {
    return prisma.appointment.findMany();
  },
  
};

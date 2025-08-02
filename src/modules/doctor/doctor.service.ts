import { prisma } from "../../config/db";

export const DoctorService = {
  getDoctor: (id: number) => prisma.doctor.findUnique({ where: { id } }),
  getDoctorByEmail: (email: string) => prisma.doctor.findUnique({ where: { email } }),
  updateAvailability: async (id: number) => {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: { available: true },
    });

    if (!doctor) throw new Error("Doctor not found");

    return prisma.doctor.update({
      where: { id },
      data: { available: !doctor.available },
    });
  },
  updateDoctor: (id: number, attr:any) => prisma.doctor.update({
    where: { id },
    data: { ...attr },
  }),
  getAll: () =>
    prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
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
  getAppointments: (docId:number) => prisma.appointment.findMany({where: { docId }}),   
  appointment: (appointmentId:number) => prisma.appointment.findUnique({where:{id:appointmentId}}),
  updateAppointment: (appointmentId: number,attr:any) =>
  prisma.appointment.update({
    where: { id: appointmentId },
    data: { ...attr },
  }),
};

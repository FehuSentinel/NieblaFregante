// ✅ seed/seedCiudad.js
import Ciudad from '../models/ciudad.js';

export const seedCiudades = async () => {
  const ciudades = [
    { nombre: 'Santiago' },
    // futuras ciudades
  ];

  for (const ciudad of ciudades) {
    const existente = await Ciudad.findOne({ where: { nombre: ciudad.nombre } });
    if (!existente) {
      await Ciudad.create(ciudad);
      console.log(`✅ Ciudad creada: ${ciudad.nombre}`);
    } else {
      console.log(`⚠️ Ciudad ya existe: ${ciudad.nombre}`);
    }
  }

  console.log('✔️ Seed de ciudades completado');
};

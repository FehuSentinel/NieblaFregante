import Ciudad from '../models/ciudad.js';
import Comuna from '../models/comuna.js';

const comunasPorCiudad = {
  Santiago: [
    'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
    'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja',
    'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo',
    'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda',
    'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal',
    'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón',
    'Santiago Centro', 'Vitacura', 'Puente Alto', 'San Bernardo',
    'El Monte', 'Padre Hurtado', 'Peñaflor', 'Talagante', 'Isla de Maipo'
  ],
  // Puedes escalar a otras ciudades más adelante:
  // Valparaíso: ['Viña del Mar', 'Quilpué', ...],
};

export const seedComunas = async () => {
  for (const [nombreCiudad, comunas] of Object.entries(comunasPorCiudad)) {
    const ciudad = await Ciudad.findOne({ where: { nombre: nombreCiudad } });

    if (!ciudad) {
      console.warn(`⚠️ Ciudad no encontrada: ${nombreCiudad}. Saltando...`);
      continue;
    }

    for (const nombreComuna of comunas) {
      const existente = await Comuna.findOne({
        where: { nombre: nombreComuna, id_ciudad: ciudad.idCiudad }
      });

      if (!existente) {
        await Comuna.create({
          nombre: nombreComuna,
          id_ciudad: ciudad.idCiudad
        });
        console.log(`✅ Comunas creada`);
      } else {
        console.log(`↪️ Comunas ya existen`);
      }
    }
  }

  console.log('✔️ Seed de comunas completado');
};

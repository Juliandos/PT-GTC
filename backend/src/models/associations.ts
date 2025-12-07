import User from './user.js';
import Destination from './destination.js';

// Configurar relaciones
User.hasMany(Destination, { 
  foreignKey: 'userId', 
  as: 'destinations' 
});

Destination.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

export { User, Destination };
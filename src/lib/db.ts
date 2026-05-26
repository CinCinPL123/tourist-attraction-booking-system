import { Sequelize, DataTypes, Model } from 'sequelize';
import path from 'path';

let sequelize: Sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(process.cwd(), 'database.sqlite'),
    logging: false,
  });
} else {
  if (!(global as any).sequelize) {
    (global as any).sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(process.cwd(), 'database.sqlite'),
      logging: false,
    });
  }
  sequelize = (global as any).sequelize;
}

export { sequelize };

export class Category extends Model {
  declare id: number;
  declare name: string;
}
Category.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
}, { sequelize, modelName: 'Category' });

export class Attraction extends Model {
  declare id: number;
  declare title: string;
  declare category: string;
  declare price: number;
  declare kidFriendly: boolean;
  declare rating: number;
  declare lat: number;
  declare lng: number;
  declare image: string;
  declare desc: string;
  declare isApproved: boolean;
  declare providerName: string;
}
Attraction.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  kidFriendly: { type: DataTypes.BOOLEAN, defaultValue: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 5.0 },
  lat: { type: DataTypes.FLOAT, allowNull: false },
  lng: { type: DataTypes.FLOAT, allowNull: false },
  image: { type: DataTypes.TEXT, allowNull: true },
  desc: { type: DataTypes.TEXT, allowNull: true },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
  providerName: { type: DataTypes.STRING, defaultValue: 'Organizator' },
}, { sequelize, modelName: 'Attraction' });

export class Review extends Model {
  declare id: number;
  declare attractionId: number;
  declare author: string;
  declare rating: number;
  declare comment: string;
  declare reply: string;
  declare isFlagged: boolean;
}
Review.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  attractionId: { type: DataTypes.INTEGER, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false },
  reply: { type: DataTypes.TEXT, defaultValue: '' },
  isFlagged: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'Review' });

export class Booking extends Model {
  declare id: number;
  declare attractionId: number;
  declare userId: number;
  declare date: string;
  declare ticketsCount: number;
  declare totalPrice: number;
  declare status: 'pending' | 'accepted' | 'declined';
}
Booking.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  attractionId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  date: { type: DataTypes.STRING, allowNull: false },
  ticketsCount: { type: DataTypes.INTEGER, allowNull: false },
  totalPrice: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending', allowNull: false },
}, { sequelize, modelName: 'Booking' });

export class BlockedDate extends Model {
  declare id: number;
  declare date: string;
}
BlockedDate.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { sequelize, modelName: 'BlockedDate' });

export class CmsPage extends Model {
  declare id: number;
  declare slug: string;
  declare title: string;
  declare content: string;
}
CmsPage.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, { sequelize, modelName: 'CmsPage' });

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: 'tourist' | 'provider' | 'admin';
  declare phoneNumber: string;
  declare companyName: string;
  declare description: string;
  declare taxNumber: string;
  declare roleLevel: number;
}
User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, allowNull: true },
  companyName: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  taxNumber: { type: DataTypes.STRING, allowNull: true },
  roleLevel: { type: DataTypes.INTEGER, allowNull: true },
}, { sequelize, modelName: 'User' });

Attraction.hasMany(Review, { foreignKey: 'attractionId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Attraction, { foreignKey: 'attractionId', as: 'attraction' });

Attraction.hasMany(Booking, { foreignKey: 'attractionId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(Attraction, { foreignKey: 'attractionId', as: 'attraction' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

let hasInitialized = false;
export async function initDb() {
  if (hasInitialized) return { sequelize };
  
  await sequelize.sync();

  const userCount = await User.count();
  if (userCount === 0) {
    await User.bulkCreate([
      {
        name: 'John Doe',
        email: 'tourist@test.com',
        password: 'tourist123',
        role: 'tourist',
        phoneNumber: '+48 500 600 700'
      },
      {
        name: 'Local Guide Services',
        email: 'provider@test.com',
        password: 'provider123',
        role: 'provider',
        companyName: 'Local Guide Services Ltd.',
        description: 'Professional sightseeing and guided excursions in Poland.',
        taxNumber: 'PL1234567890'
      },
      {
        name: 'Admin Supervisor',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
        roleLevel: 10
      }
    ]);
  }
  
  const catCount = await Category.count();
  if (catCount === 0) {
    await Category.bulkCreate([
      { name: 'Museums' },
      { name: 'Monuments' },
      { name: 'Entertainment' },
      { name: 'Adventure' },
      { name: 'Restaurants' }
    ]);
  }
  
  const attCount = await Attraction.count();
  if (attCount === 0) {
    const krakow = await Attraction.create({
      title: "Museum of Illusions in Krakow",
      category: "Museums",
      price: 45,
      kidFriendly: true,
      rating: 4.8,
      lat: 50.0647,
      lng: 19.9450,
      image: "/uploads/krakow.jpg",
      desc: "Step into a world where physics meets magic. Dozens of interactive exhibits, optical illusions, and mirror rooms that will amaze visitors of all ages.",
      isApproved: true,
      providerName: "Local Guide Services Ltd."
    });

    const dunajec = await Attraction.create({
      title: "Dunajec River Kayaking",
      category: "Adventure",
      price: 120,
      kidFriendly: false,
      rating: 4.9,
      lat: 49.4316,
      lng: 20.4361,
      image: "/uploads/dunajec.jpg",
      desc: "An exciting kayaking trip along the picturesque Dunajec River gorge. Perfect for active recreation lovers and stunning landscape views.",
      isApproved: true,
      providerName: "Local Guide Services Ltd."
    });

    const malbork = await Attraction.create({
      title: "Gothic Castle in Malbork",
      category: "Monuments",
      price: 80,
      kidFriendly: true,
      rating: 4.7,
      lat: 54.0398,
      lng: 19.0283,
      image: "/uploads/malbork.jpg",
      desc: "The largest castle in the world by land area. Explore the fascinating history of the Teutonic Order with a professional audio guide.",
      isApproved: true,
      providerName: "Malbork Castle Museum"
    });

    const tatry = await Attraction.create({
      title: "Regional Inn 'Pod Tatrami'",
      category: "Restaurants",
      price: 65,
      kidFriendly: true,
      rating: 4.5,
      lat: 49.2993,
      lng: 19.9495,
      image: "/uploads/tatry.jpg",
      desc: "Traditional highlander cuisine served in an authentic wooden chalet with live folk music. Famous grilled oscypek cheese guaranteed.",
      isApproved: true,
      providerName: "Pod Tatrami Inn Group"
    });

    await Attraction.create({
      title: "Wadowice Historic Walking Tour",
      category: "Monuments",
      price: 55,
      kidFriendly: true,
      lat: 49.8833,
      lng: 19.4917,
      image: "/uploads/wadowice.jpg",
      desc: "A walk with a certified guide through key spots of the historic town, including tasting of the famous traditional cream cakes.",
      isApproved: false,
      providerName: "Kremowka Tour Agency"
    });

    await Attraction.create({
      title: "Hot Air Balloon Flight Over Karkonosze",
      category: "Adventure",
      price: 390,
      kidFriendly: false,
      lat: 50.9044,
      lng: 15.7275,
      image: "/uploads/karkonosze.jpg",
      desc: "An exclusive scenic flight at sunrise for two, including a glass of champagne in the sky.",
      isApproved: false,
      providerName: "Baltic Ballooning"
    });

    await Review.bulkCreate([
      {
        attractionId: krakow.id,
        author: "Tomasz P.",
        rating: 5,
        comment: "Great experience! My kids didn't want to leave.",
        reply: "We are absolutely thrilled! We invite you to visit us again in autumn to see our new exhibits."
      },
      {
        attractionId: krakow.id,
        author: "Kamil S.",
        rating: 3,
        comment: "Very interesting place, but it gets extremely crowded on weekends.",
        reply: ""
      },
      {
        attractionId: krakow.id,
        author: "Anonymous",
        rating: 1,
        comment: "This place is a pure scam! Nothing works and everyone is screaming!!! Avoid at all costs!!!",
        reply: "",
        isFlagged: true
      },
      {
        attractionId: dunajec.id,
        author: "Alicja W.",
        rating: 5,
        comment: "Unforgettable views, well-prepared route, and excellent communication.",
        reply: ""
      },
      {
        attractionId: malbork.id,
        author: "Piotr K.",
        rating: 4,
        comment: "The tour takes about 3-4 hours, make sure to wear comfortable shoes.",
        reply: ""
      },
      {
        attractionId: tatry.id,
        author: "Marcin K.",
        rating: 5,
        comment: "Amazing food and wonderful atmosphere. We will definitely return!",
        reply: ""
      }
    ]);
  }

  const blockedDatesCount = await BlockedDate.count();
  if (blockedDatesCount === 0) {
    await BlockedDate.bulkCreate([
      { date: '2026-06-15' },
      { date: '2026-06-16' },
      { date: '2026-06-17' }
    ]);
  }

  const cmsCount = await CmsPage.count();
  if (cmsCount === 0) {
    await CmsPage.bulkCreate([
      {
        slug: 'o-nas',
        title: 'About Us',
        content: 'Tourist Attraction Booking System is an innovative digital marketplace connecting travelers seeking unique experiences with local attraction providers.'
      },
      {
        slug: 'regulamin',
        title: 'Terms of Service',
        content: 'Terms of Service regulate the booking platform usage, cancelations, payments, and general conditions of service.'
      },
      {
        slug: 'polityka-prywatnosci',
        title: 'Privacy Policy',
        content: 'We care about your privacy. All personal data is processed securely in compliance with standard regulations.'
      },
      {
        slug: 'kontakt',
        title: 'Contact',
        content: 'Get in touch with us at contact@booking-system.com or by calling: +48 123 456 789.'
      }
    ]);
  }

  hasInitialized = true;
  return { sequelize };
}

export async function resetDb() {
  await sequelize.sync({ force: true });

  await Category.bulkCreate([
    { name: 'Museums' },
    { name: 'Monuments' },
    { name: 'Entertainment' },
    { name: 'Adventure' },
    { name: 'Restaurants' }
  ]);

  await User.bulkCreate([
    {
      name: 'John Doe',
      email: 'tourist@test.com',
      password: 'tourist123',
      role: 'tourist',
      phoneNumber: '+48 500 600 700'
    },
    {
      name: 'Local Guide Services',
      email: 'provider@test.com',
      password: 'provider123',
      role: 'provider',
      companyName: 'Local Guide Services Ltd.',
      description: 'Professional sightseeing and guided excursions in Poland.',
      taxNumber: 'PL1234567890'
    },
    {
      name: 'Admin Supervisor',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      roleLevel: 10
    }
  ]);

  const krakow = await Attraction.create({
    title: "Museum of Illusions in Krakow",
    category: "Museums",
    price: 45,
    kidFriendly: true,
    rating: 4.8,
    lat: 50.0647,
    lng: 19.9450,
    image: "/uploads/krakow.jpg",
    desc: "Step into a world where physics meets magic. Dozens of interactive exhibits, optical illusions, and mirror rooms that will amaze visitors of all ages.",
    isApproved: true,
    providerName: "Local Guide Services Ltd."
  });

  const dunajec = await Attraction.create({
    title: "Dunajec River Kayaking",
    category: "Adventure",
    price: 120,
    kidFriendly: false,
    rating: 4.9,
    lat: 49.4316,
    lng: 20.4361,
    image: "/uploads/dunajec.jpg",
    desc: "An exciting kayaking trip along the picturesque Dunajec River gorge. Perfect for active recreation lovers and stunning landscape views.",
    isApproved: true,
    providerName: "Local Guide Services Ltd."
  });

  const malbork = await Attraction.create({
    title: "Gothic Castle in Malbork",
    category: "Monuments",
    price: 80,
    kidFriendly: true,
    rating: 4.7,
    lat: 54.0398,
    lng: 19.0283,
    image: "/uploads/malbork.jpg",
    desc: "The largest castle in the world by land area. Explore the fascinating history of the Teutonic Order with a professional audio guide.",
    isApproved: true,
    providerName: "Malbork Castle Museum"
  });

  const tatry = await Attraction.create({
    title: "Regional Inn 'Pod Tatrami'",
    category: "Restaurants",
    price: 65,
    kidFriendly: true,
    rating: 4.5,
    lat: 49.2993,
    lng: 19.9495,
    image: "/uploads/tatry.jpg",
    desc: "Traditional highlander cuisine served in an authentic wooden chalet with live folk music. Famous grilled oscypek cheese guaranteed.",
    isApproved: true,
    providerName: "Pod Tatrami Inn Group"
  });

  await Attraction.create({
    title: "Wadowice Historic Walking Tour",
    category: "Monuments",
    price: 55,
    kidFriendly: true,
    lat: 49.8833,
    lng: 19.4917,
    image: "/uploads/wadowice.jpg",
    desc: "A walk with a certified guide through key spots of the historic town, including tasting of the famous traditional cream cakes.",
    isApproved: false,
    providerName: "Kremowka Tour Agency"
  });

  await Attraction.create({
    title: "Hot Air Balloon Flight Over Karkonosze",
    category: "Adventure",
    price: 390,
    kidFriendly: false,
    lat: 50.9044,
    lng: 15.7275,
    image: "/uploads/karkonosze.jpg",
    desc: "An exclusive scenic flight at sunrise for two, including a glass of champagne in the sky.",
    isApproved: false,
    providerName: "Baltic Ballooning"
  });

  await Review.bulkCreate([
    {
      attractionId: krakow.id,
      author: "Tomasz P.",
      rating: 5,
      comment: "Great experience! My kids didn't want to leave.",
      reply: "We are absolutely thrilled! We invite you to visit us again in autumn to see our new exhibits."
    },
    {
      attractionId: krakow.id,
      author: "Kamil S.",
      rating: 3,
      comment: "Very interesting place, but it gets extremely crowded on weekends.",
      reply: ""
    },
    {
      attractionId: krakow.id,
      author: "Anonymous",
      rating: 1,
      comment: "This place is a pure scam! Nothing works and everyone is screaming!!! Avoid at all costs!!!",
      reply: "",
      isFlagged: true
    },
    {
      attractionId: dunajec.id,
      author: "Alicja W.",
      rating: 5,
      comment: "Unforgettable views, well-prepared route, and excellent communication.",
      reply: ""
    },
    {
      attractionId: malbork.id,
      author: "Piotr K.",
      rating: 4,
      comment: "The tour takes about 3-4 hours, make sure to wear comfortable shoes.",
      reply: ""
    },
    {
      attractionId: tatry.id,
      author: "Marcin K.",
      rating: 5,
      comment: "Amazing food and wonderful atmosphere. We will definitely return!",
      reply: ""
    }
  ]);

  await BlockedDate.bulkCreate([
    { date: '2026-06-15' },
    { date: '2026-06-16' },
    { date: '2026-06-17' }
  ]);

  await CmsPage.bulkCreate([
    {
      slug: 'o-nas',
      title: 'About Us',
      content: 'Tourist Attraction Booking System is an innovative digital marketplace connecting travelers seeking unique experiences with local attraction providers.'
    },
    {
      slug: 'regulamin',
      title: 'Terms of Service',
      content: 'Terms of Service regulate the booking platform usage, cancelations, payments, and general conditions of service.'
    },
    {
      slug: 'polityka-prywatnosci',
      title: 'Privacy Policy',
      content: 'We care about your privacy. All personal data is processed securely in compliance with standard regulations.'
    },
    {
      slug: 'kontakt',
      title: 'Contact',
      content: 'Get in touch with us at contact@booking-system.com or by calling: +48 123 456 789.'
    }
  ]);
}

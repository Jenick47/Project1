import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const females = [
  { name: 'Анастасия', email: 'anastasia@seed.test', age: 23, bio: 'Люблю путешествия и кофе ☕', photo: 'seed_1.png' },
  { name: 'Виктория',  email: 'victoria@seed.test',  age: 26, bio: 'Художница, обожаю закаты 🎨', photo: 'seed_2.png' },
  { name: 'Екатерина', email: 'ekaterina@seed.test', age: 24, bio: 'Йога и здоровый образ жизни 🧘', photo: 'seed_3.png' },
  { name: 'Мария',     email: 'maria@seed.test',     age: 22, bio: 'Книги, музыка и хорошее настроение 📚', photo: 'seed_4.png' },
  { name: 'Дарья',     email: 'darya@seed.test',     age: 25, bio: 'Танцую и пою, ищу своего человека 💃', photo: 'seed_5.png' },
  { name: 'Юлия',      email: 'julia@seed.test',     age: 27, bio: 'Программист, люблю кошек и кино 🐱', photo: 'seed_6.png' },
  { name: 'Алина',     email: 'alina@seed.test',     age: 21, bio: 'Студентка, мечтаю о большом мире 🌍', photo: 'seed_7.png' },
  { name: 'Ксения',    email: 'ksenia@seed.test',    age: 28, bio: 'Шеф-повар, готовлю с душой 🍝', photo: 'seed_8.png' },
  { name: 'Татьяна',   email: 'tatyana@seed.test',   age: 30, bio: 'Психолог, умею слушать и понимать 💬', photo: 'seed_9.png' },
  { name: 'Наталья',   email: 'natalya@seed.test',   age: 29, bio: 'Бегаю марафоны и люблю горы 🏔️', photo: 'seed_10.png' },
  { name: 'Елена',     email: 'elena@seed.test',     age: 26, bio: 'Дизайнер интерьеров, творческая натура ✨', photo: 'seed_11.png' },
  { name: 'Ольга',     email: 'olga@seed.test',      age: 31, bio: 'Врач, ценю искренность и юмор 😄', photo: 'seed_12.png' },
  { name: 'Валерия',   email: 'valeria@seed.test',   age: 24, bio: 'Фотограф, вижу красоту в деталях 📸', photo: 'seed_13.png' },
  { name: 'Полина',    email: 'polina@seed.test',    age: 22, bio: 'Музыкант, играю на гитаре 🎸', photo: 'seed_14.png' },
];

const males = [
  { name: 'Александр', email: 'alexander@seed.test', age: 27, bio: 'Предприниматель, люблю активный отдых 🚀', photo: 'seed_15.png' },
  { name: 'Дмитрий',   email: 'dmitry@seed.test',    age: 30, bio: 'Инженер, занимаюсь скалолазанием 🧗', photo: 'seed_16.png' },
  { name: 'Иван',      email: 'ivan@seed.test',       age: 25, bio: 'Путешественник, был в 30 странах 🌏', photo: 'seed_17.png' },
  { name: 'Максим',    email: 'maxim@seed.test',      age: 28, bio: 'Спортсмен, тренирую бокс 🥊', photo: 'seed_18.png' },
  { name: 'Артём',     email: 'artem@seed.test',      age: 24, bio: 'Разработчик, создаю игры по ночам 🎮', photo: 'seed_19.png' },
  { name: 'Никита',    email: 'nikita@seed.test',     age: 26, bio: 'Архитектор, рисую и проектирую 🏛️', photo: 'seed_20.png' },
  { name: 'Михаил',    email: 'mikhail@seed.test',    age: 32, bio: 'Шеф-повар, приготовлю ужин для двоих 🍷', photo: 'seed_21.png' },
  { name: 'Кирилл',    email: 'kirill@seed.test',     age: 23, bio: 'Музыкант, барабанщик в группе 🥁', photo: 'seed_22.png' },
  { name: 'Сергей',    email: 'sergey@seed.test',     age: 29, bio: 'Ветеринар, спасаю животных ежедневно 🐾', photo: 'seed_23.png' },
  { name: 'Андрей',    email: 'andrey@seed.test',     age: 27, bio: 'Режиссёр, снимаю документалки 🎬', photo: 'seed_24.png' },
  { name: 'Павел',     email: 'pavel@seed.test',      age: 31, bio: 'Пилот, смотрю на мир сверху ✈️', photo: 'seed_25.png' },
  { name: 'Роман',     email: 'roman@seed.test',      age: 25, bio: 'Адвокат, защищаю справедливость ⚖️', photo: 'seed_26.png' },
  { name: 'Денис',     email: 'denis@seed.test',      age: 28, bio: 'Доктор, работаю в скорой помощи 🚑', photo: 'seed_27.png' },
  { name: 'Евгений',   email: 'evgeny@seed.test',     age: 33, bio: 'Геолог, исследую недра земли 🪨', photo: 'seed_28.png' },
];

async function main() {
  console.log('🌱 Seeding test users...');

  // Удаляем связанные данные и старых seed-пользователей
  const seedUsers = await prisma.user.findMany({
    where: { email: { contains: '@seed.test' } },
    select: { id: true },
  });
  const seedIds = seedUsers.map(u => u.id);

  if (seedIds.length > 0) {
    await prisma.match.deleteMany({
      where: { OR: [{ user1Id: { in: seedIds } }, { user2Id: { in: seedIds } }] },
    });
    await prisma.swipe.deleteMany({
      where: { OR: [{ swiperId: { in: seedIds } }, { swipedId: { in: seedIds } }] },
    });
    await prisma.user.deleteMany({
      where: { id: { in: seedIds } },
    });
  }

  const passwordHash = await bcrypt.hash('password123', 10);

  for (const f of females) {
    await prisma.user.create({
      data: {
        email: f.email,
        passwordHash,
        name: f.name,
        age: f.age,
        bio: f.bio,
        gender: 'female',
        photoUrl: `/uploads/${f.photo}`,
      },
    });
    console.log(`  ✅ ${f.name} — ${f.email} (female)`);
  }

  for (const m of males) {
    await prisma.user.create({
      data: {
        email: m.email,
        passwordHash,
        name: m.name,
        age: m.age,
        bio: m.bio,
        gender: 'male',
        photoUrl: `/uploads/${m.photo}`,
      },
    });
    console.log(`  ✅ ${m.name} — ${m.email} (male)`);
  }

  console.log('\n🎉 Done! 28 test users created.');
  console.log('   Password for all: password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import pool from '../src/config/database';
import { ideas as ideasData } from './ideas';

// const sampleIdeas = [
//   {
//     title: 'Улучшение пользовательского интерфейса',
//     description: 'Переработать дизайн главной страницы для повышения удобства использования и привлекательности'
//   },
//   {
//     title: 'Мобильное приложение',
//     description: 'Разработать мобильную версию приложения для iOS и Android с полным функционалом'
//   },
//   {
//     title: 'Система уведомлений',
//     description: 'Добавить push-уведомления и email-рассылку для информирования пользователей о важных событиях'
//   },
//   {
//     title: 'Интеграция с социальными сетями',
//     description: 'Возможность авторизации через Google, Facebook, VK и других социальных платформ'
//   },
//   {
//     title: 'Расширенная аналитика',
//     description: 'Добавить детальную аналитику использования продукта с графиками и отчетами'
//   },
//   {
//     title: 'Многоязычная поддержка',
//     description: 'Добавить поддержку английского, немецкого, французского и других языков'
//   },
//   {
//     title: 'API для сторонних разработчиков',
//     description: 'Создать REST API для интеграции с внешними сервисами и приложениями'
//   },
//   {
//     title: 'Система ролей и прав доступа',
//     description: 'Реализовать гибкую систему ролей с различными уровнями доступа к функциям'
//   },
//   {
//     title: 'Автоматическое резервное копирование',
//     description: 'Настроить автоматическое создание резервных копий данных с возможностью восстановления'
//   },
//   {
//     title: 'Темная тема интерфейса',
//     description: 'Добавить переключатель между светлой и темной темой оформления'
//   },
//   {
//     title: 'Система поиска и фильтрации',
//     description: 'Улучшить поиск с возможностью фильтрации по различным критериям'
//   },
//   {
//     title: 'Экспорт данных',
//     description: 'Возможность экспорта данных в различных форматах (CSV, Excel, PDF)'
//   },
//   {
//     title: 'Система комментариев',
//     description: 'Добавить возможность комментирования и обсуждения различных элементов'
//   },
//   {
//     title: 'Интеграция с платежными системами',
//     description: 'Подключить Stripe, PayPal и другие платежные системы для монетизации'
//   },
//   {
//     title: 'Система рекомендаций',
//     description: 'Внедрить алгоритмы машинного обучения для персонализированных рекомендаций'
//   },
//   {
//     title: 'Офлайн-режим',
//     description: 'Добавить возможность работы с приложением без подключения к интернету'
//   },
//   {
//     title: 'Геймификация',
//     description: 'Добавить элементы игры: достижения, рейтинги, бейджи для повышения вовлеченности'
//   },
//   {
//     title: 'Интеграция с календарем',
//     description: 'Синхронизация с Google Calendar, Outlook и другими календарными приложениями'
//   }
// ];

async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');

    // Проверяем, есть ли уже данные
    const existingIdeas = await pool.query('SELECT COUNT(*) FROM ideas');
    if (parseInt(existingIdeas.rows[0].count) > 0) {
      console.log('⚠️  Database already contains data. Skipping seed.');
      return;
    }

    // Вставляем тестовые данные
    for (const idea of ideasData) {
      await pool.query(
        'INSERT INTO ideas (title, description) VALUES ($1, $2)',
        [idea.title, idea.description]
      );
    }

    console.log(`✅ Successfully seeded ${ideasData.length} ideas`);
    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();

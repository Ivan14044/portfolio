export type Language = 'uk' | 'ru' | 'en';
export const LANGUAGES: readonly Language[] = ['uk', 'ru', 'en'] as const;

export const translations = {
  uk: {
    name: "Дар'я Коваль",
    title: "PHOTO EDITOR | E-COMMERCE SPECIALIST",
    status: "Відкрита до співпраці",
    summary: [
      "Я спеціалізуюся на професійній обробці фотографій для e-commerce. Моя головна задача — перетворювати неякісний або аматорський контент на візуально привабливі, продаючі зображення для Instagram магазинів та маркетплейсів.",
      "За останні 5 років я обробила тисячі товарних фото для десятків брендів. Працюю з картками товарів, каталогами, фотосесіями для соцмереж. Кожне зображення проходить ретельну обробку: ретуш, кольорокорекцію, обтравку фону та доведення до вимог маркетплейсів.",
      "Мій підхід — не просто покращити фото, а створити візуальну ідентичність бренду через обробку. Я розумію специфіку різних майданчиків та вимоги до зображень, що дозволяє моїм клієнтам продавати більше та виглядати професійно."
    ],
    experience: [
      {
        role: "Senior Photo Editor | E-commerce Specialist",
        period: "2022 - До сьогодні",
        company: "Creative Media Lab",
        description: "Спеціалізуюся на обробці товарних фото для великих брендів у нішах Fashion, Beauty та Tech. Працюю з Instagram магазинами та маркетплейсами, забезпечуючи професійну обробку карток товарів, каталогів та контенту для соцмереж.",
        details: [
          "Професійна обробка товарних фото для Instagram магазинів та маркетплейсів",
          "Ретуш та кольорокорекція карток товарів з дотриманням вимог майданчиків",
          "Обтравка та заміна фону на білий або прозорий для маркетплейсів",
          "Обробка каталогів та фотосесій для брендів Fashion, Beauty, Tech",
          "Приведення аматорських фото до професійного вигляду",
          "Створення єдиного візуального стилю через обробку для брендів",
          "Робота з великими обсягами: обробка сотень товарних фото",
          "Оптимізація зображень під вимоги різних маркетплейсів"
        ]
      },
      {
        role: "Photo Retoucher | E-commerce Editor",
        period: "2019 - 2022",
        company: "Digital Trend Agency",
        description: "Спеціалізувалася на обробці фотографій для клієнтів агентства. Працювала з товарними фото для e-commerce, ретушшю та кольорокорекцією для соціальних мереж та каталогів.",
        details: [
          "Ретуш та кольорокорекція товарних фото для онлайн-магазинів",
          "Обробка фотографій для публікацій в Instagram та інших соцмережах",
          "Створення єдиного візуального стилю через обробку для брендів",
          "Обтравка та заміна фону на товарних фото",
          "Робота з великими обсягами фотографій для каталогів",
          "Координація роботи з фотографами для отримання якісного вихідного матеріалу",
          "Розробка гайдлайнів з обробки для підтримки єдиного стилю",
          "Моніторинг трендів в обробці фото для e-commerce та адаптація під клієнтів"
        ]
      }
    ],
    skills: [
      "Photo Retouching",
      "Color Grading",
      "E-commerce Photography",
      "Product Photo Editing",
      "Catalog Design",
      "Background Removal",
      "Photo Optimization"
    ],
    nav: {
      home: "Головна",
      summary: "Про себе",
      experience: "Досвід",
      portfolio: "Портфоліо",
      skills: "Навички",
      links: "Контакти",
      contact: "Форма"
    },
    sections: {
      summary: "Про себе",
      experience: "Досвід роботи",
      skills: "Навички та інструменти",
      links: "Зв'яжіться зі мною",
      contact: "Форма зворотного зв'язку",
      languages: "Мови",
      portfolio: "Портфоліо",
      selectedProjects: "Вибрані проекти",
      caseStudies: "Кейси",
      before: "До",
      after: "Після",
      client: "Клієнт",
      category: "Категорія",
      services: "Послуги"
    },
    contact: {
      emailMe: "Напишіть мені",
      telegramMe: "Telegram"
    },
    contactForm: {
      title: "Зв'яжіться зі мною",
      description: "Заповніть форму, і я зв'яжуся з вами найближчим часом",
      fields: {
        name: "Ім'я",
        platform: "Платформа",
        contact: "Контакт",
        message: "Повідомлення"
      },
      placeholders: {
        name: "Ваше ім'я",
        contact: "@username або номер телефону",
        message: "Розкажіть про ваш проект... (необов'язково)"
      },
      optional: "необов'язково",
      submit: "Відправити",
      submitting: "Відправляється...",
      success: "Повідомлення відправлено!",
      error: "Помилка відправки. Спробуйте ще раз.",
      validation: {
        nameRequired: "Введіть ваше ім'я",
        nameMin: "Ім'я повинно містити мінімум 2 символи",
        platformRequired: "Виберіть платформу",
        contactRequired: "Введіть контакт",
        telegramFormat: "Telegram: введіть @username або номер телефону",
        instagramFormat: "Instagram: введіть @username",
        messageRequired: "Введіть повідомлення",
        messageMin: "Повідомлення повинно містити мінімум 10 символів"
      }
    },
    footer: {
      copyright: "© 2025 Framer template",
      by: "by Anton Drukarov",
      downloadCV: "Завантажити CV",
      privacy: "Політика конфіденційності",
      terms: "Умови використання",
      cookies: "Політика cookies"
    },
    privacyPolicy: {
      title: "Політика конфіденційності",
      lastUpdated: "Останнє оновлення: 2025",
      sections: [
        {
          title: "1. Загальні положення",
          content: "Ця Політика конфіденційності описує, як ми збираємо, використовуємо та захищаємо вашу персональну інформацію при використанні цього веб-сайту. Ми цінуємо вашу конфіденційність і зобов'язуємося захищати ваші персональні дані відповідно до чинного законодавства."
        },
        {
          title: "2. Збір інформації",
          content: "Ми можемо збирати наступні типи інформації: контактні дані (ім'я, електронна пошта), технічні дані (IP-адреса, тип браузера), дані про використання сайту. Ця інформація збирається для покращення роботи сайту та надання вам кращого сервісу."
        },
        {
          title: "3. Використання cookies",
          content: "Наш веб-сайт використовує cookies для збору технічної інформації та аналітики. Cookies - це невеликі текстові файли, які зберігаються на вашому пристрої. Ви можете керувати налаштуваннями cookies через налаштування вашого браузера."
        },
        {
          title: "4. Ваші права",
          content: "Відповідно до GDPR та інших нормативних актів, ви маєте право на доступ до ваших персональних даних, їх виправлення, видалення, обмеження обробки та право на перенос даних. Для реалізації цих прав зверніться до нас за контактною інформацією, вказаною на сайті."
        },
        {
          title: "5. Безпека даних",
          content: "Ми вживаємо технічних та організаційних заходів для захисту ваших персональних даних від несанкціонованого доступу, втрати або знищення. Однак жоден метод передачі через інтернет не є абсолютно безпечним."
        },
        {
          title: "6. Контактна інформація",
          content: "Якщо у вас є питання щодо цієї Політики конфіденційності, будь ласка, зв'яжіться з нами за адресою: daria.koval@creator.com"
        }
      ]
    },
    termsOfService: {
      title: "Умови використання",
      lastUpdated: "Останнє оновлення: 2025",
      sections: [
        {
          title: "1. Прийняття умов",
          content: "Використовуючи цей веб-сайт, ви приймаєте та погоджуєтеся дотримуватися цих Умов використання. Якщо ви не згодні з будь-якою частиною цих умов, будь ласка, не використовуйте цей сайт."
        },
        {
          title: "2. Використання сайту",
          content: "Цей веб-сайт призначений для ознайомлення з портфоліо та контактною інформацією. Ви можете переглядати контент для особистих, некомерційних цілей. Заборонено використовувати сайт для незаконних або несанкціонованих цілей."
        },
        {
          title: "3. Інтелектуальна власність",
          content: "Весь контент на цьому сайті, включаючи тексти, зображення, логотипи та дизайн, є власністю власника сайту або використовується з дозволу. Будь-яке несанкціоноване копіювання, розповсюдження або використання заборонено."
        },
        {
          title: "4. Обмеження відповідальності",
          content: "Сайт надається 'як є' без гарантій будь-якого роду. Ми не несемо відповідальності за будь-які прямі, непрямі, випадкові або наслідкові збитки, що виникають в результаті використання або неможливості використання сайту."
        },
        {
          title: "5. Зміни в умовах",
          content: "Ми залишаємо за собою право змінювати ці Умови використання в будь-який час. Зміни набувають чинності з моменту їх публікації на сайті. Рекомендуємо періодично переглядати ці умови."
        },
        {
          title: "6. Контакти",
          content: "З питань щодо цих Умов використання звертайтеся за адресою: daria.koval@creator.com"
        }
      ]
    },
    cookiePolicy: {
      title: "Політика використання cookies",
      lastUpdated: "Останнє оновлення: 2025",
      sections: [
        {
          title: "1. Що таке cookies",
          content: "Cookies - це невеликі текстові файли, які зберігаються на вашому пристрої (комп'ютері, планшеті або мобільному телефоні) при відвідуванні веб-сайту. Cookies дозволяють сайту запам'ятовувати ваші дії та налаштування протягом певного періоду часу."
        },
        {
          title: "2. Типи cookies, які ми використовуємо",
          content: "Технічні cookies: необхідні для роботи сайту та забезпечення базових функцій. Аналітичні cookies: допомагають нам зрозуміти, як відвідувачі взаємодіють з сайтом, збираючи анонімну статистику."
        },
        {
          title: "3. Мета використання",
          content: "Ми використовуємо cookies для: забезпечення коректної роботи сайту, аналізу відвідуваності та покращення користувацького досвіду, запам'ятовування ваших налаштувань (наприклад, вибраної мови)."
        },
        {
          title: "4. Управління cookies",
          content: "Ви можете контролювати та керувати cookies через налаштування вашого браузера. Більшість браузерів дозволяють видаляти cookies або блокувати їх встановлення. Зверніть увагу, що блокування cookies може вплинути на функціональність сайту."
        },
        {
          title: "5. Сторонні сервіси",
          content: "Наш сайт може використовувати сторонні сервіси аналітики, які також використовують cookies. Ці сервіси допомагають нам аналізувати використання сайту та покращувати його роботу."
        },
        {
          title: "6. Контакти",
          content: "Якщо у вас є питання щодо використання cookies, зв'яжіться з нами: daria.koval@creator.com"
        }
      ]
    },
    cookieConsent: {
      title: "Ми використовуємо cookies",
      description: "Цей сайт використовує cookies для покращення роботи та аналітики. Ви можете прийняти всі cookies або налаштувати їх використання.",
      acceptAll: "Прийняти всі",
      rejectAll: "Тільки необхідні",
      customize: "Налаштувати",
      learnMore: "Детальніше",
      categories: {
        necessary: "Необхідні",
        necessaryDesc: "Ці cookies необхідні для роботи сайту та не можуть бути вимкнені.",
        analytics: "Аналітичні",
        analyticsDesc: "Допомагають нам зрозуміти, як відвідувачі взаємодіють з сайтом.",
        marketing: "Маркетингові",
        marketingDesc: "Використовуються для відстеження відвідувачів на різних сайтах."
      }
    }
  },
  ru: {
    name: "Дарья Коваль",
    title: "PHOTO EDITOR | E-COMMERCE SPECIALIST",
    status: "Открыта к сотрудничеству",
    summary: [
      "Я специализируюсь на профессиональной обработке фотографий для e-commerce. Моя главная задача — превращать некачественный или любительский контент в визуально привлекательные, продающие изображения для Instagram магазинов и маркетплейсов.",
      "За последние 5 лет я обработала тысячи товарных фото для десятков брендов. Работаю с карточками товаров, каталогами, фотосессиями для соцсетей. Каждое изображение проходит тщательную обработку: ретушь, цветокоррекцию, обтравку фона и доведение до требований маркетплейсов.",
      "Мой подход — не просто улучшить фото, а создать визуальную идентичность бренда через обработку. Я понимаю специфику разных площадок и требования к изображениям, что позволяет моим клиентам продавать больше и выглядеть профессионально."
    ],
    experience: [
      {
        role: "Senior Photo Editor | E-commerce Specialist",
        period: "2022 - Настоящее время",
        company: "Creative Media Lab",
        description: "Специализируюсь на обработке товарных фото для крупных брендов в нишах Fashion, Beauty и Tech. Работаю с Instagram магазинами и маркетплейсами, обеспечивая профессиональную обработку карточек товаров, каталогов и контента для соцсетей.",
        details: [
          "Профессиональная обработка товарных фото для Instagram магазинов и маркетплейсов",
          "Ретушь и цветокоррекция карточек товаров с соблюдением требований площадок",
          "Обтравка и замена фона на белый или прозрачный для маркетплейсов",
          "Обработка каталогов и фотосессий для брендов Fashion, Beauty, Tech",
          "Приведение любительских фото к профессиональному виду",
          "Создание единого визуального стиля через обработку для брендов",
          "Работа с большими объемами: обработка сотен товарных фото",
          "Оптимизация изображений под требования различных маркетплейсов"
        ]
      },
      {
        role: "Photo Retoucher | E-commerce Editor",
        period: "2019 - 2022",
        company: "Digital Trend Agency",
        description: "Специализировалась на обработке фотографий для клиентов агентства. Работала с товарными фото для e-commerce, ретушью и цветокоррекцией для социальных сетей и каталогов.",
        details: [
          "Ретушь и цветокоррекция товарных фото для онлайн-магазинов",
          "Обработка фотографий для публикаций в Instagram и других соцсетях",
          "Создание единого визуального стиля через обработку для брендов",
          "Обтравка и замена фона на товарных фото",
          "Работа с большими объемами фотографий для каталогов",
          "Координация работы с фотографами для получения качественного исходного материала",
          "Разработка гайдлайнов по обработке для поддержания единого стиля",
          "Мониторинг трендов в обработке фото для e-commerce и адаптация под клиентов"
        ]
      }
    ],
    skills: [
      "Photo Retouching",
      "Color Grading",
      "E-commerce Photography",
      "Product Photo Editing",
      "Catalog Design",
      "Background Removal",
      "Photo Optimization"
    ],
    nav: {
      home: "Главная",
      summary: "О себе",
      experience: "Опыт",
      portfolio: "Портфолио",
      skills: "Навычки",
      links: "Контакты",
      contact: "Форма"
    },
    sections: {
      summary: "О себе",
      experience: "Опыт работы",
      skills: "Навычки и инструменты",
      links: "Свяжитесь со мной",
      contact: "Форма обратной связи",
      languages: "Языки",
      portfolio: "Портфолио",
      selectedProjects: "Избранные проекты",
      caseStudies: "Кейсы",
      before: "До",
      after: "После",
      client: "Клиент",
      category: "Категория",
      services: "Услуги"
    },
    contact: {
      emailMe: "Напишите мне",
      telegramMe: "Telegram"
    },
    footer: {
      copyright: "© 2025 Framer template",
      by: "by Anton Drukarov",
      downloadCV: "Скачать CV",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
      cookies: "Политика cookies"
    },
    privacyPolicy: {
      title: "Политика конфиденциальности",
      lastUpdated: "Последнее обновление: 2025",
      sections: [
        {
          title: "1. Общие положения",
          content: "Настоящая Политика конфиденциальности описывает, как мы собираем, используем и защищаем вашу персональную информацию при использовании данного веб-сайта. Мы ценим вашу конфиденциальность и обязуемся защищать ваши персональные данные в соответствии с действующим законодательством."
        },
        {
          title: "2. Сбор информации",
          content: "Мы можем собирать следующие типы информации: контактные данные (имя, электронная почта), технические данные (IP-адрес, тип браузера), данные об использовании сайта. Эта информация собирается для улучшения работы сайта и предоставления вам лучшего сервиса."
        },
        {
          title: "3. Использование cookies",
          content: "Наш веб-сайт использует cookies для сбора технической информации и аналитики. Cookies - это небольшие текстовые файлы, которые сохраняются на вашем устройстве. Вы можете управлять настройками cookies через настройки вашего браузера."
        },
        {
          title: "4. Ваши права",
          content: "В соответствии с GDPR и другими нормативными актами, вы имеете право на доступ к вашим персональным данным, их исправление, удаление, ограничение обработки и право на перенос данных. Для реализации этих прав обратитесь к нам по контактной информации, указанной на сайте."
        },
        {
          title: "5. Безопасность данных",
          content: "Мы принимаем технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, потери или уничтожения. Однако ни один метод передачи через интернет не является абсолютно безопасным."
        },
        {
          title: "6. Контактная информация",
          content: "Если у вас есть вопросы относительно настоящей Политики конфиденциальности, пожалуйста, свяжитесь с нами по адресу: daria.koval@creator.com"
        }
      ]
    },
    termsOfService: {
      title: "Условия использования",
      lastUpdated: "Последнее обновление: 2025",
      sections: [
        {
          title: "1. Принятие условий",
          content: "Используя данный веб-сайт, вы принимаете и соглашаетесь соблюдать настоящие Условия использования. Если вы не согласны с какой-либо частью этих условий, пожалуйста, не используйте данный сайт."
        },
        {
          title: "2. Использование сайта",
          content: "Данный веб-сайт предназначен для ознакомления с портфолио и контактной информацией. Вы можете просматривать контент в личных, некоммерческих целях. Запрещено использовать сайт для незаконных или несанкционированных целей."
        },
        {
          title: "3. Интеллектуальная собственность",
          content: "Весь контент на данном сайте, включая тексты, изображения, логотипы и дизайн, является собственностью владельца сайта или используется с разрешения. Любое несанкционированное копирование, распространение или использование запрещено."
        },
        {
          title: "4. Ограничение ответственности",
          content: "Сайт предоставляется 'как есть' без гарантий любого рода. Мы не несем ответственности за любые прямые, косвенные, случайные или последующие убытки, возникающие в результате использования или невозможности использования сайта."
        },
        {
          title: "5. Изменения в условиях",
          content: "Мы оставляем за собой право изменять настоящие Условия использования в любое время. Изменения вступают в силу с момента их публикации на сайте. Рекомендуем периодически просматривать эти условия."
        },
        {
          title: "6. Контакты",
          content: "По вопросам относительно настоящих Условий использования обращайтесь по адресу: daria.koval@creator.com"
        }
      ]
    },
    cookiePolicy: {
      title: "Политика использования cookies",
      lastUpdated: "Последнее обновление: 2025",
      sections: [
        {
          title: "1. Что такое cookies",
          content: "Cookies - это небольшие текстовые файлы, которые сохраняются на вашем устройстве (компьютере, планшете или мобильном телефоне) при посещении веб-сайта. Cookies позволяют сайту запоминать ваши действия и настройки в течение определенного периода времени."
        },
        {
          title: "2. Типы cookies, которые мы используем",
          content: "Технические cookies: необходимы для работы сайта и обеспечения базовых функций. Аналитические cookies: помогают нам понять, как посетители взаимодействуют с сайтом, собирая анонимную статистику."
        },
        {
          title: "3. Цель использования",
          content: "Мы используем cookies для: обеспечения корректной работы сайта, анализа посещаемости и улучшения пользовательского опыта, запоминания ваших настроек (например, выбранного языка)."
        },
        {
          title: "4. Управление cookies",
          content: "Вы можете контролировать и управлять cookies через настройки вашего браузера. Большинство браузеров позволяют удалять cookies или блокировать их установку. Обратите внимание, что блокировка cookies может повлиять на функциональность сайта."
        },
        {
          title: "5. Сторонние сервисы",
          content: "Наш сайт может использовать сторонние сервисы аналитики, которые также используют cookies. Эти сервисы помогают нам анализировать использование сайта и улучшать его работу."
        },
        {
          title: "6. Контакты",
          content: "Если у вас есть вопросы относительно использования cookies, свяжитесь с нами: daria.koval@creator.com"
        }
      ]
    },
    contactForm: {
      title: "Свяжитесь со мной",
      description: "Заполните форму, и я свяжусь с вами в ближайшее время",
      fields: {
        name: "Имя",
        platform: "Платформа",
        contact: "Контакт",
        message: "Сообщение"
      },
      placeholders: {
        name: "Ваше имя",
        contact: "@username или номер телефона",
        message: "Расскажите о вашем проекте... (необязательно)"
      },
      optional: "необязательно",
      submit: "Отправить",
      submitting: "Отправляется...",
      success: "Сообщение отправлено!",
      error: "Ошибка отправки. Попробуйте еще раз.",
      validation: {
        nameRequired: "Введите ваше имя",
        nameMin: "Имя должно содержать минимум 2 символа",
        platformRequired: "Выберите платформу",
        contactRequired: "Введите контакт",
        telegramFormat: "Telegram: введите @username или номер телефона",
        instagramFormat: "Instagram: введите @username",
        messageRequired: "Введите сообщение",
        messageMin: "Сообщение должно содержать минимум 10 символов"
      }
    },
    cookieConsent: {
      title: "Мы используем cookies",
      description: "Этот сайт использует cookies для улучшения работы и аналитики. Вы можете принять все cookies или настроить их использование.",
      acceptAll: "Принять все",
      rejectAll: "Только необходимые",
      customize: "Настроить",
      learnMore: "Подробнее",
      categories: {
        necessary: "Необходимые",
        necessaryDesc: "Эти cookies необходимы для работы сайта и не могут быть отключены.",
        analytics: "Аналитические",
        analyticsDesc: "Помогают нам понять, как посетители взаимодействуют с сайтом.",
        marketing: "Маркетинговые",
        marketingDesc: "Используются для отслеживания посетителей на разных сайтах."
      }
    }
  },
  en: {
    name: "Daria Koval",
    title: "PHOTO EDITOR | E-COMMERCE SPECIALIST",
    status: "Open to collaborations",
    summary: [
      "I specialize in professional photo editing for e-commerce. My main goal is to transform low-quality or amateur content into visually appealing, selling images for Instagram stores and marketplaces.",
      "Over the past 5 years, I have processed thousands of product photos for dozens of brands. I work with product cards, catalogs, and photoshoots for social media. Each image undergoes thorough processing: retouching, color correction, background removal, and optimization to meet marketplace requirements.",
      "My approach is not just to improve photos, but to create a brand's visual identity through editing. I understand the specifics of different platforms and image requirements, allowing my clients to sell more and look professional."
    ],
    experience: [
      {
        role: "Senior Photo Editor | E-commerce Specialist",
        period: "2022 - Present",
        company: "Creative Media Lab",
        description: "I specialize in processing product photos for major brands in the Fashion, Beauty, and Tech niches. I work with Instagram stores and marketplaces, ensuring professional processing of product cards, catalogs, and social media content.",
        details: [
          "Professional processing of product photos for Instagram stores and marketplaces",
          "Retouching and color correction of product cards complying with platform requirements",
          "Clipping and background replacement to white or transparent for marketplaces",
          "Processing catalogs and photoshoots for Fashion, Beauty, Tech brands",
          "Converting amateur photos to professional quality",
          "Creating unified visual style through processing for brands",
          "Working with large volumes: processing hundreds of product photos",
          "Optimizing images to meet various marketplace requirements"
        ]
      },
      {
        role: "Photo Retoucher | E-commerce Editor",
        period: "2019 - 2022",
        company: "Digital Trend Agency",
        description: "I specialized in photo editing for agency clients. I worked with product photos for e-commerce, retouching and color correction for social media and catalogs.",
        details: [
          "Retouching and color correction of product photos for online stores",
          "Processing photos for publications on Instagram and other social media",
          "Creating unified visual style through processing for brands",
          "Clipping and background replacement on product photos",
          "Working with large volumes of photos for catalogs",
          "Coordinating work with photographers to obtain quality source material",
          "Developing processing guidelines to maintain unified style",
          "Monitoring trends in e-commerce photo processing and adapting to clients"
        ]
      }
    ],
    skills: [
      "Photo Retouching",
      "Color Grading",
      "E-commerce Photography",
      "Product Photo Editing",
      "Catalog Design",
      "Background Removal",
      "Photo Optimization"
    ],
    nav: {
      home: "Home",
      summary: "Summary",
      experience: "Experience",
      portfolio: "Portfolio",
      skills: "Skills",
      links: "Links",
      contact: "Form"
    },
    sections: {
      summary: "Summary",
      experience: "Work Experience",
      skills: "Skills & Tools",
      links: "Let's Connect",
      contact: "Contact Form",
      languages: "Languages",
      portfolio: "Portfolio",
      selectedProjects: "Selected Projects",
      caseStudies: "Case Studies",
      before: "Before",
      after: "After",
      client: "Client",
      category: "Category",
      services: "Services"
    },
    contact: {
      emailMe: "Email Me",
      telegramMe: "Telegram Me"
    },
    contactForm: {
      title: "Get in Touch",
      description: "Fill out the form and I'll get back to you soon",
      fields: {
        name: "Name",
        platform: "Platform",
        contact: "Contact",
        message: "Message"
      },
      placeholders: {
        name: "Your name",
        contact: "@username or phone number",
        message: "Tell me about your project... (optional)"
      },
      optional: "optional",
      submit: "Send",
      submitting: "Sending...",
      success: "Message sent!",
      error: "Error sending. Please try again.",
      validation: {
        nameRequired: "Enter your name",
        nameMin: "Name must be at least 2 characters",
        platformRequired: "Select a platform",
        contactRequired: "Enter contact",
        telegramFormat: "Telegram: enter @username or phone number",
        instagramFormat: "Instagram: enter @username",
        messageRequired: "Enter a message",
        messageMin: "Message must be at least 10 characters"
      }
    },
    footer: {
      copyright: "© 2025 Framer template",
      by: "by Anton Drukarov",
      downloadCV: "Download CV",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy"
    },
    privacyPolicy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: 2025",
      sections: [
        {
          title: "1. General Provisions",
          content: "This Privacy Policy describes how we collect, use, and protect your personal information when using this website. We value your privacy and are committed to protecting your personal data in accordance with applicable laws."
        },
        {
          title: "2. Information Collection",
          content: "We may collect the following types of information: contact data (name, email), technical data (IP address, browser type), website usage data. This information is collected to improve website functionality and provide you with better service."
        },
        {
          title: "3. Use of Cookies",
          content: "Our website uses cookies to collect technical information and analytics. Cookies are small text files stored on your device. You can manage cookie settings through your browser settings."
        },
        {
          title: "4. Your Rights",
          content: "In accordance with GDPR and other regulations, you have the right to access, correct, delete, restrict processing, and transfer your personal data. To exercise these rights, please contact us using the contact information provided on the website."
        },
        {
          title: "5. Data Security",
          content: "We implement technical and organizational measures to protect your personal data from unauthorized access, loss, or destruction. However, no method of transmission over the internet is completely secure."
        },
        {
          title: "6. Contact Information",
          content: "If you have any questions about this Privacy Policy, please contact us at: daria.koval@creator.com"
        }
      ]
    },
    termsOfService: {
      title: "Terms of Service",
      lastUpdated: "Last updated: 2025",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By using this website, you accept and agree to comply with these Terms of Service. If you do not agree with any part of these terms, please do not use this website."
        },
        {
          title: "2. Use of Website",
          content: "This website is intended for viewing portfolio and contact information. You may view content for personal, non-commercial purposes. It is prohibited to use the website for illegal or unauthorized purposes."
        },
        {
          title: "3. Intellectual Property",
          content: "All content on this website, including texts, images, logos, and design, is the property of the website owner or used with permission. Any unauthorized copying, distribution, or use is prohibited."
        },
        {
          title: "4. Limitation of Liability",
          content: "The website is provided 'as is' without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the website."
        },
        {
          title: "5. Changes to Terms",
          content: "We reserve the right to modify these Terms of Service at any time. Changes take effect upon publication on the website. We recommend periodically reviewing these terms."
        },
        {
          title: "6. Contact",
          content: "For questions regarding these Terms of Service, please contact us at: daria.koval@creator.com"
        }
      ]
    },
    cookiePolicy: {
      title: "Cookie Policy",
      lastUpdated: "Last updated: 2025",
      sections: [
        {
          title: "1. What are Cookies",
          content: "Cookies are small text files stored on your device (computer, tablet, or mobile phone) when visiting a website. Cookies allow the website to remember your actions and settings for a certain period of time."
        },
        {
          title: "2. Types of Cookies We Use",
          content: "Technical cookies: necessary for website operation and basic functions. Analytical cookies: help us understand how visitors interact with the website by collecting anonymous statistics."
        },
        {
          title: "3. Purpose of Use",
          content: "We use cookies to: ensure proper website functionality, analyze traffic and improve user experience, remember your settings (such as selected language)."
        },
        {
          title: "4. Managing Cookies",
          content: "You can control and manage cookies through your browser settings. Most browsers allow you to delete cookies or block their installation. Note that blocking cookies may affect website functionality."
        },
        {
          title: "5. Third-Party Services",
          content: "Our website may use third-party analytics services that also use cookies. These services help us analyze website usage and improve its performance."
        },
        {
          title: "6. Contact",
          content: "If you have questions about cookie usage, please contact us: daria.koval@creator.com"
        }
      ]
    },
    cookieConsent: {
      title: "We use cookies",
      description: "This website uses cookies to improve functionality and analytics. You can accept all cookies or customize their usage.",
      acceptAll: "Accept all",
      rejectAll: "Essential only",
      customize: "Customize",
      learnMore: "Learn more",
      categories: {
        necessary: "Necessary",
        necessaryDesc: "These cookies are necessary for the website to function and cannot be disabled.",
        analytics: "Analytics",
        analyticsDesc: "Help us understand how visitors interact with the website.",
        marketing: "Marketing",
        marketingDesc: "Used to track visitors across different websites."
      }
    }
  }
};

export const languageNames: Record<Language, string> = {
  uk: 'УКР',
  ru: 'РУС',
  en: 'ENG'
};

export const languageFullNames: Record<Language, string> = {
  uk: 'Українська',
  ru: 'Русский',
  en: 'English'
};


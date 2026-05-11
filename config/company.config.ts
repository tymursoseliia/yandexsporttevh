// Конфигурация компании
// Для создания клона для другой компании - просто измените данные в этом файле

export const companyConfig = {
  // Основная информация
  name: "ООО «Спорт Тех»",
  slogan: "Торговля автомобилями",
  category: "Автосалон, торговля автомобилями",

  // Контакты
  phone: "+7 (980) 975-14-63",
  phoneLink: "+79809751463",
  email: "automig@ro.ru",
  website: "",

  // Адрес
  address: {
    full: "620043, Свердловская область, г Екатеринбург, ул Начдива Васильева, д. 34, кв. 417",
    city: "Екатеринбург",
    region: "Свердловская область",
    street: "ул Начдива Васильева, д. 34, кв. 417",
    zipCode: "620043"
  },

  // Координаты на карте
  coordinates: {
    latitude: 56.824538,
    longitude: 60.544249,
    zoom: 17.13
  },

  // Рейтинг
  rating: {
    score: 4.8,
    totalReviews: 38,
    totalRatings: 78
  },

  // Логотип
  logo: {
    url: "/logo-light.png?v=3",
    alt: "ООО «Спорт Тех»"
  },

  // График работы
  workingHours: {
    monday: "09:00 - 18:00",
    tuesday: "09:00 - 18:00",
    wednesday: "09:00 - 18:00",
    thursday: "09:00 - 18:00",
    friday: "09:00 - 18:00",
    saturday: "10:00 - 16:00",
    sunday: "Выходной"
  },

  // Дополнительные настройки
  settings: {
    showWhatsApp: false,
    showTelegram: false,
    telegramUsername: "",
    whatsappNumber: ""
  }
};

// Экспорт типа для TypeScript
export type CompanyConfig = typeof companyConfig;

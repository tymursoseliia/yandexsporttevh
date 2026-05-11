'use client';

import { useState, useRef, useEffect } from 'react';
import { reviewsData } from '@/data/reviews';

export default function Page() {
  const [activeTab, setActiveTab] = useState('reviews');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewLikes, setReviewLikes] = useState<{ [key: number]: { liked: boolean; disliked: boolean; likes: number; dislikes: number } }>({});
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [sortMode, setSortMode] = useState('default');
  const [showBusinessResponse, setShowBusinessResponse] = useState<Set<number>>(new Set());
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);
  const [hoverRatingModal, setHoverRatingModal] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoGallery, setPhotoGallery] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('620043, Свердловская область, г Екатеринбург, ул Начдива Васильева, д. 34, кв. 417');
  const [selectedTransport, setSelectedTransport] = useState<'auto' | 'transit' | 'walk'>('auto');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [showPhoneNotification, setShowPhoneNotification] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoriteNotification, setShowFavoriteNotification] = useState(false);
  const [favoriteAction, setFavoriteAction] = useState<'added' | 'removed'>('added');

  // Bottom sheet states
  const [bottomSheetState, setBottomSheetState] = useState<'collapsed' | 'expanded' | 'full'>('collapsed');
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  // Массив различных ответов от организации
  const businessResponses = [
    "Спасибо за ваш отзыв! Мы очень рады, что смогли помочь вам с выбором автомобиля. Для нас важно, чтобы каждый клиент остался доволен. Будем рады видеть вас снова!",
    "Благодарим за теплые слова! Ваше мнение очень важно для нас. Рады были помочь в подборе идеального автомобиля. Желаем приятных поездок!",
    "Огромное спасибо за доверие! Мы всегда стараемся обеспечить высокий уровень сервиса. Рады, что вы остались довольны нашей работой!",
    "Спасибо, что выбрали ООО «Спорт Тех»! Ваша оценка мотивирует нас работать ещё лучше. Успехов на дорогах!",
    "Благодарим за положительный отзыв! Команда ООО «Спорт Тех» всегда рада помочь в выборе качественного автомобиля. Обращайтесь, если понадобится помощь!",
    "Спасибо за высокую оценку нашей работы! Мы ценим каждого клиента и стремимся к совершенству. Удачи вам и вашему новому автомобилю!",
    "Признательны за ваш отзыв! Рады, что смогли оправдать ваши ожидания. Всегда готовы помочь с подбором автомобиля мечты!",
    "Большое спасибо за доверие к нашей компании! Профессионализм команды - наша главная ценность. Рады были помочь!",
    "Благодарим за такую высокую оценку! Ваше удовлетворение - лучшая награда для нас. Ждем вас снова за следующим автомобилем!",
    "Спасибо за подробный отзыв! Мы всегда на связи и готовы помочь с любыми вопросами. Приятных и безопасных вам поездок!",
    "Ценим ваше мнение! Для нас важен каждый клиент. Рады, что процесс покупки прошел гладко. Удачи на дорогах!",
    "Спасибо за позитивный отзыв! Наша команда работает для вашего комфорта. Всегда рады видеть вас в ООО «Спорт Тех»!",
    "Благодарим за оценку нашего сервиса! Индивидуальный подход к каждому клиенту - наш принцип работы. Успехов!",
    "Огромное спасибо! Рады были помочь найти автомобиль вашей мечты. Обращайтесь, если понадобится консультация!",
    "Спасибо за выбор нашей компании! Ваш отзыв очень важен для нас. Желаем вам приятных впечатлений от нового авто!",
    "Признательны за такие теплые слова! Команда ООО «Спорт Тех» всегда старается превзойти ожидания. Спасибо!",
    "Благодарим за доверие! Качество и честность - основа нашей работы. Рады были вам помочь!",
    "Спасибо за отзыв! Мы ценим каждого клиента и рады, что оправдали ваши ожидания. До новых встреч!",
    "Большое спасибо за положительную оценку! Ваше удовлетворение - наша цель. Удачи на дорогах!",
    "Благодарим за высокую оценку! Профессионализм и внимание к деталям - залог успешной сделки. Рады были помочь!"
  ];

  // Функция для получения стабильного ответа на основе ID отзыва
  const getBusinessResponse = (reviewId: number) => {
    return businessResponses[reviewId % businessResponses.length];
  };

  // Загрузка состояния избранного из localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const favoriteStatus = localStorage.getItem('transavtopskov-favorite');
      if (favoriteStatus === 'true') {
        setIsFavorite(true);
      }
    }
  }, []);

  // Функция переключения избранного
  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    if (typeof window !== 'undefined') {
      localStorage.setItem('transavtopskov-favorite', String(newFavoriteStatus));
    }

    setFavoriteAction(newFavoriteStatus ? 'added' : 'removed');
    setShowFavoriteNotification(true);
    setTimeout(() => {
      setShowFavoriteNotification(false);
    }, 2500);
  };

  // Функции для загрузки фотографий
  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;

    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === files.length) {
              setUploadedPhotos((prev) => [...prev, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handlePhotoUpload(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Функция поиска на карте
  const searchOnMap = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    window.open(`https://yandex.ru/maps/?text=${encodedQuery}&ll=60.544249,56.824538&z=12`, '_blank');
    setShowSearchModal(false);
    setSearchQuery('');
  };

  // Функция построения маршрута
  const buildRoute = () => {
    if (!routeFrom) return;
    const from = encodeURIComponent(routeFrom);
    const to = encodeURIComponent(routeTo);
    const mode = selectedTransport === 'auto' ? 'auto' : selectedTransport === 'transit' ? 'mt' : 'pd';
    window.open(`https://yandex.ru/maps/?rtext=${from}~${to}&rtt=${mode}`, '_blank');
    setShowRouteModal(false);
    setRouteFrom('');
  };

  // Функция использования текущего местоположения
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRouteFrom(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          alert('Не удалось определить ваше местоположение. Введите адрес вручную.');
        }
      );
    } else {
      alert('Ваш браузер не поддерживает геолокацию.');
    }
  };

  // Функция копирования URL для поделиться
  const copyUrlToClipboard = async () => {
    if (typeof window === 'undefined') return;

    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setShowCopiedNotification(true);
      setTimeout(() => {
        setShowCopiedNotification(false);
      }, 2000);
    } catch (err) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopiedNotification(true);
        setTimeout(() => {
          setShowCopiedNotification(false);
        }, 2000);
      } catch (err) {
        alert('Не удалось скопировать ссылку');
      }
      document.body.removeChild(textArea);
    }
  };

  // Функция обработки нажатия на кнопку позвонить
  const handleCallButtonClick = () => {
    if (showPhoneNumber) {
      // Второе нажатие - звоним
      window.location.href = 'tel:+79809751463';
    } else {
      // Первое нажатие - показываем номер
      setShowPhoneNumber(true);
      setShowPhoneNotification(true);
      setTimeout(() => {
        setShowPhoneNotification(false);
      }, 3000);
    }
  };

  const handleLike = (reviewId: number) => {
    setReviewLikes(prev => {
      const current = prev[reviewId] || { liked: false, disliked: false, likes: 0, dislikes: 0 };

      if (current.liked) {
        // Убираем лайк
        return {
          ...prev,
          [reviewId]: { ...current, liked: false, likes: current.likes - 1 }
        };
      } else {
        // Ставим лайк (и убираем дизлайк если был)
        return {
          ...prev,
          [reviewId]: {
            liked: true,
            disliked: false,
            likes: current.likes + 1,
            dislikes: current.disliked ? current.dislikes - 1 : current.dislikes
          }
        };
      }
    });
  };

  const handleDislike = (reviewId: number) => {
    setReviewLikes(prev => {
      const current = prev[reviewId] || { liked: false, disliked: false, likes: 0, dislikes: 0 };

      if (current.disliked) {
        // Убираем дизлайк
        return {
          ...prev,
          [reviewId]: { ...current, disliked: false, dislikes: current.dislikes - 1 }
        };
      } else {
        // Ставим дизлайк (и убираем лайк если был)
        return {
          ...prev,
          [reviewId]: {
            liked: false,
            disliked: true,
            likes: current.liked ? current.likes - 1 : current.likes,
            dislikes: current.dislikes + 1
          }
        };
      }
    });
  };

  const toggleReviewExpanded = (reviewId: number) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const toggleBusinessResponse = (reviewId: number) => {
    setShowBusinessResponse(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const openPhotoGallery = (photos: string[], startIndex: number = 0) => {
    setPhotoGallery(photos);
    setCurrentPhotoIndex(startIndex);
    setSelectedPhoto(photos[startIndex]);
  };

  const closePhotoGallery = () => {
    setSelectedPhoto(null);
    setPhotoGallery([]);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (currentPhotoIndex < photoGallery.length - 1) {
      const newIndex = currentPhotoIndex + 1;
      setCurrentPhotoIndex(newIndex);
      setSelectedPhoto(photoGallery[newIndex]);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      const newIndex = currentPhotoIndex - 1;
      setCurrentPhotoIndex(newIndex);
      setSelectedPhoto(photoGallery[newIndex]);
    }
  };

  const getFilteredAndSortedReviews = () => {
    const filtered = [...reviews];

    // Сортировка
    if (sortMode === 'rating-high') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortMode === 'rating-low') {
      filtered.sort((a, b) => a.rating - b.rating);
    }

    return filtered;
  };

  const reviews = reviewsData;

  // Bottom sheet drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
    setIsDraggingSheet(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingSheet) return;
    setDragCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDraggingSheet) return;

    const deltaY = dragCurrentY - dragStartY;

    if (bottomSheetState === 'collapsed') {
      // Сразу открываем на полный экран при свайпе вверх
      if (deltaY < -50) setBottomSheetState('full');
    } else if (bottomSheetState === 'full') {
      // При свайпе вниз возвращаемся в collapsed
      if (deltaY > 50) setBottomSheetState('collapsed');
    }

    setIsDraggingSheet(false);
    setDragCurrentY(0);
    setDragStartY(0);
  };

  const getBottomSheetHeight = () => {
    if (typeof window === 'undefined') return '210px'; // Default height for SSR
    const vh = window.innerHeight;

    if (bottomSheetState === 'collapsed') {
      // Уменьшаем высоту виджета, чтобы больше фото было видно
      // iPhone SE (375x667) - compact
      if (vh <= 667) return '180px';
      // iPhone X/11 Pro/12 mini (375x812) - с вырезом
      if (vh <= 812) return '200px';
      // iPhone 12/13/14 (390x844) - стандарт
      if (vh <= 844) return '210px';
      // iPhone 14 Pro/15 Pro (393x852) - Dynamic Island
      if (vh <= 852) return '220px';
      // iPhone Plus (428x926) - большой
      if (vh <= 926) return '230px';
      // iPhone 15 Pro Max (430x932) - максимальный
      if (vh <= 932) return '240px';
      // iPhone 16 Pro Max (440x956) - новый самый большой
      return '250px';
    }

    // Full screen - всегда на весь экран
    return '100vh';
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      {/* Desktop view - existing code remains the same */}
      {isWidgetVisible && (
        <div
          className={`hidden lg:flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out overflow-hidden ${
            isPanelCollapsed ? 'lg:w-0' : 'w-full lg:w-[714px]'
          }`}
        >
        {/* Header */}
        <header className="flex items-center justify-between px-4 lg:px-12 py-3 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-2 lg:gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="lg:w-7 lg:h-7">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF0000"/>
            </svg>
            <span className="text-[15px] lg:text-[19px] font-medium lg:font-bold">Яндекс Карты</span>
          </div>
          <div className="flex items-center gap-1 lg:gap-4">
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition md:flex md:items-center md:gap-2"
              aria-label="Поиск"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="lg:w-5 lg:h-5">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
              </svg>
              <span className="hidden lg:inline text-[15px]">Поиск</span>
            </button>
            <button
              onClick={() => setShowRouteModal(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition md:flex md:items-center md:gap-2"
              aria-label="Маршрут"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="lg:w-5 lg:h-5">
                <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" fill="currentColor"/>
              </svg>
              <span className="hidden lg:inline text-[15px]">Маршрут</span>
            </button>
            <button
              onClick={() => setIsWidgetVisible(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Закрыть"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="lg:w-5 lg:h-5">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto transition-all duration-300">
          {/* Title and Tabs Container - Sticky */}
          <div className="sticky top-[57px] lg:top-0 z-30 bg-white shadow-sm">
            {/* Title */}
            <div className="pt-3 lg:pt-6 pb-2 lg:pb-4 bg-white">
              <h1 className="text-[20px] lg:text-[32px] font-normal lg:font-medium text-black px-4 lg:px-12">ООО «Спорт Тех»</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white flex gap-3 lg:gap-6 px-4 lg:px-12 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 text-[14px] lg:text-[17px] font-normal whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'overview' ? 'text-black border-b-2 border-black' : 'text-gray-600'}`}
            >
              Обзор
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-2.5 text-[14px] lg:text-[17px] font-normal whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'products' ? 'text-black border-b-2 border-black' : 'text-gray-600'}`}
            >
              Товары и услуги
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`pb-2.5 text-[14px] lg:text-[17px] font-normal flex items-center gap-1 whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'news' ? 'text-black border-b-2 border-black' : 'text-gray-600'}`}
            >
              Новости <span className="text-gray-400 text-[12px] lg:text-[14px] font-normal">1</span>
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`pb-2.5 text-[14px] lg:text-[17px] font-normal flex items-center gap-1 whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'photos' ? 'text-black border-b-2 border-black' : 'text-gray-600'}`}
            >
              Фото <span className="text-gray-400 text-[12px] lg:text-[14px] font-normal">30</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2.5 text-[14px] lg:text-[17px] font-normal flex items-center gap-1 whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'reviews' ? 'text-black border-b-2 border-black' : 'text-gray-600'}`}
            >
              Отзывы <span className="text-gray-400 text-[12px] lg:text-[14px] font-normal">38</span>
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-2.5 text-[14px] lg:text-[17px] font-normal whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === 'features' ? 'text-black border-b-2 border-black' : 'text-gray-600'}`}
            >
              Особенности
            </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="px-4 lg:px-12 py-4 lg:py-6">
              {/* Company Logo */}
              <div className="mb-3 lg:mb-2 bg-white rounded-lg p-4 lg:p-6 flex items-center justify-center">
                <img
                  src="/logo-light.png?v=3"
                  alt="ООО «Спорт Тех»"
                  className="w-full max-w-[280px] lg:max-w-md h-auto"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* About Company */}
              <div className="mb-5 lg:mb-6">
                <h2 className="text-[16px] lg:text-[18px] font-medium text-gray-800 mb-2 lg:mb-3">О компании</h2>
                <p className="text-[14px] lg:text-[15px] text-gray-700 leading-relaxed">
                  ООО «Спорт Тех» - надежная компания по продаже качественных подержанных автомобилей в Екатеринбурге.
                  Мы специализируемся на подборе и продаже автомобилей из Европы с учетом всех пожеланий и бюджета клиента.
                  Наша команда профессионалов поможет вам выбрать идеальный автомобиль и быстро оформить все необходимые документы.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 lg:space-y-4 mb-5 lg:mb-6">
                <div className="flex items-start gap-2.5 lg:gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 lg:w-5 lg:h-5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF0000"/>
                  </svg>
                  <div>
                    <div className="text-[13px] lg:text-[14px] font-medium text-gray-800 mb-0.5">Адрес</div>
                    <a
                      href="https://yandex.ru/maps/?ll=60.544249%2C56.824538&z=18&text=Екатеринбург%2C%20Начдива%20Васильева%20ул%2C%20д.%2034"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] lg:text-[14px] text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      620043, Свердловская область, г Екатеринбург, ул Начдива Васильева, д. 34, кв. 417
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 lg:gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 lg:w-5 lg:h-5">
                    <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z" fill="#4a5568"/>
                    <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-2.17 1.861a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l1.86-2.171a1 1 0 00-.086-1.391l-4.064-3.696z" fill="#4a5568"/>
                  </svg>
                  <div>
                    <div className="text-[13px] lg:text-[14px] font-medium text-gray-800 mb-0.5">Телефон</div>
                    {showPhoneNumber ? (
                      <a href="tel:+79809751463" className="text-[13px] lg:text-[14px] text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium">+7 (980) 975-14-63</a>
                    ) : (
                      <button
                        onClick={() => setShowPhoneNumber(true)}
                        className="text-[13px] lg:text-[14px] text-blue-600 hover:text-blue-700 active:text-blue-800 hover:underline transition"
                      >
                        Показать номер телефона
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 lg:gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 lg:w-5 lg:h-5">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fill="#4a5568"/>
                    <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" fill="#4a5568"/>
                  </svg>
                  <div>
                    <div className="text-[13px] lg:text-[14px] font-medium text-gray-800 mb-0.5">Часы работы</div>
                    <div className="text-[13px] lg:text-[14px] text-gray-600">Ежедневно: 9:00 - 19:00</div>
                    <div className="text-[12px] lg:text-[13px] text-green-600 mt-1">Сейчас открыто</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 lg:gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 lg:w-5 lg:h-5">
                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="#4a5568"/>
                  </svg>
                  <div>
                    <div className="text-[13px] lg:text-[14px] font-medium text-gray-800 mb-0.5">Категория</div>
                    <div className="text-[13px] lg:text-[14px] text-gray-600">Автосалон • Продажа автомобилей с пробегом</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 lg:gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 lg:w-5 lg:h-5">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#4a5568"/>
                  </svg>
                  <div>
                    <div className="text-[13px] lg:text-[14px] font-medium text-gray-800 mb-0.5">Электронный адрес</div>
                    <a href="mailto:automig@ro.ru" className="text-[13px] lg:text-[14px] text-blue-600 hover:text-blue-700 active:text-blue-800 hover:underline break-all">automig@ro.ru</a>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 lg:gap-3 mb-5 lg:mb-6">
                <a
                  href="tel:+79809751463"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 lg:px-4 py-2.5 rounded-lg text-[13px] lg:text-[14px] font-medium transition-all active:scale-95 text-center"
                >
                  Позвонить
                </a>
                <button
                  onClick={() => setShowRouteModal(true)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 px-3 lg:px-4 py-2.5 rounded-lg text-[13px] lg:text-[14px] font-medium transition-all active:scale-95"
                >
                  Маршрут
                </button>
              </div>


            </div>
          )}

          {activeTab === 'products' && (
            <div className="px-8 lg:px-12 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Европа */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-center mb-4">
                    <div className="w-full h-32 flex items-center justify-center">
                      <img
                        src="/logo-light.png?v=3"
                        alt="ООО «Спорт Тех»"
                        className="w-full max-w-[200px] h-auto"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <h3 className="text-[16px] font-bold text-black mb-2">Авто под заказ из Европы</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    Закажите автомобиль из Европы с идеальным состоянием и полной историей обслуживания
                  </p>
                </div>

                {/* Корея */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-center mb-4">
                    <div className="w-full h-32 flex items-center justify-center">
                      <img
                        src="/logo-light.png?v=3"
                        alt="ООО «Спорт Тех»"
                        className="w-full max-w-[200px] h-auto"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <h3 className="text-[16px] font-bold text-black mb-2">Авто под заказ из Кореи</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    Закажите автомобиль из Кореи с идеальным состоянием и полной историей обслуживания
                  </p>
                </div>

                {/* Япония */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-center mb-4">
                    <div className="w-full h-32 flex items-center justify-center">
                      <img
                        src="/logo-light.png?v=3"
                        alt="ООО «Спорт Тех»"
                        className="w-full max-w-[200px] h-auto"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <h3 className="text-[16px] font-bold text-black mb-2">Авто под заказ из Японии</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">
                    Закажите автомобиль из Японии с идеальным состоянием и полной историей обслуживания
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="px-8 lg:px-12 py-6">
              <div className="mb-6">
                <h2 className="text-[20px] font-medium text-black mb-2">Новости</h2>
                <p className="text-[14px] text-gray-600">Актуальные новости от Яндекс.Дзен</p>
              </div>

              {/* Новостная лента в стиле Дзена */}
              <div className="space-y-4">
                {/* Новость 1 */}
                <a
                  href="https://dzen.ru/news"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">РБК • 2 часа назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        В России представили новую модель электромобиля с увеличенным запасом хода
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Российский производитель электромобилей анонсировал выпуск новой модели с запасом хода до 600 км...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 2 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Коммерсантъ • 4 часа назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Продажи автомобилей в России выросли на 15% в этом месяце
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Аналитики отмечают рост интереса к подержанным автомобилям японского производства...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 3 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">ТАСС • 6 часов назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Новые правила регистрации транспортных средств вступят в силу с декабря
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        МВД России утвердило обновленный регламент, упрощающий процедуру регистрации автомобилей...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 4 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Авто Mail.ru • 8 часов назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Эксперты назвали самые надежные автомобили 2024 года
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        В рейтинг вошли модели японских, корейских и европейских производителей...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 5 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Lenta.ru • 10 часов назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        В Приморском крае открылся новый автомобильный дилерский центр
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Современный комплекс предлагает широкий выбор автомобилей и услуги по обслуживанию...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 6 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Ведомости • Вчера</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Спрос на автомобили с правым рулем остается стабильным
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Аналитики рынка отмечают устойчивый интерес покупателей к японским автомобилям...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 7 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Autonews.ru • Вчера</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        ТОП-10 самых популярных автомобилей в России в 2024 году
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Эксперты составили рейтинг моделей, которые чаще всего покупают россияне в этом году...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 8 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Газета.Ru • 2 дня назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Новые технологии безопасности в современных автомобилях
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Производители активно внедряют системы помощи водителю и автономного вождения...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 9 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">РИА Новости • 2 дня назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Средняя цена подержанного автомобиля выросла на 8%
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Рост цен связан с увеличением спроса и дефицитом новых автомобилей на рынке...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 10 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Дром • 3 дня назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Как правильно выбрать автомобиль с пробегом: советы экспертов
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        На что обратить внимание при осмотре подержанного автомобиля перед покупкой...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 11 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Интерфакс • 3 дня назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Росстандарт запретил ввоз автомобилей без системы ЭРА-ГЛОНАСС
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        С января 2025 года вступают в силу новые требования к импортируемым автомобилям...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 12 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Auto.ru • 4 дня назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Toyota остается лидером рынка подержанных авто в России
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Японский автопроизводитель занимает первое место по количеству проданных автомобилей...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 13 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">За рулём • 5 дней назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Обзор новых кроссоверов: что выбрать в 2024 году
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Подробный анализ самых популярных моделей кроссоверов на российском рынке...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 14 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Мотор.ру • 5 дней назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Топливо на АЗС подорожало в среднем на 3 рубля за литр
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Цены на бензин и дизельное топливо выросли из-за сезонного спроса и роста акцизов...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>

                {/* Новость 15 */}
                <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="flex gap-4 p-4">
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-500 mb-2">Авто.Вести • Неделю назад</div>
                      <h3 className="text-[16px] font-medium text-gray-900 mb-2 line-clamp-2">
                        Страховка ОСАГО: как сэкономить при оформлении полиса
                      </h3>
                      <p className="text-[14px] text-gray-600 line-clamp-2">
                        Эксперты рассказали о способах снижения стоимости обязательного автострахования...
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop"
                        alt="Новость"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </a>
              </div>

              {/* Кнопка "Показать еще" */}
              <div className="mt-6 text-center">
                <a
                  href="https://dzen.ru/news"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-[14px] font-medium transition"
                >
                  Показать ещё новости
                </a>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="px-8 lg:px-12 py-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-medium text-black">Фотографии</h2>
                <div className="text-[14px] text-gray-500">30 фото</div>
              </div>

              <div className="grid grid-cols-3 gap-3 auto-rows-[140px]">
                {(() => {
                  const galleryPhotos = [
                    "https://i.ibb.co/WSR6Z5C/photo-2025-11-21-14-53-38.jpg",
                    "https://i.ibb.co/XZ25Trfh/photo-2025-11-21-14-53-40.jpg",
                    "https://i.ibb.co/C5Z1gtC1/photo-2025-11-21-14-53-41-2.jpg",
                    "https://i.ibb.co/gZ3yQCRC/photo-2025-11-21-14-53-41.jpg",
                    "https://i.ibb.co/wZBL8ZhV/photo-2025-11-21-14-53-42.jpg",
                    "https://i.ibb.co/bjt7JhWv/photo-2025-11-21-14-53-43-2.jpg",
                    "https://i.ibb.co/7d1N9kzz/photo-2025-11-21-14-53-43.jpg",
                    "https://i.ibb.co/s7n40gQ/photo-2025-11-21-14-53-44.jpg",
                    "https://i.ibb.co/Z6PTVLmK/photo-2025-11-21-14-53-45.jpg",
                    "https://i.ibb.co/RGYtywLk/photo-2025-11-21-14-53-46.jpg",
                    "https://i.ibb.co/Xr9vk07q/photo-2025-11-21-14-55-16.jpg",
                    "https://i.ibb.co/5hxncnMn/photo-2025-11-21-14-55-19.jpg",
                    "https://i.ibb.co/Gh5xgpV/photo-2025-11-21-14-55-22.jpg",
                    "https://i.ibb.co/JR3WKCWv/photo-2025-11-21-14-55-24.jpg",
                    "https://i.ibb.co/gbF1f6rX/photo-2025-11-21-14-55-27.jpg",
                    "https://i.ibb.co/TNggmNr/Gemini-Generated-Image-bxpjrnbxpjrnbxpj.png",
                    "https://i.ibb.co/GfGMS75q/image-2025-09-27-10-41-54-2.png",
                    "https://i.ibb.co/HL3dkgYr/image-2025-09-27-10-41-54.png",
                    "https://i.ibb.co/twF8dnd8/photo-1-2025-11-21-17-05-23.jpg",
                    "https://i.ibb.co/HLDPCHct/photo-2-2025-11-21-17-05-23.jpg",
                    "https://i.ibb.co/fVqQgcPS/photo-2025-11-21-17-19-51.jpg",
                    "https://i.ibb.co/BV3pxsxZ/photo-2025-11-21-17-19-53.jpg",
                    "https://i.ibb.co/NdctTgVH/photo-2025-11-21-17-19-54.jpg",
                    "https://i.ibb.co/hR2m331w/photo-2025-11-21-17-19-55.jpg",
                    "https://i.ibb.co/39vQgYqh/photo-2025-11-21-17-19-59.jpg",
                    "https://i.ibb.co/TBpgBb8w/photo-2025-11-21-17-20-00.jpg",
                    "https://i.ibb.co/8gykhWzj/photo-2025-11-21-17-20-02.jpg",
                    "https://i.ibb.co/Gfmzv5wm/photo-2025-11-21-17-20-03.jpg",
                    "https://i.ibb.co/8LpT53xZ/photo-2025-11-22-09-43-50.jpg",
                    "https://i.ibb.co/TMpJ0tPn/photo-2025-11-22-09-44-05.jpg"
                  ];
                  const photoSizes = [
                    'col-span-2 row-span-2', 'row-span-1', 'row-span-2',  // Ряд 1 - большое фото слева
                    'row-span-1', 'row-span-1', 'row-span-1',  // Ряд 2
                    'row-span-1', 'row-span-1', 'row-span-1',  // Ряд 3
                    'col-span-2 row-span-2', 'row-span-2',  // Ряд 4 - большое фото в центре
                    'row-span-1', 'row-span-1', 'row-span-1',  // Ряд 5
                    'row-span-1', 'row-span-1', 'row-span-1',  // Ряд 6
                    'row-span-1', 'row-span-1', 'row-span-1',  // Ряд 7
                    'row-span-2', 'col-span-2 row-span-2',  // Ряд 8 - большое фото справа
                    'row-span-1', 'row-span-1', 'row-span-1',  // Ряд 9
                    'row-span-1', 'row-span-1', 'row-span-1',  // Ряд 10
                    'row-span-1'  // Ряд 11
                  ];
                  return galleryPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className={`${photoSizes[index]} bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 hover:shadow-lg transition-all duration-300 group relative`}
                      onClick={() => openPhotoGallery(galleryPhotos, index)}
                    >
                      <img
                        src={photo}
                        alt={`Фото ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition"></div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="px-8 lg:px-12 py-6">
              <h2 className="text-[20px] font-medium text-black mb-5">Особенности</h2>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10b981" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-800 mb-1">Профессиональная команда</div>
                    <div className="text-[14px] text-gray-600 leading-relaxed">
                      Опытные специалисты с многолетним опытом работы на рынке подержанных автомобилей
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="#3b82f6" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-800 mb-1">Проверка качества</div>
                    <div className="text-[14px] text-gray-600 leading-relaxed">
                      Все автомобили проходят тщательную проверку технического состояния перед продажей
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#a855f7" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-800 mb-1">Быстрое оформление</div>
                    <div className="text-[14px] text-gray-600 leading-relaxed">
                      Оперативное оформление всех необходимых документов для покупки автомобиля
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="#f97316" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-800 mb-1">Индивидуальный подход</div>
                    <div className="text-[14px] text-gray-600 leading-relaxed">
                      Подбираем автомобиль с учетом всех ваших пожеланий, бюджета и требований
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#ef4444" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-800 mb-1">Помощь с документами</div>
                    <div className="text-[14px] text-gray-600 leading-relaxed">
                      Полное сопровождение при оформлении документов и регистрации автомобиля
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#eab308" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-800 mb-1">Честные цены</div>
                    <div className="text-[14px] text-gray-600 leading-relaxed">
                      Прозрачное ценообразование без скрытых платежей и дополнительных комиссий
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#14b8a6" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-800 mb-1">Автомобили из Европы</div>
                    <div className="text-[14px] text-gray-600 leading-relaxed">
                      Специализируемся на качественных европейских автомобилях известных брендов
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="#ec4899" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-800 mb-1">Высокий рейтинг</div>
                    <div className="text-[14px] text-gray-600 leading-relaxed">
                      Средняя оценка 4.8 из 5 на основе отзывов довольных клиентов
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab Content */}
          {activeTab === 'reviews' && (
            <div className="relative">
              {/* Rating Box */}
              <div className="mx-4 lg:mx-12 mt-4 lg:mt-6 mb-4 lg:mb-6 bg-[#f6f5f3] rounded-lg lg:rounded-xl py-4 lg:py-5 px-4 lg:px-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="text-[48px] lg:text-[64px] font-medium leading-none text-[#2d2d2d]">4,8</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} width="18" height="18" viewBox="0 0 24 24" fill="#fbbf24" className="lg:w-5 lg:h-5">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                    </div>
                    <div className="text-[12px] lg:text-[13px] text-gray-600">78 оценок</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 items-start lg:items-end">
                  <div className="text-[13px] lg:text-[14px] text-gray-700 leading-tight">
                    Оцените это место
                  </div>
                  <div
                    className="flex gap-0.5"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="hover:scale-110 transition active:scale-95"
                        onMouseEnter={() => setHoverRating(star)}
                        onTouchStart={() => setHoverRating(star)}
                        onClick={() => {
                          setRating(star);
                          setShowReviewForm(true);
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={star <= hoverRating ? "#fbbf24" : "none"} stroke={star <= hoverRating ? "#fbbf24" : "#d1d5db"} strokeWidth="2" className="lg:w-5 lg:h-5">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews Header */}
              <div className="flex items-center justify-between px-4 lg:px-12 mb-4">
                <h2 className="text-[17px] lg:text-[22px] font-normal lg:font-medium text-black">
                  {getFilteredAndSortedReviews().length} отзывов
                </h2>
                <div className="flex gap-3">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value)}
                      className="px-2 lg:px-3 py-1 lg:py-1.5 text-[13px] lg:text-[14px] border border-gray-300 rounded-md lg:rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none pr-7"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
                    >
                      <option value="default">По умолчанию</option>
                      <option value="rating-high">Сначала высокие оценки</option>
                      <option value="rating-low">Сначала низкие оценки</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="px-4 lg:px-12 pb-6 space-y-4 lg:space-y-6">
                {getFilteredAndSortedReviews().map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 lg:pb-6 last:border-0">
                    <div className="flex items-center gap-2.5 lg:gap-3 mb-2 lg:mb-3">
                      <img src={review.avatar} alt={review.name} className="w-9 h-9 lg:w-10 lg:h-10 rounded-full object-cover" loading="lazy" decoding="async" />
                      <div>
                        <div className="text-[14px] lg:text-[15px] font-medium text-black">{review.name}</div>
                        <div className="text-[12px] lg:text-[13px] text-gray-500">{review.level}</div>
                      </div>
                    </div>

                    <div className="flex gap-0.5 mb-2 ml-[42px] lg:ml-[52px] items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} width="13" height="13" viewBox="0 0 24 24" fill={star <= review.rating ? "#fbbf24" : "#e5e7eb"} className="lg:w-[14px] lg:h-[14px]">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                      <span className="text-[12px] lg:text-[13px] text-gray-500 ml-2">{review.date}</span>
                    </div>

                    <div className="ml-[42px] lg:ml-[52px] text-[13px] lg:text-[14px] text-gray-800 leading-relaxed">
                      <div className={expandedReviews.has(review.id) ? '' : 'line-clamp-3'}>
                        {review.text}
                      </div>
                      {review.text.length > 280 && (
                        <button
                          onClick={() => toggleReviewExpanded(review.id)}
                          className="text-blue-600 hover:text-blue-700 font-normal mt-1 transition"
                        >
                          {expandedReviews.has(review.id) ? 'скрыть' : 'ещё'}
                        </button>
                      )}
                    </div>

                    {review.photos && review.photos.length > 0 && (
                      <div className="ml-[42px] lg:ml-[52px] mt-2 lg:mt-3 flex gap-1.5 lg:gap-2">
                        {review.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt=""
                            className="w-20 h-20 lg:w-24 lg:h-24 rounded object-cover cursor-pointer hover:opacity-80 active:opacity-70 transition"
                            onClick={() => openPhotoGallery(review.photos || [], idx)}
                            loading="lazy"
                            decoding="async"
                          />
                        ))}
                      </div>
                    )}

                    <div className="ml-[42px] lg:ml-[52px] mt-2 lg:mt-3 flex gap-3 lg:gap-4 items-center">
                      {/* Like Button */}
                      <button
                        onClick={() => handleLike(review.id)}
                        className={`flex items-center gap-1 lg:gap-1.5 transition-all duration-200 active:scale-95 ${
                          reviewLikes[review.id]?.liked
                            ? 'text-blue-600'
                            : 'text-gray-400 hover:text-blue-600'
                        } ${reviewLikes[review.id]?.liked ? 'scale-110' : ''}`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={reviewLikes[review.id]?.liked ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="transition-transform lg:w-5 lg:h-5"
                        >
                          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 002-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                        </svg>
                        {(reviewLikes[review.id]?.likes || 0) > 0 && (
                          <span className="text-[12px] lg:text-[13px] font-medium">{reviewLikes[review.id].likes}</span>
                        )}
                      </button>

                      {/* Dislike Button */}
                      <button
                        onClick={() => handleDislike(review.id)}
                        className={`flex items-center gap-1 lg:gap-1.5 transition-all duration-200 active:scale-95 ${
                          reviewLikes[review.id]?.disliked
                            ? 'text-red-600'
                            : 'text-gray-400 hover:text-red-600'
                        } ${reviewLikes[review.id]?.disliked ? 'scale-110' : ''}`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={reviewLikes[review.id]?.disliked ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="transition-transform lg:w-5 lg:h-5"
                        >
                          <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
                        </svg>
                        {(reviewLikes[review.id]?.dislikes || 0) > 0 && (
                          <span className="text-[12px] lg:text-[13px] font-medium">{reviewLikes[review.id].dislikes}</span>
                        )}
                      </button>


                    </div>

                    <button
                      onClick={() => toggleBusinessResponse(review.id)}
                      className="ml-[42px] lg:ml-[52px] mt-2 lg:mt-3 text-[12px] lg:text-[13px] text-gray-500 hover:text-gray-700 active:text-gray-800 flex items-center gap-1 transition"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`transition-transform lg:w-[14px] lg:h-[14px] ${showBusinessResponse.has(review.id) ? 'rotate-180' : ''}`}
                      >
                        <path d="M7 10l5 5 5-5z"/>
                      </svg>
                      {showBusinessResponse.has(review.id) ? 'Скрыть ответ организации' : 'Посмотреть ответ организации'}
                    </button>

                    {/* Business Response */}
                    {showBusinessResponse.has(review.id) && (
                      <div className="ml-[42px] lg:ml-[52px] mt-2 lg:mt-3 p-3 lg:p-4 bg-blue-50 border-l-4 border-black rounded-r-lg animate-slideUp">
                        <div className="flex items-start gap-2 lg:gap-3 mb-2">
                          <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] lg:text-xs font-bold">AP</span>
                          </div>
                          <div>
                            <div className="text-[13px] lg:text-[14px] font-semibold text-gray-900">ООО «Спорт Тех»</div>
                            <div className="text-[11px] lg:text-[12px] text-gray-500">Представитель компании</div>
                          </div>
                        </div>
                        <div className="text-[13px] lg:text-[14px] text-gray-800 leading-relaxed">
                          {getBusinessResponse(review.id)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>



              {/* Write Review Button - Mobile */}
              <div className="lg:hidden fixed bottom-6 right-4 z-20">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-14 h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95"
                  aria-label="Написать отзыв"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>

              {/* Review Form Modal */}
              {showReviewForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[460px] max-h-[90vh] animate-slideUp overflow-hidden flex flex-col">
                    {/* Header with Close Button - Sticky */}
                    <div className="relative px-6 pt-5 pb-3 bg-white sticky top-0 z-10">
                      <h2 className="text-[20px] font-medium text-gray-900">Как вам это место?</h2>
                      <button
                        onClick={() => {
                          setShowReviewForm(false);
                          setRating(0);
                          setReviewText('');
                          setUploadedPhotos([]);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition"
                        aria-label="Закрыть"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto flex-1">

                    {/* Company Logo */}
                    <div className="px-6 pt-2">
                      <div className="w-full bg-white rounded-lg p-4 flex items-center justify-center">
                        <img
                          src="/logo-light.png?v=3"
                          alt="ООО «Спорт Тех»"
                          className="w-full max-w-xs h-auto"
                        />
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="px-6 pt-3 pb-3">
                      <h3 className="text-[17px] font-medium text-gray-900">ООО «Спорт Тех»</h3>
                      <a href="https://yandex.ru/maps/?ll=60.544249%2C56.824538&z=18&text=Екатеринбург%2C%20Начдива%20Васильева%20ул%2C%20д.%2034" target="_blank" rel="noopener noreferrer" className="text-[13px] text-blue-600 hover:text-blue-700 active:text-blue-800 mt-0.5 block">620043, Свердловская область, г Екатеринбург, ул Начдива Васильева, д. 34, кв. 417</a>
                    </div>

                    {/* Form */}
                    <div className="px-6 pb-6 space-y-4">
                      {/* Rating Stars */}
                      <div
                        className="flex gap-2 justify-center"
                        onMouseLeave={() => setHoverRatingModal(0)}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRatingModal(star)}
                            className="transition hover:scale-110 active:scale-95"
                          >
                            <svg
                              width="44"
                              height="44"
                              viewBox="0 0 24 24"
                              fill={star <= (hoverRatingModal || rating) ? "#FFC107" : "#E0E0E0"}
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          </button>
                        ))}
                      </div>

                      {/* Review Text */}
                      <div>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder=""
                          className="w-full h-28 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[15px] text-gray-900"
                        />

                      </div>

                      {/* Photo/Video Upload Area */}
                      <div>
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*,video/*"
                          multiple
                          onChange={(e) => handlePhotoUpload(e.target.files)}
                          className="hidden"
                        />
                        <label
                          htmlFor="photo-upload"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`block border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${
                            isDragging ? 'border-black bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                            <div>
                              <p className="text-[15px] text-blue-600 font-medium">Добавить фото или видео</p>
                              <p className="text-[13px] text-gray-500 mt-1">Можно перетаскивать его в эту рамку</p>
                            </div>
                          </div>
                        </label>

                        {/* Photo Preview Grid */}
                        {uploadedPhotos.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {uploadedPhotos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={photo}
                                  alt={`Загруженное фото ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  onClick={() => removePhoto(index)}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                  aria-label="Удалить фото"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6L6 18M6 6l12 12"/>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={() => {
                          setShowReviewForm(false);
                          setShowThankYouModal(true);
                        }}
                        disabled={!rating}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
                      >
                        Сохранить
                      </button>

                      {/* Privacy Notice */}
                      <div className="flex items-center justify-center gap-1.5 text-[13px] text-gray-500">
                        <span>Оценка и отзыв публикуются для всех</span>
                        <button className="w-4 h-4 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Thank You Modal */}
              {showThankYouModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] animate-slideUp overflow-hidden">
                    {/* Close Button */}
                    <div className="relative p-4">
                      <button
                        onClick={() => {
                          setShowThankYouModal(false);
                          setRating(0);
                          setReviewText('');
                          setUploadedPhotos([]);
                        }}
                        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition"
                        aria-label="Закрыть"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="px-8 pb-8 text-center">
                      {/* Illustration */}
                      <div className="flex justify-center mb-6">
                        <div className="relative w-32 h-32">
                          {/* Outer circle - purple gradient */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 opacity-20"></div>
                          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 opacity-30"></div>

                          {/* Main circle */}
                          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center">
                            {/* Trophy/Badge background */}
                            <div className="relative w-16 h-16">
                              {/* Purple badge base */}
                              <div className="absolute inset-0 bg-purple-700 rounded-lg transform rotate-45"></div>

                              {/* Star */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="#FFC107" className="relative z-10">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                              </div>

                              {/* Yellow accent circle */}
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-[22px] font-medium text-gray-900 mb-3">
                        Хорошо, что сказали!
                      </h2>

                      {/* Description */}
                      <p className="text-[15px] text-gray-600 leading-relaxed mb-6">
                        Ваши отзывы помогают другим определиться с выбором. Пишите ещё!
                      </p>

                      {/* Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setShowThankYouModal(false);
                            setRating(0);
                            setReviewText('');
                            setUploadedPhotos([]);
                            // Можно добавить логику перехода к другим местам
                          }}
                          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-[15px]"
                        >
                          Оценить другие места
                        </button>
                        <button
                          onClick={() => {
                            setShowThankYouModal(false);
                            setRating(0);
                            setReviewText('');
                            setUploadedPhotos([]);
                          }}
                          className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition text-[15px]"
                        >
                          Готово
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Mobile: Full screen map with bottom sheet */}
      <div className="lg:hidden relative h-screen w-full overflow-hidden">
        {/* Map iframe */}
        <iframe
          src="https://yandex.com/map-widget/v1/?from=api-maps&ll=60.544249%2C56.824538&mode=whatshere&whatshere%5Bpoint%5D=60.544249%2C56.824538&whatshere%5Bzoom%5D=17&z=17&theme=light"
          allowFullScreen
          className="w-full h-full border-0"
        />

        {/* Top search bar */}
        <div
          className="absolute top-0 left-0 right-0 z-40 px-3"
          style={{
            paddingTop: 'max(12px, env(safe-area-inset-top))',
            paddingBottom: '12px'
          }}
        >
          <div className="bg-white rounded-xl shadow-lg flex items-center gap-2 px-3 border border-gray-200" style={{ minHeight: '44px' }}>
            <button className="text-gray-700 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -ml-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Поиск и выбор мест"
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[14px] py-3"
              onClick={() => setShowSearchModal(true)}
              readOnly
            />
          </div>
        </div>



        {/* Bottom Sheet */}
        <div
          ref={bottomSheetRef}
          className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl transition-all duration-300 ease-out z-50 touch-none"
          style={{
            height: getBottomSheetHeight(),
            transform: isDraggingSheet ? `translateY(${Math.max(0, dragCurrentY - dragStartY)}px)` : 'translateY(0)'
          }}
        >
          {/* Drag handle */}
          <div
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Collapsed state */}
          {bottomSheetState === 'collapsed' && (
            <div className="px-4" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
              <h2 className="text-gray-900 text-[17px] xs:text-[18px] iphone-16-pro-max:text-[19px] font-medium mb-1">ООО «Спорт Тех»</h2>
              <p className="text-gray-600 text-[12px] xs:text-[13px] iphone-16-pro-max:text-[14px] mb-2.5">Автосалон, пригон автомобилей</p>

              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24" className="xs:w-[14px] xs:h-[14px] iphone-16-pro-max:w-[15px] iphone-16-pro-max:h-[15px]">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-900 text-[13px] xs:text-[14px] iphone-16-pro-max:text-[15px] font-medium">4,8</span>
                <span className="text-gray-600 text-[12px] iphone-16-pro-max:text-[13px]">78 оценок</span>
              </div>

              <div className="flex gap-2 iphone-16-pro-max:gap-3 mb-3">
                <button
                  onClick={() => setBottomSheetState('full')}
                  className="flex-1 bg-[#4a90e2] hover:bg-[#3a7bc8] active:bg-[#2a6bb8] text-white rounded-xl font-medium text-[13px] xs:text-[14px] iphone-16-pro-max:text-[15px] flex items-center justify-center gap-1.5 transition-all active:scale-95 min-h-[44px] iphone-16-pro-max:min-h-[48px] px-3"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 iphone-16-pro-max:w-[18px] iphone-16-pro-max:h-[18px]">
                    <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
                  </svg>
                  Маршрут
                </button>
                <button
                  onClick={handleCallButtonClick}
                  className="bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all active:scale-95 min-w-[44px] min-h-[44px] iphone-16-pro-max:min-w-[48px] iphone-16-pro-max:min-h-[48px]"
                  aria-label="Позвонить"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" strokeWidth="2" className="iphone-16-pro-max:w-[20px] iphone-16-pro-max:h-[20px]">
                    <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                    <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-2.17 1.861a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l1.86-2.171a1 1 0 00-.086-1.391l-4.064-3.696z"/>
                  </svg>
                </button>
                <button
                  onClick={() => window.open('https://transavtopskov.ru/', '_blank')}
                  className="bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all active:scale-95 min-w-[44px] min-h-[44px] iphone-16-pro-max:min-w-[48px] iphone-16-pro-max:min-h-[48px]"
                  aria-label="Открыть сайт"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" strokeWidth="2" className="iphone-16-pro-max:w-[20px] iphone-16-pro-max:h-[20px]">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                    <path d="M2 12h20"/>
                  </svg>
                </button>
                <button
                  onClick={toggleFavorite}
                  className="bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all active:scale-95 min-w-[44px] min-h-[44px] iphone-16-pro-max:min-w-[48px] iphone-16-pro-max:min-h-[48px]"
                  aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "#4a90e2" : "none"} stroke="#4a90e2" strokeWidth="2" className="iphone-16-pro-max:w-[20px] iphone-16-pro-max:h-[20px] transition-all">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Full state */}
          {bottomSheetState === 'full' && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Scrollable container */}
              <div className="flex-1 overflow-y-auto bg-white" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
                {/* Header with logo - НЕ закрепленная */}
                <div className="relative h-64 xs:h-72 iphone-16-pro-max:h-80 bg-white flex-shrink-0 flex items-center justify-center p-8">
                  <img
                    src="/logo-light.png?v=3"
                    alt="ООО «Спорт Тех»"
                    className="w-full max-w-md h-auto object-contain"
                    loading="eager"
                    decoding="async"
                  />
                  {/* Photo counter */}
                  <div className="absolute top-2 right-2 bg-gray-100 bg-opacity-90 px-2.5 py-1 rounded-lg flex items-center gap-1 z-10">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#4a90e2">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <span className="text-gray-900 text-[13px] font-medium">30</span>
                  </div>
                </div>

                {/* Sticky Header Info - закрепленная */}
                <div className="sticky top-0 z-20 bg-white">
                <div className="px-4 iphone-16-pro-max:px-5 py-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <h2 className="text-gray-900 text-[18px] xs:text-[19px] iphone-16-pro-max:text-[20px] font-medium mb-0.5 truncate">ООО «Спорт Тех»</h2>
                      <p className="text-gray-600 text-[12px] xs:text-[13px] iphone-16-pro-max:text-[14px]">Автосалон, пригон автомобилей</p>
                    </div>
                    <div className="flex items-center gap-1.5 iphone-16-pro-max:gap-2 flex-shrink-0">
                      <button
                        onClick={copyUrlToClipboard}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center active:scale-95 transition-all min-w-[40px] min-h-[40px] iphone-16-pro-max:min-w-[44px] iphone-16-pro-max:min-h-[44px]"
                        aria-label="Поделиться"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" strokeWidth="2" className="iphone-16-pro-max:w-[20px] iphone-16-pro-max:h-[20px]">
                          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => setBottomSheetState('collapsed')}
                        className="bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center active:scale-95 transition-all min-w-[40px] min-h-[40px] iphone-16-pro-max:min-w-[44px] iphone-16-pro-max:min-h-[44px]"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" className="iphone-16-pro-max:w-[20px] iphone-16-pro-max:h-[20px]">
                          <path d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24" className="xs:w-[14px] xs:h-[14px] iphone-16-pro-max:w-[15px] iphone-16-pro-max:h-[15px]">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-900 text-[14px] xs:text-[15px] iphone-16-pro-max:text-[16px] font-medium">4,8</span>
                    <span className="text-gray-600 text-[12px] xs:text-[13px] iphone-16-pro-max:text-[14px]">78 оценок</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 xs:gap-3 iphone-16-pro-max:gap-4 mb-5 mt-4">
                    <button
                      onClick={() => setShowRouteModal(true)}
                      className="flex-1 bg-[#4a90e2] hover:bg-[#3a7bc8] active:bg-[#2a6bb8] text-white rounded-xl font-medium text-[14px] xs:text-[15px] iphone-16-pro-max:text-[16px] flex items-center justify-center gap-2 transition-all active:scale-95 min-h-[44px] iphone-16-pro-max:min-h-[48px] px-3"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 iphone-16-pro-max:w-[20px] iphone-16-pro-max:h-[20px]">
                        <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
                      </svg>
                      Маршрут
                    </button>
                    <button
                      onClick={handleCallButtonClick}
                      className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl flex items-center justify-center transition-all active:scale-95 min-w-[44px] min-h-[44px] iphone-16-pro-max:min-w-[48px] iphone-16-pro-max:min-h-[48px]"
                      aria-label="Позвонить"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" strokeWidth="2" className="iphone-16-pro-max:w-[22px] iphone-16-pro-max:h-[22px]">
                        <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                        <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-2.17 1.861a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l1.86-2.171a1 1 0 00-.086-1.391l-4.064-3.696z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => window.open('https://transavtopskov.ru/', '_blank')}
                      className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl flex items-center justify-center transition-all active:scale-95 min-w-[44px] min-h-[44px] iphone-16-pro-max:min-w-[48px] iphone-16-pro-max:min-h-[48px]"
                      aria-label="Открыть сайт"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" strokeWidth="2" className="iphone-16-pro-max:w-[22px] iphone-16-pro-max:h-[22px]">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                        <path d="M2 12h20"/>
                      </svg>
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex justify-between border-b border-gray-200 overflow-x-auto scrollbar-hide -mx-4 px-4 iphone-16-pro-max:-mx-5 iphone-16-pro-max:px-5">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`pb-3 text-[13px] xs:text-[14px] font-medium whitespace-nowrap transition-colors min-h-[44px] flex items-center ${
                        activeTab === 'overview'
                          ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
                          : 'text-gray-600'
                      }`}
                    >
                      Обзор
                    </button>
                    <button
                      onClick={() => setActiveTab('products')}
                      className={`pb-3 text-[13px] xs:text-[14px] font-medium whitespace-nowrap transition-colors min-h-[44px] flex items-center ${
                        activeTab === 'products'
                          ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
                          : 'text-gray-600'
                      }`}
                    >
                      Товары
                    </button>
                    <button
                      onClick={() => setActiveTab('news')}
                      className={`pb-3 text-[13px] xs:text-[14px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 min-h-[44px] ${
                        activeTab === 'news'
                          ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
                          : 'text-gray-600'
                      }`}
                    >
                      Новости
                      <span className="text-gray-500 text-[11px] xs:text-[12px]">1</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('photos')}
                      className={`pb-3 text-[13px] xs:text-[14px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 min-h-[44px] ${
                        activeTab === 'photos'
                          ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
                          : 'text-gray-600'
                      }`}
                    >
                      Фото
                      <span className="text-gray-500 text-[11px] xs:text-[12px]">30</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`pb-3 text-[13px] xs:text-[14px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 min-h-[44px] ${
                        activeTab === 'reviews'
                          ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
                          : 'text-gray-600'
                      }`}
                    >
                      Отзывы
                      <span className="text-gray-500 text-[11px] xs:text-[12px]">40</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('features')}
                      className={`pb-3 text-[13px] xs:text-[14px] font-medium whitespace-nowrap transition-colors min-h-[44px] flex items-center ${
                        activeTab === 'features'
                          ? 'text-[#4a90e2] border-b-2 border-[#4a90e2]'
                          : 'text-gray-600'
                      }`}
                    >
                      Особенности
                    </button>
                  </div>
                </div>
                </div>

                {/* Tab content - НЕ в sticky блоке */}
                <div className="px-4 iphone-16-pro-max:px-5">
                  {activeTab === 'overview' && (
                    <div className="space-y-4 pb-4 pt-3">
                      {/* About Company */}
                      <div>
                        <h3 className="text-gray-900 text-[15px] xs:text-[16px] iphone-16-pro-max:text-[17px] font-medium mb-2">О компании</h3>
                        <p className="text-gray-700 text-[13px] xs:text-[14px] iphone-16-pro-max:text-[15px] leading-relaxed">
                          ООО «Спорт Тех» - надежная компания по продаже качественных подержанных автомобилей в Екатеринбурге.
                          Мы специализируемся на подборе и продаже автомобилей из Европы с учетом всех пожеланий и бюджета клиента.
                          Наша команда профессионалов поможет вам выбрать идеальный автомобиль и быстро оформить все необходимые документы.
                        </p>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF0000"/>
                          </svg>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] xs:text-[13px] font-medium text-gray-800 mb-0.5">Адрес</div>
                            <a
                              href="https://yandex.ru/maps/?ll=60.544249%2C56.824538&z=18&text=Екатеринбург%2C%20Начдива%20Васильева%20ул%2C%20д.%2034"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] xs:text-[13px] text-blue-600 hover:text-blue-700 active:text-blue-800 leading-relaxed block"
                            >
                              620043, Свердловская область, г Екатеринбург, ул Начдива Васильева, д. 34, кв. 417
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
                            <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z" fill="#4a5568"/>
                            <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-2.17 1.861a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l1.86-2.171a1 1 0 00-.086-1.391l-4.064-3.696z" fill="#4a5568"/>
                          </svg>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] xs:text-[13px] font-medium text-gray-800 mb-0.5">Телефон</div>
                            <div className="flex items-center gap-2">
                              {showPhoneNumber ? (
                                <a href="tel:+79809751463" className="text-[12px] xs:text-[13px] text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium">+7 (980) 975-14-63</a>
                              ) : (
                                <button
                                  onClick={() => setShowPhoneNumber(true)}
                                  className="text-[12px] xs:text-[13px] text-blue-600 hover:text-blue-700 active:text-blue-800 hover:underline transition"
                                >
                                  Показать номер телефона
                                </button>
                              )}

                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fill="#4a5568"/>
                            <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" fill="#4a5568"/>
                          </svg>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] xs:text-[13px] font-medium text-gray-800 mb-0.5">Часы работы</div>
                            <div className="text-[12px] xs:text-[13px] text-gray-600">Ежедневно: 9:00 - 19:00</div>
                            <div className="text-[11px] xs:text-[12px] text-green-600 mt-1">Сейчас открыто</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="#4a5568"/>
                          </svg>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] xs:text-[13px] font-medium text-gray-800 mb-0.5">Категория</div>
                            <div className="text-[12px] xs:text-[13px] text-gray-600">Автосалон • Продажа автомобилей с пробегом</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#4a5568"/>
                          </svg>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] xs:text-[13px] font-medium text-gray-800 mb-0.5">Электронный адрес</div>
                            <a href="mailto:sport-teh@yandex.ru" className="text-[12px] xs:text-[13px] text-blue-600 hover:text-blue-700 active:text-blue-800 hover:underline break-all">sport-teh@yandex.ru</a>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <a
                          href="tel:+79809751463"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all active:scale-95 text-center"
                        >
                          Позвонить
                        </a>
                        <button
                          onClick={() => setShowRouteModal(true)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all active:scale-95"
                        >
                          Маршрут
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'products' && (
                    <div className="space-y-3 pb-4">
                      {/* Европа */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4 xs:p-5 active:bg-gray-50 transition">
                        <div className="flex justify-center mb-3 xs:mb-4">
                          <div className="w-full h-24 xs:h-28 flex items-center justify-center">
                            <img
                              src="/logo-light.png?v=3"
                              alt="ООО «Спорт Тех»"
                              className="w-full max-w-[160px] xs:max-w-[180px] h-auto"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        </div>
                        <h3 className="text-[15px] xs:text-[16px] font-bold text-black mb-2">Авто под заказ из Европы</h3>
                        <p className="text-[13px] xs:text-[14px] text-gray-600 leading-relaxed">
                          Закажите автомобиль из Европы с идеальным состоянием и полной историей обслуживания
                        </p>
                      </div>

                      {/* Корея */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4 xs:p-5 active:bg-gray-50 transition">
                        <div className="flex justify-center mb-3 xs:mb-4">
                          <div className="w-full h-24 xs:h-28 flex items-center justify-center">
                            <img
                              src="/logo-light.png?v=3"
                              alt="ООО «Спорт Тех»"
                              className="w-full max-w-[160px] xs:max-w-[180px] h-auto"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        </div>
                        <h3 className="text-[15px] xs:text-[16px] font-bold text-black mb-2">Авто под заказ из Кореи</h3>
                        <p className="text-[13px] xs:text-[14px] text-gray-600 leading-relaxed">
                          Закажите автомобиль из Кореи с идеальным состоянием и полной историей обслуживания
                        </p>
                      </div>

                      {/* Япония */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4 xs:p-5 active:bg-gray-50 transition">
                        <div className="flex justify-center mb-3 xs:mb-4">
                          <div className="w-full h-24 xs:h-28 flex items-center justify-center">
                            <img
                              src="/logo-light.png?v=3"
                              alt="ООО «Спорт Тех»"
                              className="w-full max-w-[160px] xs:max-w-[180px] h-auto"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        </div>
                        <h3 className="text-[15px] xs:text-[16px] font-bold text-black mb-2">Авто под заказ из Японии</h3>
                        <p className="text-[13px] xs:text-[14px] text-gray-600 leading-relaxed">
                          Закажите автомобиль из Японии с идеальным состоянием и полной историей обслуживания
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'news' && (
                    <div className="space-y-3 pb-4">
                      {/* Новость 1 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">РБК • 2 часа назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              В России представили новую модель электромобиля с увеличенным запасом хода
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Российский производитель электромобилей анонсировал выпуск новой модели с запасом хода до 600 км...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 2 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Коммерсантъ • 4 часа назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Продажи автомобилей в России выросли на 15% в этом месяце
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Аналитики отмечают рост интереса к подержанным автомобилям японского производства...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 3 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">ТАСС • 6 часов назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Новые правила регистрации транспортных средств вступят в силу с декабря
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              МВД России утвердило обновленный регламент, упрощающий процедуру регистрации автомобилей...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 4 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Авто Mail.ru • 8 часов назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Эксперты назвали самые надежные автомобили 2024 года
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              В рейтинг вошли модели японских, корейских и европейских производителей...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 5 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Lenta.ru • 10 часов назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              В Приморском крае открылся новый автомобильный дилерский центр
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Современный комплекс предлагает широкий выбор автомобилей и услуги по обслуживанию...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 6 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Ведомости • Вчера</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Спрос на автомобили с правым рулем остается стабильным
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Аналитики рынка отмечают устойчивый интерес покупателей к японским автомобилям...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 7 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Autonews.ru • Вчера</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              ТОП-10 самых популярных автомобилей в России в 2024 году
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Эксперты составили рейтинг моделей, которые чаще всего покупают россияне в этом году...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 8 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Газета.Ru • 2 дня назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Новые технологии безопасности в современных автомобилях
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Производители активно внедряют системы помощи водителю и автономного вождения...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 9 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">РИА Новости • 2 дня назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Средняя цена подержанного автомобиля выросла на 8%
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Рост цен связан с увеличением спроса и дефицитом новых автомобилей на рынке...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 10 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Дром • 3 дня назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Как правильно выбрать автомобиль с пробегом: советы экспертов
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              На что обратить внимание при осмотре подержанного автомобиля перед покупкой...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 11 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Интерфакс • 3 дня назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Росстандарт запретил ввоз автомобилей без системы ЭРА-ГЛОНАСС
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              С января 2025 года вступают в силу новые требования к импортируемым автомобилям...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 12 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Auto.ru • 4 дня назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Toyota остается лидером рынка подержанных авто в России
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Японский автопроизводитель занимает первое место по количеству проданных автомобилей...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 13 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">За рулём • 5 дней назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Обзор новых кроссоверов: что выбрать в 2024 году
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Подробный анализ самых популярных моделей кроссоверов на российском рынке...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 14 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Мотор.ру • 5 дней назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Топливо на АЗС подорожало в среднем на 3 рубля за литр
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Цены на бензин и дизельное топливо выросли из-за сезонного спроса и роста акцизов...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>

                      {/* Новость 15 */}
                      <a href="https://dzen.ru/news" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-gray-200 overflow-hidden active:bg-gray-50 transition">
                        <div className="flex gap-3 p-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] xs:text-[12px] text-gray-500 mb-1">Авто.Вести • Неделю назад</div>
                            <h3 className="text-[14px] xs:text-[15px] font-medium text-gray-900 mb-1 line-clamp-2">
                              Страховка ОСАГО: как сэкономить при оформлении полиса
                            </h3>
                            <p className="text-[12px] xs:text-[13px] text-gray-600 line-clamp-2">
                              Эксперты рассказали о способах снижения стоимости обязательного автострахования...
                            </p>
                          </div>
                          <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=200&h=200&fit=crop" alt="Новость" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                        </div>
                      </a>
                    </div>
                  )}

                  {activeTab === 'photos' && (
                    <div className="grid grid-cols-3 gap-2 pb-4">
                      {[
                        "https://i.ibb.co/WSR6Z5C/photo-2025-11-21-14-53-38.jpg",
                        "https://i.ibb.co/XZ25Trfh/photo-2025-11-21-14-53-40.jpg",
                        "https://i.ibb.co/C5Z1gtC1/photo-2025-11-21-14-53-41-2.jpg",
                        "https://i.ibb.co/gZ3yQCRC/photo-2025-11-21-14-53-41.jpg",
                        "https://i.ibb.co/wZBL8ZhV/photo-2025-11-21-14-53-42.jpg",
                        "https://i.ibb.co/bjt7JhWv/photo-2025-11-21-14-53-43-2.jpg",
                        "https://i.ibb.co/7d1N9kzz/photo-2025-11-21-14-53-43.jpg",
                        "https://i.ibb.co/s7n40gQ/photo-2025-11-21-14-53-44.jpg",
                        "https://i.ibb.co/Z6PTVLmK/photo-2025-11-21-14-53-45.jpg",
                        "https://i.ibb.co/RGYtywLk/photo-2025-11-21-14-53-46.jpg",
                        "https://i.ibb.co/Xr9vk07q/photo-2025-11-21-14-55-16.jpg",
                        "https://i.ibb.co/5hxncnMn/photo-2025-11-21-14-55-19.jpg",
                        "https://i.ibb.co/Gh5xgpV/photo-2025-11-21-14-55-22.jpg",
                        "https://i.ibb.co/JR3WKCWv/photo-2025-11-21-14-55-24.jpg",
                        "https://i.ibb.co/gbF1f6rX/photo-2025-11-21-14-55-27.jpg",
                        "https://i.ibb.co/TNggmNr/Gemini-Generated-Image-bxpjrnbxpjrnbxpj.png",
                        "https://i.ibb.co/GfGMS75q/image-2025-09-27-10-41-54-2.png",
                        "https://i.ibb.co/HL3dkgYr/image-2025-09-27-10-41-54.png",
                        "https://i.ibb.co/twF8dnd8/photo-1-2025-11-21-17-05-23.jpg",
                        "https://i.ibb.co/HLDPCHct/photo-2-2025-11-21-17-05-23.jpg",
                        "https://i.ibb.co/fVqQgcPS/photo-2025-11-21-17-19-51.jpg",
                        "https://i.ibb.co/BV3pxsxZ/photo-2025-11-21-17-19-53.jpg",
                        "https://i.ibb.co/NdctTgVH/photo-2025-11-21-17-19-54.jpg",
                        "https://i.ibb.co/hR2m331w/photo-2025-11-21-17-19-55.jpg",
                        "https://i.ibb.co/39vQgYqh/photo-2025-11-21-17-19-59.jpg",
                        "https://i.ibb.co/TBpgBb8w/photo-2025-11-21-17-20-00.jpg",
                        "https://i.ibb.co/8gykhWzj/photo-2025-11-21-17-20-02.jpg",
                        "https://i.ibb.co/Gfmzv5wm/photo-2025-11-21-17-20-03.jpg",
                        "https://i.ibb.co/8LpT53xZ/photo-2025-11-22-09-43-50.jpg",
                        "https://i.ibb.co/TMpJ0tPn/photo-2025-11-22-09-44-05.jpg"
                      ].map((photo, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-200 rounded-lg overflow-hidden active:opacity-80 transition"
                          onClick={() => openPhotoGallery([
                            "https://i.ibb.co/WSR6Z5C/photo-2025-11-21-14-53-38.jpg",
                            "https://i.ibb.co/XZ25Trfh/photo-2025-11-21-14-53-40.jpg",
                            "https://i.ibb.co/C5Z1gtC1/photo-2025-11-21-14-53-41-2.jpg",
                            "https://i.ibb.co/gZ3yQCRC/photo-2025-11-21-14-53-41.jpg",
                            "https://i.ibb.co/wZBL8ZhV/photo-2025-11-21-14-53-42.jpg",
                            "https://i.ibb.co/bjt7JhWv/photo-2025-11-21-14-53-43-2.jpg",
                            "https://i.ibb.co/7d1N9kzz/photo-2025-11-21-14-53-43.jpg",
                            "https://i.ibb.co/s7n40gQ/photo-2025-11-21-14-53-44.jpg",
                            "https://i.ibb.co/Z6PTVLmK/photo-2025-11-21-14-53-45.jpg",
                            "https://i.ibb.co/RGYtywLk/photo-2025-11-21-14-53-46.jpg",
                            "https://i.ibb.co/Xr9vk07q/photo-2025-11-21-14-55-16.jpg",
                            "https://i.ibb.co/5hxncnMn/photo-2025-11-21-14-55-19.jpg",
                            "https://i.ibb.co/Gh5xgpV/photo-2025-11-21-14-55-22.jpg",
                            "https://i.ibb.co/JR3WKCWv/photo-2025-11-21-14-55-24.jpg",
                            "https://i.ibb.co/gbF1f6rX/photo-2025-11-21-14-55-27.jpg",
                            "https://i.ibb.co/TNggmNr/Gemini-Generated-Image-bxpjrnbxpjrnbxpj.png",
                            "https://i.ibb.co/GfGMS75q/image-2025-09-27-10-41-54-2.png",
                            "https://i.ibb.co/HL3dkgYr/image-2025-09-27-10-41-54.png",
                            "https://i.ibb.co/twF8dnd8/photo-1-2025-11-21-17-05-23.jpg",
                            "https://i.ibb.co/HLDPCHct/photo-2-2025-11-21-17-05-23.jpg",
                            "https://i.ibb.co/fVqQgcPS/photo-2025-11-21-17-19-51.jpg",
                            "https://i.ibb.co/BV3pxsxZ/photo-2025-11-21-17-19-53.jpg",
                            "https://i.ibb.co/NdctTgVH/photo-2025-11-21-17-19-54.jpg",
                            "https://i.ibb.co/hR2m331w/photo-2025-11-21-17-19-55.jpg",
                            "https://i.ibb.co/39vQgYqh/photo-2025-11-21-17-19-59.jpg",
                            "https://i.ibb.co/TBpgBb8w/photo-2025-11-21-17-20-00.jpg",
                            "https://i.ibb.co/8gykhWzj/photo-2025-11-21-17-20-02.jpg",
                            "https://i.ibb.co/Gfmzv5wm/photo-2025-11-21-17-20-03.jpg",
                            "https://i.ibb.co/8LpT53xZ/photo-2025-11-22-09-43-50.jpg",
                            "https://i.ibb.co/TMpJ0tPn/photo-2025-11-22-09-44-05.jpg"
                          ], index)}
                        >
                          <img src={photo} alt={`Фото ${index + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div className="space-y-3 pb-4">
                      {/* Профессиональная команда */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg active:bg-gray-100 transition">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="xs:w-[18px] xs:h-[18px]">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10b981" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] xs:text-[15px] font-medium text-gray-800 mb-1">Профессиональная команда</div>
                          <div className="text-[12px] xs:text-[13px] text-gray-600 leading-relaxed">
                            Опытные специалисты с многолетним опытом работы на рынке подержанных автомобилей
                          </div>
                        </div>
                      </div>

                      {/* Проверка качества */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg active:bg-gray-100 transition">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="xs:w-[18px] xs:h-[18px]">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="#3b82f6" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] xs:text-[15px] font-medium text-gray-800 mb-1">Проверка качества</div>
                          <div className="text-[12px] xs:text-[13px] text-gray-600 leading-relaxed">
                            Все автомобили проходят тщательную проверку технического состояния перед продажей
                          </div>
                        </div>
                      </div>

                      {/* Быстрое оформление */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg active:bg-gray-100 transition">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="xs:w-[18px] xs:h-[18px]">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#a855f7" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] xs:text-[15px] font-medium text-gray-800 mb-1">Быстрое оформление</div>
                          <div className="text-[12px] xs:text-[13px] text-gray-600 leading-relaxed">
                            Оперативное оформление всех необходимых документов для покупки автомобиля
                          </div>
                        </div>
                      </div>

                      {/* Индивидуальный подход */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg active:bg-gray-100 transition">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="xs:w-[18px] xs:h-[18px]">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="#f97316" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] xs:text-[15px] font-medium text-gray-800 mb-1">Индивидуальный подход</div>
                          <div className="text-[12px] xs:text-[13px] text-gray-600 leading-relaxed">
                            Подбираем автомобиль с учетом всех ваших пожеланий, бюджета и требований
                          </div>
                        </div>
                      </div>

                      {/* Помощь с документами */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg active:bg-gray-100 transition">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="xs:w-[18px] xs:h-[18px]">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#ef4444" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] xs:text-[15px] font-medium text-gray-800 mb-1">Помощь с документами</div>
                          <div className="text-[12px] xs:text-[13px] text-gray-600 leading-relaxed">
                            Полное сопровождение при оформлении документов и регистрации автомобиля
                          </div>
                        </div>
                      </div>

                      {/* Честные цены */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg active:bg-gray-100 transition">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="xs:w-[18px] xs:h-[18px]">
                            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#eab308" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] xs:text-[15px] font-medium text-gray-800 mb-1">Честные цены</div>
                          <div className="text-[12px] xs:text-[13px] text-gray-600 leading-relaxed">
                            Прозрачное ценообразование без скрытых платежей и дополнительных комиссий
                          </div>
                        </div>
                      </div>

                      {/* Автомобили из Европы */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg active:bg-gray-100 transition">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="xs:w-[18px] xs:h-[18px]">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#14b8a6" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] xs:text-[15px] font-medium text-gray-800 mb-1">Автомобили из Европы</div>
                          <div className="text-[12px] xs:text-[13px] text-gray-600 leading-relaxed">
                            Специализируемся на качественных европейских автомобилях известных брендов
                          </div>
                        </div>
                      </div>

                      {/* Высокий рейтинг */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg active:bg-gray-100 transition">
                        <div className="w-8 h-8 xs:w-9 xs:h-9 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="xs:w-[18px] xs:h-[18px]">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke="#ec4899" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] xs:text-[15px] font-medium text-gray-800 mb-1">Высокий рейтинг</div>
                          <div className="text-[12px] xs:text-[13px] text-gray-600 leading-relaxed">
                            Средняя оценка 4.8 из 5 на основе отзывов довольных клиентов
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="pb-4">
                      {/* Rating Box */}
                      <div className="mx-0 mt-3 mb-4 bg-[#f6f5f3] rounded-lg py-4 px-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="text-[40px] xs:text-[48px] iphone-16-pro-max:text-[56px] font-medium leading-none text-[#2d2d2d]">4,8</div>
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" className="xs:w-[16px] xs:h-[16px] iphone-16-pro-max:w-[18px] iphone-16-pro-max:h-[18px]">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                              ))}
                            </div>
                            <div className="text-[11px] xs:text-[12px] iphone-16-pro-max:text-[13px] text-gray-600">78 оценок</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                          <div className="text-[11px] xs:text-[12px] iphone-16-pro-max:text-[13px] text-gray-700 leading-tight text-right">
                            Оцените это место
                          </div>
                          <div
                            className="flex gap-0.5"
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                className="hover:scale-110 transition active:scale-95"
                                onMouseEnter={() => setHoverRating(star)}
                                onTouchStart={() => setHoverRating(star)}
                                onClick={() => {
                                  setRating(star);
                                  setShowReviewForm(true);
                                }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill={star <= hoverRating ? "#fbbf24" : "none"} stroke={star <= hoverRating ? "#fbbf24" : "#d1d5db"} strokeWidth="2" className="xs:w-[16px] xs:h-[16px] iphone-16-pro-max:w-[18px] iphone-16-pro-max:h-[18px]">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Reviews Header with Sort */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[15px] xs:text-[16px] iphone-16-pro-max:text-[17px] font-medium text-black">
                          {getFilteredAndSortedReviews().length} отзывов
                        </h3>
                        <div className="relative">
                          <select
                            value={sortMode}
                            onChange={(e) => setSortMode(e.target.value)}
                            className="px-2 py-1 text-[12px] xs:text-[13px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none pr-7"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
                          >
                            <option value="default">По умолчанию</option>
                            <option value="rating-high">Сначала высокие оценки</option>
                            <option value="rating-low">Сначала низкие оценки</option>
                          </select>
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-4">
                        {getFilteredAndSortedReviews().map((review) => (
                          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className="flex items-center gap-2.5 mb-2">
                              <img src={review.avatar} alt={review.name} className="w-9 h-9 xs:w-10 xs:h-10 rounded-full object-cover flex-shrink-0" loading="lazy" decoding="async" />
                              <div className="min-w-0">
                                <div className="text-gray-900 text-[13px] xs:text-[14px] font-medium truncate">{review.name}</div>
                                <div className="text-gray-600 text-[11px] xs:text-[12px] truncate">{review.level}</div>
                              </div>
                            </div>

                            <div className="flex gap-0.5 mb-2 ml-[42px] xs:ml-[52px] items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= review.rating ? "#fbbf24" : "#e5e7eb"} className="xs:w-[13px] xs:h-[13px]">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                              ))}
                              <span className="text-gray-600 text-[11px] xs:text-[12px] ml-2">{review.date}</span>
                            </div>

                            <div className="ml-[42px] xs:ml-[52px] text-[12px] xs:text-[13px] text-gray-800 leading-relaxed">
                              <div className={expandedReviews.has(review.id) ? '' : 'line-clamp-3'}>
                                {review.text}
                              </div>
                              {review.text.length > 280 && (
                                <button
                                  onClick={() => toggleReviewExpanded(review.id)}
                                  className="text-blue-600 hover:text-blue-700 font-normal mt-1 transition"
                                >
                                  {expandedReviews.has(review.id) ? 'скрыть' : 'ещё'}
                                </button>
                              )}
                            </div>

                            {review.photos && review.photos.length > 0 && (
                              <div className="ml-[42px] xs:ml-[52px] mt-2 flex gap-1.5">
                                {review.photos.map((photo, idx) => (
                                  <img
                                    key={idx}
                                    src={photo}
                                    alt=""
                                    className="w-16 h-16 xs:w-20 xs:h-20 rounded object-cover cursor-pointer hover:opacity-80 active:opacity-70 transition"
                                    onClick={() => openPhotoGallery(review.photos || [], idx)}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                ))}
                              </div>
                            )}

                            <div className="ml-[42px] xs:ml-[52px] mt-2 flex gap-3 items-center">
                              {/* Like Button */}
                              <button
                                onClick={() => handleLike(review.id)}
                                className={`flex items-center gap-1 transition-all duration-200 active:scale-95 ${
                                  reviewLikes[review.id]?.liked
                                    ? 'text-blue-600'
                                    : 'text-gray-400 hover:text-blue-600'
                                } ${reviewLikes[review.id]?.liked ? 'scale-110' : ''}`}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill={reviewLikes[review.id]?.liked ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  className="transition-transform xs:w-[18px] xs:h-[18px]"
                                >
                                  <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 002-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                                </svg>
                                {(reviewLikes[review.id]?.likes || 0) > 0 && (
                                  <span className="text-[11px] xs:text-[12px] font-medium">{reviewLikes[review.id].likes}</span>
                                )}
                              </button>

                              {/* Dislike Button */}
                              <button
                                onClick={() => handleDislike(review.id)}
                                className={`flex items-center gap-1 transition-all duration-200 active:scale-95 ${
                                  reviewLikes[review.id]?.disliked
                                    ? 'text-red-600'
                                    : 'text-gray-400 hover:text-red-600'
                                } ${reviewLikes[review.id]?.disliked ? 'scale-110' : ''}`}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill={reviewLikes[review.id]?.disliked ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  className="transition-transform xs:w-[18px] xs:h-[18px]"
                                >
                                  <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
                                </svg>
                                {(reviewLikes[review.id]?.dislikes || 0) > 0 && (
                                  <span className="text-[11px] xs:text-[12px] font-medium">{reviewLikes[review.id].dislikes}</span>
                                )}
                              </button>
                            </div>

                            <button
                              onClick={() => toggleBusinessResponse(review.id)}
                              className="ml-[42px] xs:ml-[52px] mt-2 text-[11px] xs:text-[12px] text-gray-500 hover:text-gray-700 active:text-gray-800 flex items-center gap-1 transition"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`transition-transform xs:w-[13px] xs:h-[13px] ${showBusinessResponse.has(review.id) ? 'rotate-180' : ''}`}
                              >
                                <path d="M7 10l5 5 5-5z"/>
                              </svg>
                              {showBusinessResponse.has(review.id) ? 'Скрыть ответ организации' : 'Посмотреть ответ организации'}
                            </button>

                            {/* Business Response */}
                            {showBusinessResponse.has(review.id) && (
                              <div className="ml-[42px] xs:ml-[52px] mt-2 p-3 bg-blue-50 border-l-4 border-black rounded-r-lg animate-slideUp">
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-[10px] font-bold">AP</span>
                                  </div>
                                  <div>
                                    <div className="text-[12px] xs:text-[13px] font-semibold text-gray-900">ООО «Спорт Тех»</div>
                                    <div className="text-[10px] xs:text-[11px] text-gray-500">Представитель компании</div>
                                  </div>
                                </div>
                                <div className="text-[12px] xs:text-[13px] text-gray-800 leading-relaxed">
                                  {getBusinessResponse(review.id)}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Write Review Button - Mobile FAB */}
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="fixed bottom-6 right-4 z-30 w-14 h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95"
                        aria-label="Написать отзыв"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Button - Desktop (Fixed in Reviews Tab) */}
      {isWidgetVisible && activeTab === 'reviews' && !isPanelCollapsed && (
        <div className="hidden lg:block fixed bottom-6 z-30" style={{ left: 'calc(714px - 220px)' }}>
          <button
            onClick={() => setShowReviewForm(true)}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-5 py-3 rounded-full shadow-lg border border-gray-200 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span className="text-[15px] font-medium">Написать отзыв</span>
          </button>
        </div>
      )}

      {/* Right Panel - Map (Desktop Only) */}
      <div className="hidden lg:flex flex-1 relative">
        <iframe
          src="https://yandex.com/map-widget/v1/?from=api-maps&ll=60.544249%2C56.824538&mode=whatshere&whatshere%5Bpoint%5D=60.544249%2C56.824538&whatshere%5Bzoom%5D=17&z=17&theme=light"
          allowFullScreen
          className="w-full h-full border-0"
        />

        {/* Toggle/Open Widget Button (Desktop) */}
        {!isWidgetVisible ? (
          <button
            onClick={() => setIsWidgetVisible(true)}
            className="absolute top-4 left-4 w-10 h-10 bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded shadow-xl flex items-center justify-center transition-all duration-300 z-20"
            aria-label="Открыть виджет"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            className="absolute top-4 left-4 w-10 h-10 bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded shadow-xl flex items-center justify-center transition-all duration-300 z-20"
            aria-label={isPanelCollapsed ? 'Развернуть панель' : 'Свернуть панель'}
          >
            {isPanelCollapsed ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Photo Gallery Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex items-center justify-center animate-fadeIn"
          onClick={closePhotoGallery}
        >
          {/* Close Button */}
          <button
            onClick={closePhotoGallery}
            className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition z-10"
            aria-label="Закрыть"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Photo Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-[14px] z-10">
            {currentPhotoIndex + 1} / {photoGallery.length}
          </div>

          {/* Previous Button */}
          {currentPhotoIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition z-10"
              aria-label="Предыдущее фото"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {currentPhotoIndex < photoGallery.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition z-10"
              aria-label="Следующее фото"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Photo */}
          <img
            src={selectedPhoto}
            alt="Увеличенное фото"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
            loading="eager"
            decoding="async"
          />
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] animate-fadeIn p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-[20px] font-semibold text-gray-900">Поиск на карте</h2>
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                }}
                className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="p-6">
              <div className="relative">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      searchOnMap(searchQuery);
                    }
                  }}
                  placeholder="Введите адрес, название места или организации..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            {/* Categories */}
            <div className="px-6 pb-6">
              <h3 className="text-[15px] font-medium text-gray-800 mb-3">Популярные категории</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => searchOnMap('автосалоны Тольятти')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="#3b82f6"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">Автосалоны</div>
                    <div className="text-[13px] text-gray-500">Продажа авто</div>
                  </div>
                </button>

                <button
                  onClick={() => searchOnMap('автосервисы Тольятти')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-300 transition text-left"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19 3H5c-1.11 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="#ef4444"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">Автосервисы</div>
                    <div className="text-[13px] text-gray-500">Ремонт и ТО</div>
                  </div>
                </button>

                <button
                  onClick={() => searchOnMap('АЗС Тольятти')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition text-left"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="#10b981"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">АЗС</div>
                    <div className="text-[13px] text-gray-500">Заправки</div>
                  </div>
                </button>

                <button
                  onClick={() => searchOnMap('парковки Тольятти')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition text-left"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" fill="#f97316"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-gray-900">Парковки</div>
                    <div className="text-[13px] text-gray-500">Стоянки</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    searchOnMap(searchQuery);
                  } else {
                    alert('Введите поисковый запрос');
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Искать на карте
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] animate-fadeIn p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-[20px] font-semibold text-gray-900">Построить маршрут</h2>
              <button
                onClick={() => {
                  setShowRouteModal(false);
                  setRouteFrom('');
                }}
                className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Route Form */}
            <div className="p-6 space-y-4">
              {/* From */}
              <div>
                <label className="text-[14px] font-medium text-gray-700 mb-2 block">Откуда</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  <input
                    type="text"
                    value={routeFrom}
                    onChange={(e) => setRouteFrom(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && routeFrom) {
                        buildRoute();
                      }
                    }}
                    placeholder="Введите адрес отправления"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={useCurrentLocation}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition"
                    title="Моё местоположение"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const temp = routeFrom;
                    setRouteFrom(routeTo);
                    setRouteTo(temp);
                  }}
                  className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
                  </svg>
                </button>
              </div>

              {/* To */}
              <div>
                <label className="text-[14px] font-medium text-gray-700 mb-2 block">Куда</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full"></div>
                  <input
                    type="text"
                    value={routeTo}
                    onChange={(e) => setRouteTo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && routeFrom) {
                        buildRoute();
                      }
                    }}
                    placeholder="Введите адрес назначения"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Transport Type */}
              <div>
                <label className="text-[14px] font-medium text-gray-700 mb-3 block">Способ передвижения</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedTransport('auto')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition ${
                      selectedTransport === 'auto'
                        ? 'border-2 border-black bg-blue-50'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedTransport === 'auto' ? '#3b82f6' : 'currentColor'} strokeWidth="2">
                      <path d="M5 17h2v2H5v-2zM17 17h2v2h-2v-2z"/>
                      <path d="M6 6l1.5-2h9l1.5 2H20a2 2 0 012 2v7a2 2 0 01-2 2h-1v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2H4a2 2 0 01-2-2V8a2 2 0 012-2h2z"/>
                    </svg>
                    <span className={`text-[14px] font-medium ${selectedTransport === 'auto' ? 'text-blue-600' : 'text-gray-700'}`}>Авто</span>
                  </button>
                  <button
                    onClick={() => setSelectedTransport('transit')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition ${
                      selectedTransport === 'transit'
                        ? 'border-2 border-black bg-blue-50'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedTransport === 'transit' ? '#3b82f6' : 'currentColor'} strokeWidth="2">
                      <rect x="3" y="6" width="18" height="13" rx="2"/>
                      <path d="M3 12h18M9 19v2M15 19v2M9 6V4M15 6V4"/>
                    </svg>
                    <span className={`text-[14px] font-medium ${selectedTransport === 'transit' ? 'text-blue-600' : 'text-gray-700'}`}>Транспорт</span>
                  </button>
                  <button
                    onClick={() => setSelectedTransport('walk')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg transition ${
                      selectedTransport === 'walk'
                        ? 'border-2 border-black bg-blue-50'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selectedTransport === 'walk' ? '#3b82f6' : 'currentColor'} strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                    <span className={`text-[14px] font-medium ${selectedTransport === 'walk' ? 'text-blue-600' : 'text-gray-700'}`}>Пешком</span>
                  </button>
                </div>
              </div>

              {/* Route Info */}
              {routeFrom && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[14px] text-gray-700">Расстояние</div>
                    <div className="text-[15px] font-semibold text-gray-900">≈ 12.4 км</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[14px] text-gray-700">Время в пути</div>
                    <div className="text-[15px] font-semibold text-gray-900">≈ 18 мин</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[14px] text-gray-700">Пробки</div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-[14px] text-gray-700">Свободно</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => {
                  setShowRouteModal(false);
                  setRouteFrom('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition"
              >
                Отмена
              </button>
              <button
                onClick={buildRoute}
                disabled={!routeFrom}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Построить маршрут
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Review Form Modal - Accessible from Desktop and Mobile */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] animate-fadeIn p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[460px] max-h-[90vh] animate-slideUp overflow-hidden flex flex-col">
            <div className="relative px-6 pt-5 pb-3 bg-white sticky top-0 z-10">
              <h2 className="text-[20px] font-medium text-gray-900">Как вам это место?</h2>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setRating(0);
                  setReviewText('');
                  setUploadedPhotos([]);
                }}
                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="px-6 pt-2">
                <div className="w-full bg-white rounded-lg p-4 flex items-center justify-center">
                  <img src="/logo-light.png?v=3" alt="ООО «АВТОМИГ»" className="w-full max-w-xs h-auto" loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="px-6 pt-3 pb-3">
                <h3 className="text-[17px] font-medium text-gray-900">ООО «АВТОМИГ»</h3>
                <a href="https://yandex.ru/maps/?ll=50.0811%2C53.1208&z=18&text=Тольятти%2C%20Шлюзовая%20ул%2C%20д.%202" target="_blank" rel="noopener noreferrer" className="text-[13px] text-blue-600 hover:text-blue-700 active:text-blue-800 mt-0.5 block">443065, Самарская область, г. Самара, Долотный пер., д.7, 10</a>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <div className="flex gap-2 justify-center" onMouseLeave={() => setHoverRatingModal(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRatingModal(star)}
                      className="transition hover:scale-110 active:scale-95"
                    >
                      <svg width="44" height="44" viewBox="0 0 24 24" fill={star <= (hoverRatingModal || rating) ? "#FFC107" : "#E0E0E0"}>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder=""
                  className="w-full h-28 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-[15px]"
                />
                <div>
                  <input type="file" id="photo-upload-mobile" accept="image/*,video/*" multiple onChange={(e) => handlePhotoUpload(e.target.files)} className="hidden" />
                  <label htmlFor="photo-upload-mobile" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`block border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${isDragging ? 'border-black bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                    <div className="flex flex-col items-center gap-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <div>
                        <p className="text-[15px] text-blue-600 font-medium">Добавить фото или видео</p>
                        <p className="text-[13px] text-gray-500 mt-1">Можно перетаскивать его в эту рамку</p>
                      </div>
                    </div>
                  </label>
                  {uploadedPhotos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {uploadedPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img src={photo} alt={`Фото ${index + 1}`} className="w-full h-24 object-cover rounded-lg border border-gray-200" loading="lazy" decoding="async" />
                          <button onClick={() => removePhoto(index)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => { setShowReviewForm(false); setShowThankYouModal(true); }} disabled={!rating} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 text-[15px]">
                  Сохранить
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[13px] text-gray-500">
                  <span>Оценка и отзыв публикуются для всех</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] animate-fadeIn p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] animate-slideUp overflow-hidden">
            <div className="relative p-4">
              <button onClick={() => { setShowThankYouModal(false); setRating(0); setReviewText(''); setUploadedPhotos([]); }} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="px-8 pb-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 opacity-20"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 opacity-30"></div>
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 bg-purple-700 rounded-lg transform rotate-45"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="#FFC107" className="relative z-10">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-[22px] font-medium text-gray-900 mb-3">Хорошо, что сказали!</h2>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-6">Ваши отзывы помогают другим определиться с выбором. Пишите ещё!</p>
              <div className="space-y-3">
                <button onClick={() => { setShowThankYouModal(false); setRating(0); setReviewText(''); setUploadedPhotos([]); }} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-[15px]">
                  Оценить другие места
                </button>
                <button onClick={() => { setShowThankYouModal(false); setRating(0); setReviewText(''); setUploadedPhotos([]); }} className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition text-[15px]">
                  Готово
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copied URL Notification Toast */}
      {showCopiedNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] animate-fadeIn">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-[15px] font-medium">Ссылка скопирована!</span>
          </div>
        </div>
      )}

      {/* Phone Number Notification Toast */}
      {showPhoneNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] animate-fadeIn">
          <div className="bg-[#4a90e2] text-white px-6 py-4 rounded-lg shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-2.17 1.861a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l1.86-2.171a1 1 0 00-.086-1.391l-4.064-3.696z"/>
              </svg>
              <span className="text-[15px] font-medium">Номер телефона:</span>
            </div>
            <a href="tel:+79809751463" className="text-[18px] font-bold hover:underline">
              +7 (980) 975-14-63
            </a>
            <div className="text-[13px] mt-2 opacity-90">
              Нажмите еще раз для звонка
            </div>
          </div>
        </div>
      )}

      {/* Favorite Notification Toast */}
      {showFavoriteNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] animate-fadeIn">
          <div className={`${favoriteAction === 'added' ? 'bg-green-600' : 'bg-gray-700'} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            <span className="text-[15px] font-medium">
              {favoriteAction === 'added' ? 'Добавлено в избранное!' : 'Удалено из избранного'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

Как запустить?
Установите зависимости:

bash
npm install
Создайте файл .env в корне проекта и добавьте туда:

text
API_ORIGIN=https://larek-api.nomoreparties.co
Команды:

npm run start — запуск разработки с автообновлением.

npm run build — сборка проекта.

npm run lint — проверка кода, npm run format — форматирование.

Архитектура проекта
Базовые классы
EventDispatcher
Центральная система событий приложения. Функции:

Подписка/отписка на события (on/off)

Генерация событий (dispatch)

Поддержка wildcard-паттернов для событий

UIDomController
Базовый класс для всех UI-компонентов. Функции:

Управление DOM-элементами

Обновление состояния компонента

Работа с классами и атрибутами элементов

DataEntity
Базовый класс для моделей данных. Функции:

Хранение состояния

Уведомление об изменениях через события

Интеграция с EventDispatcher

Основные компоненты
Модели данных
ProductCollection
Назначение: Управление списком товаров

Методы:

updateProductList() - загрузка новых товаров

findProductById() - поиск по ID

События:

productList:update - при обновлении списка

ShoppingCartManager
Назначение: Управление корзиной покупок

Методы:

addItem()/removeItem()

calculateTotal() - подсчет суммы

События:

cart:update - при изменении корзины

UI Компоненты
ProductCard
Отображает: Карточку товара

Props:

id, title, price, imageUrl

onClick - обработчик клика

Использует: UIDomController для рендеринга

CheckoutForm
Отображает: Форму оформления заказа

Состояние:

payment - способ оплаты

address - адрес доставки

Валидация: Через CheckoutProcessor

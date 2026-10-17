<h1>Cinema Booking API</h1>

<p>REST API для перегляду кіносеансів і бронювання місць. Дані зберігаються у PostgreSQL через Prisma ORM 8.</p>

<h2>Зміст</h2>

<ul>
  <li><a href="#run">Запуск проєкту</a></li>
  <li><a href="#test-data">Тестові дані</a></li>
  <li><a href="#endpoints">Endpoints</a></li>
  <li><a href="#many-to-many">Як працює зв’язок і запит</a></li>
  <li><a href="#requirements">Перевірка вимог</a></li>
  <li><a href="#api-examples">Приклади роботи API</a></li>
  <li><a href="#database-examples">Таблиці бази даних</a></li>
  <li><a href="#questions">Відповіді на запитання</a></li>
</ul>

<h2 id="run">Запуск проєкту</h2>

<ol>
  <li>Встановіть Node.js і PostgreSQL 15 або новішої версії.</li>
  <li>Створіть у PostgreSQL базу даних.</li>
  <li>У корені проєкту створіть файл <code>.env</code> і вкажіть адресу підключення:
    <pre><code>DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public"</code></pre>
    Замініть <code>USER</code>, <code>PASSWORD</code> і <code>DATABASE</code> на свої значення.
  </li>
  <li>Встановіть залежності:
    <pre><code>npm install</code></pre>
  </li>
  <li>Застосуйте міграції та створіть таблиці:
    <pre><code>npx prisma db migrate</code></pre>
  </li>
  <li>Запустіть сервер:
    <pre><code>npm run start</code></pre>
  </li>
</ol>

<p>За замовчуванням API доступне за адресою <code>http://localhost:3001</code>. Для іншого порту задайте змінну <code>PORT</code> у файлі <code>.env</code>.</p>

<h2 id="test-data">Тестові дані</h2>

<p>Міграція створює таблиці, але не додає тестові сеанси й місця. Додайте шість місць (два ряди по три) та щонайменше два сеанси у своїй базі даних. Наприклад, виконайте цей SQL один раз:</p>

<pre><code>INSERT INTO "Seat" ("row", "number") VALUES
  (1, 1), (1, 2), (1, 3),
  (2, 1), (2, 2), (2, 3);

INSERT INTO "MovieSession" ("movieTitle", "startsAt") VALUES
  ('Дюна: Частина друга — 18:00', '2026-10-20 18:00:00+03'),
  ('Дюна: Частина друга — 21:00', '2026-10-20 21:00:00+03');</code></pre>

<p>У поточній схемі <code>movieTitle</code> має обмеження унікальності, тому для двох сеансів одного фільму в прикладі до назви додано час. Бронювання додаються через API і зберігаються окремо для кожного сеансу.</p>

<h2 id="endpoints">Endpoints</h2>

<ul>
  <li><code>GET /sessions</code> — список усіх кіносеансів.</li>
  <li><code>GET /sessions/:id</code> — кіносеанс за ідентифікатором.</li>
  <li><code>GET /sessions/:id/seats</code> — місця залу та їхній статус <code>booked</code> для цього сеансу.</li>
  <li><code>POST /sessions/:id/book</code> — бронювання місця. Передайте <code>seatId</code> у JSON-тілі запиту.</li>
</ul>

<p>Замість <code>:id</code> вкажіть числовий ідентифікатор сеансу, наприклад <code>http://localhost:3001/sessions/1</code>.</p>

<p>Для перевірки місць відкрийте <code>http://localhost:3001/sessions/1/seats</code>. Некоректний запит повертає <code>400</code>, відсутній сеанс або місце — <code>404</code>, повторне бронювання — <code>409</code>.</p>

<h2 id="many-to-many">Як працює зв’язок і запит</h2>

<p><code>MovieSession</code> і <code>Seat</code> мають зв’язок Many-to-Many: один сеанс може містити багато місць, а одне місце може використовуватися на різних сеансах. У <a href="src/prisma/contract.prisma">контракті Prisma</a> цей зв’язок описаний полями <code>seats</code> і <code>movieSessions</code>. Фактичне бронювання зберігається в окремій моделі <code>MovieSessionSeat</code>: її поля <code>MovieSessionId</code> та <code>SeatId</code> посилаються на відповідні записи, а складений первинний ключ <code>@@id([MovieSessionId, SeatId])</code> забороняє двічі додати ту саму пару. Тому одне місце можна забронювати на різних сеансах, але не двічі на одному. Поля <code>booked</code> у таблиці немає — API обчислює цей статус за наявністю зв’язку.</p>

<p>Нижче — як проходить бронювання <code>POST /sessions/1/book</code> з тілом <code>{"seatId":1}</code> у коді проєкту:</p>

<ol>
  <li><strong>Маршрут.</strong> У <a href="src/transport/routers/cinema/cinema.ts">роутері сеансів</a> шлях <code>POST /:id/book</code> передає запит у <code>cinemaHandler.bookSeat</code>.</li>
  <li><strong>Handler.</strong> В <a href="src/transport/handlers/cinema/cinema.ts">обробнику запитів</a> метод <code>bookSeat</code> бере ID сеансу з URL, а <code>seatId</code> — із JSON-тіла. Функція <code>validate</code> перевіряє, що обидва значення є додатними цілими числами. Некоректні дані одразу дають <code>400</code>.</li>
  <li><strong>Service.</strong> У <a href="src/services/cinema/cinema.ts">сервісі</a> <code>bookSeat</code> спочатку шукає сеанс, а потім отримує список місць та їхні статуси для цього сеансу. Якщо сеансу або місця немає, повертається <code>404</code>; якщо місце вже зайняте — <code>409</code>. Лише для вільного місця сервіс викликає репозиторій.</li>
  <li><strong>Repository і Prisma.</strong> У <a href="src/repositories/cinema.ts">репозиторії</a> метод <code>bookSeat</code> створює запис моделі <code>MovieSessionSeat</code> через <code>db.orm.public.MovieSessionSeat.create(...)</code>. Prisma записує пару ID в PostgreSQL. Якщо такий зв’язок уже існує, складений первинний ключ не дозволяє дубль; помилка перетворюється на <code>SEAT_ALREADY_RESERVED</code> і handler повертає <code>409</code>.</li>
  <li><strong>Відповідь.</strong> Після успішного запису handler відповідає <code>200</code> і <code>{"success":true}</code>. Помилки про відсутній сеанс або місце повертаються як <code>404</code>.</li>
</ol>

<p>Для <code>GET /sessions/1/seats</code> handler викликає service, а той — <code>getSessionSeats</code> у repository. Репозиторій завантажує місця, пов’язані з сеансом, і всі місця залу; для кожного місця встановлює <code>booked: true</code>, якщо його ID є серед пов’язаних із цим сеансом, інакше <code>false</code>. Цей статус формується для відповіді API, а не зберігається в базі.</p>

<p>Код налаштування Prisma-клієнта та його підключення до PostgreSQL міститься у <a href="src/prisma/db.ts">db.ts</a>. Повний шлях запиту: клієнт → router → handler → service → repository → Prisma ORM → PostgreSQL. Відповідь повертається назад через repository, service і handler.</p>
<p><img src="image/Booking.png" alt="Приклад запиту бронювання місця в Postman"></p>

<h2 id="requirements">Перевірка вимог</h2>

<ul>
  <li>У базі є щонайменше два сеанси та шість місць залу.</li>
  <li>Працюють усі чотири endpoints: список сеансів, сеанс за ID, місця сеансу та бронювання.</li>
  <li>Місця повертаються зі статусом <code>booked: true</code> або <code>booked: false</code>; статус залежить від конкретного сеансу.</li>
  <li>Успішне бронювання створює зв’язок між сеансом і місцем у PostgreSQL та залишається після перезапуску сервера.</li>
  <li>Повторне бронювання зайнятого місця повертає <code>409</code>; некоректні дані — <code>400</code>; відсутній сеанс або місце — <code>404</code>.</li>
  <li>Команда може пояснити зв’язок Many-to-Many і шлях запиту через шари застосунку.</li>
</ul>

<h2 id="api-examples">Приклади роботи API</h2>

<p>Зображення нижче показують приклади запитів і результатів:</p>

<p><img src="image/TakeSessions.png" alt="Список кіносеансів"></p>
<p><img src="image/TakeSessionById.png" alt="Кіносеанс за ідентифікатором"></p>
<p><img src="image/TakeSeatsByIDSession.png" alt="Місця вибраного сеансу"></p>
<p><img src="image/Booking.png" alt="Бронювання місця"></p>
<p><img src="image/BookinAlredy.png" alt="Відповідь при повторному бронюванні"></p>
<p><img src="image/ResualtInDB.png" alt="Збережені дані у базі"></p>

<h2 id="database-examples">Таблиці бази даних</h2>

<p><img src="image/DBMovieSession.png" alt="Таблиця кіносеансів у базі даних"></p>
<p><img src="image/DBSeat.png" alt="Шість місць у таблиці місць"></p>
<p><img src="image/DBMovieSessionSeat.png" alt="Зв’язки бронювання сеансів і місць"></p>
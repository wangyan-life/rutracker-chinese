// ==UserScript==
// @name         Rutracker 中文化插件
// @namespace    https://github.com/wangyan-life
// @match        https://rutracker.net/*
// @version      1.1
// @description  Rutracker 汉化插件，Rutracker 中文化界面。(Rutracker Translation To Chinese)
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    const i18n = new Map([
        //----------主页(https://rutracker.net/forum/index.php)----------
        ////----------左上----------
        ['Главная', '主页'],
        ['Трекер', '跟踪器'],
        ['Поиск', '搜索'],
        ['Группы', '群组'],
        ['FAQ', '常见问题'],
        ////----------右上----------
        ['Браузерные и клиентские онлайн-игры', '浏览器和客户端网络游戏'],
        ['Пополнить баланс Steam', '充值 Steam 余额'],
        ////----------搜索栏----------
        ['Регистрация', '注册'],
        ['Вход', '登录'],
        ['вход', '登录'],
        ['раздачи', '发布'],
        ['все темы', '所有主题'],
        ['в wiki', '维基'],
        ['по info_hash', '哈希值'],
        ['поиск', '搜索'],
        ['Забыли имя или пароль', '忘记用户名或密码'],
        ['ЛС', '消息'],
        ['登录ящие', '收件箱'],
        ['Исходящие', '发件箱'],
        ['Отправленные', '已发送'],
        ['Сохранённые', '已保存'],
        ['Профиль', '个人资料'],
        ['Настройки', '设置'],
        ['Будущие закачки', '计划下载'],
        ['Избранное', '收藏夹'],
        ['Мои сообщения', '我的留言'],
        ['Мои 发布', '我的发布'],
        ['Начатые темы', '发起的主题'],
        ['Ответы в начатых темах', '已发起主题中的回复'],
        ////----------页面内容----------
        ['Новости трекера', '跟踪器新闻'],
        ['Карта форумов', '论坛地图'],
        ['Последние 发布', '最新发布'],
        ['Последние темы', '最新主题'],
        ['Опции показа', '显示选项'],
        ['Скрыть категории', '隐藏类别'],
        ['Авторские 发布', '作者发布'],
        //////----------1----------
        ['Товары, услуги, игры и развлечения', '商品、服务、游戏和娱乐'],
        ['Браузер для геймеров', '游戏玩家的浏览器'],
        ['Atomic Heart', '原子之心'],
        ['Как пополнить баланс', '如何在俄罗斯充值'],
        ['в России', '余额'],
        ['Магазины и образование', '商店与教育'],
        //////----------2----------
        ['ОБХОД БЛОКИРОВОК', '屏蔽'],
        ['VPN-сервисы', 'VPN 服务'],
        ['Surfshark', '冲浪鲨'],
        ['Плагины для браузеров', '浏览器插件'],
        ['Блокировка bt, способы обхода и обсуждение', '反种子吸血、绕过方法和讨论'],
        ['TOR, I2P, ONION и другие распределенные сети', 'TOR、I2P、ONION 和其他分布式网络'],
        ['Обход блокировок на мобильных устройствах', '绕过移动设备上的拦截'],
        ['Другие способы', '其他方式'],
        ['Раздел для жалоб', '访问问题申诉'],
        ['недоступность Рутрекера вне РФ', '俄罗斯境外无法访问 Rutracker'],
        ['Мой.Рутрекер', 'My.Rutracker'],
        //////----------3----------
        ['Новости', '新闻'],
        ['Обсуждение новостей трекера', '跟踪器新闻讨论'],
        ['新闻 "Хранителей" и "Антикваров"', '"守护者"和"古董商"新闻'],
        ['Краудфандинг', '众筹'],
        ['переводы, покупка дисков и т. п.', '翻译、购买光盘等'],
        ['Подфорум для общих сборов', '一般收藏子论坛'],
        ['Переводы: фильмы, мультфильмы, сериалы - СВ Студия', '翻译：电影、动画片、电视剧 - SV Studio'],
        ['Переводы: фильмы, мультфильмы, сериалы - Авторские переводчики', '翻译：电影、动画片、电视剧 - Author Translators'],
        ['GENERATION.TORRENT - Музыкальный конкурс', 'GENERATION.TORRENT - 音乐竟赛'],
        ['Rutracker Awards', 'Rutracker 奖项'],
        ['мероприятия и конкурсы', '活动和竞赛'],
        ['Доска почета!', '荣誉板！'],
        //////----------4----------
        ['Вопросы по форуму и трекеру', '论坛和跟踪器问题'],
        ['основные инструкции', '基本说明'],
        ['常见问题-и', '常见问题'],
        ['Предложения по улучшению форума и трекера', '关于改进论坛和跟踪器的建议'],
        ['Вопросы по BitTorrent сети и ее клиентам', '关于 BitTorrent 网络及其客户端的问题'],
        ['Обсуждение провайдеров', 'ISP 讨论'],
        ['Железо', '硬件'],
        ['комплектующие и периферия', '组件和外设'],
        ['комплексные проблемы', '复杂问题'],
        ['Подбор конфигурации, выбор и обсуждение комплектующих', '组件的配置、选择和讨论'],
        //////----------5----------
        ['Кино, Видео и ТВ', '电影、视频和电视'],
        ['Предложения по улучшению категории', '改进分类的建议'],
        ['Кино, Видео и TV - помощь по разделу', '电影、视频和电视 - 栏目帮助'],
        ['Заявки, заказы, координация', '请求、订单、协调'],
        ['Наше кино', '本国电影'],
        ['Кино СССР', '苏联电影'],
        ['Детские отечественные фильмы', '国产儿童电影'],
        ['Зарубежное кино', '外国电影'],
        ['Тематические подборки ссылок', '链接专题集'],
        ['Классика мирового кинематографа', '世界经典电影'],
        ['Фильмы 2016-2020', '2016-2020 年电影'],
        ['Фильмы 2021-2023', '2021-2023 年电影'],
        ['Фильмы 2024', '2024 年电影'],
        ['Короткий метр', '短片'],
        ['Анимация', '动画片'],
        ['Театр', '戏剧'],
        ['DVD Video', 'DVD 视频'],
        ['HD Video', '高清视频'],
        ['U高清视频', '超高清视频'],
        ['3D/Стерео Кино, Видео, TV и Спорт', '3D/立体电影、视频、电视和体育节目'],
        ['Мультфильмы', '卡通片'],
        ['Мультсериалы', '动画系列'],
        ['Аниме', '动漫'],
        //////----------6----------
        ['Сериалы', '连续剧'],
        ['Русские сериалы', '俄罗斯电视剧'],
        ['Зарубежные сериалы', '外国电视剧'],
        ['Новинки и сериалы в стадии показа', '新剧和正在拍摄的电视剧'],
        ['Зарубежные сериалы', '外国电视剧'],
        ['连续剧 Латинской Америки, Турции и Индии', '拉丁美洲、土耳其和印度连续剧'],
        ['Азиатские сериалы', '亚洲连续剧'],
        //////----------7----------
        ['Документалистика и юмор', '纪录片和幽默剧'],
        ['Вера и религия', '信仰与宗教'],
        ['Документальные фильмы и телепередачи', '纪录片和电视节目'],
        ['Документальные', '纪录片'],
        ['Развлекательные телепередачи и шоу, приколы и юмор', '娱乐电视节目和表演、笑话和幽默剧'],
        //////----------8----------
        ['Спорт', '体育'],
        ['XXXIII Летние Олимпийские игры 2024', '2024 年第三十三届夏季奥运会'],
        ['Легкая атлетика. Плавание. Прыжки в воду. Синхронное плавание. Гимнастика', '田径、游泳、跳水、花样游泳、体操'],
        ['Велоспорт. Академическая гребля. Гребля на байдарках и каноэ', '自行车、赛艇、独木舟'],
        ['Футбол. Баскетбол. Волейбол. Гандбол', '足球、篮球、排球、手球'],
        ['Водное поло. Регби. Хоккей на траве', '水球、橄榄球、曲棍球'],
        ['Фехтование. Стрельба. Стрельба из лука', '击剑、射击、射箭'],
        ['Современное пятиборье', '现代五项'],
        ['Бокс. Борьба Вольная и Греко-римская. Дзюдо. Карате. Тхэквондо', '拳击、自由式摔跤和希腊罗马式摔跤、柔道、空手道、跆拳道'],
        ['Другие виды спорта', '其他体育项目'],
        ['XXXII Летние Олимпийские игры 2020', '2020 年第三十二届夏季奥运会'],
        ['XXIV Зимние Олимпийские игры 2022', '2022 年第二十四届冬季奥运会'],
        ['体育ивные турниры, фильмы и передачи', '体育比赛、电影和节目'],
        ['Формула-1', '世界一级方程式锦标赛'],
        ['Велоспорт', '自行车'],
        ['Бокс', '拳击'],
        ['Смешанные единоборства и K-1', '综合格斗和 K-1'],
        ['Зимние виды спорта', '冬季运动'],
        ['Фигурное катание', '花样滑冰'],
        ['Биатлон', '冬季两项'],
        ['Футбол', '足球'],
        ['Чемпионат Мира 2026', '2026 年世界锦标赛'],
        ['Чемпионат Европы 2024', '2024 年欧洲锦标赛'],
        ['финальный турнир', '决赛'],
        ['Россия 2024-2025', '俄罗斯 2024-2025'],
        ['Англия', '英国'],
        ['Еврокубки 2024-2025', '欧洲杯 2024-2025'],
        ['Баскетбол', '篮球'],
        ['Европейский клубный баскетбол', '欧洲俱乐部篮球赛'],
        ['Хоккей', '曲棍球'],
        ['Рестлинг', '摔跤'],
        ['UHDTV', '超高清电视'],
        ['отбор', '甄选'],
        ['гг.', '等'],
        ['КХЛ', 'KHL 俄罗斯大陆冰球联盟'],
        ['НХЛ', 'NHL 美国冰球职业联盟'],
        ['с 2013', '自 2013 以来'],
        //////----------9----------
        ['Книги и журналы', '书籍和杂志'],
        ['Книг и журналов', '书籍和杂志'],
        ['помощь, предложения по улучшению, сканирование', '帮助、改进建议、扫描'],
        ['Сканирование, обработка сканов', '扫描、扫描处理'],
        ['общий раздел', '一般部分'],
        ['Кино, театр, ТВ, мультипликация, цирк', '电影、戏剧、电视、动画、马戏团'],
        ['Журналы и газеты', '杂志和报纸'],
        ['Для детей, родителей и учителей', '儿童、家长和教师'],
        ['体育, физическая культура, боевые искусства', '体育、体能训练、武术'],
        ['Футбол', '足球'],
        ['книги и журналы', '书籍和杂志'],
        ['Хоккей', '曲棍球'],
        ['体育ивная пресса', '体育新闻'],
        ['Гуманитарные науки', '人文科学'],
        ['Искусствоведение. Культурология', '艺术史文化研究'],
        ['Литературоведение', '文学研究'],
        ['Философия', '哲学'],
        ['Исторические науки', '历史科学'],
        ['Исторические персоны', '历史人物'],
        ['История России', '俄罗斯历史'],
        ['Эпоха СССР', '苏联时代'],
        ['Точные, естественные и инженерные науки', '精密科学、自然科学和工程科学'],
        ['Физика', '物理学'],
        ['Математика', '数学'],
        ['Машиностроение', '机械工程'],
        ['Ноты и Музыкальная литература', '音乐文学'],
        ['Военное дело', '军事科学'],
        ['История Второй мировой войны', '第二次世界大战史'],
        ['Военная техника', '军事技术'],
        ['Вера и религия', '信仰与宗教'],
        ['Христианство', '基督教'],
        ['Психология', '心理学'],
        ['Общая и прикладная психология', '普通心理学和应用心理学'],
        ['Популярная психология', '大众心理学'],
        ['Коллекционирование, увлечения и хобби', '收藏、爱好和消遣'],
        ['Вышивание', '刺绣'],
        ['Вязание', '针织'],
        ['Шитье, пэчворк', '缝纫、拼布'],
        ['Охота и рыбалка', '狩猎和钓鱼'],
        ['Кулинария', '烹饪'],
        ['книги', '书籍'],
        ['Моделизм', '模型制作'],
        ['Деревообработка', '木工'],
        ['Настольные игры', '棋盘游戏'],
        ['Художественная литература', '小说'],
        ['Русская литература', '俄罗斯文学'],
        ['Зарубежная литература', '外国文学'],
        ['XX и XXI век', '二十世纪和二十一世纪'],
        ['Отечественная фантастика / фэнтези / мистика', '国内小说、幻想、神秘主义'],
        ['Компьютерная литература', '计算机文学'],
        ['СУБД', '数据库管理系统'],
        ['Веб-дизайн и программирование', '网页设计与编程'],
        ['Программирование', '编程'],
        ['Комиксы, манга, ранобэ', '连环画、漫画、早期图书。'],
        ['Коллекции книг и библиотеки', '藏书和图书馆'],
        ['Мультимедийные и интерактивные издания', '多媒体和互动出版物'],
        ['Медицина и здоровье', '医学与健康'],
        ['Клиническая медицина после 2000 года', '2000 年后的临床医学'],
        ['Медико-биологические науки', '生命科学'],
        ['Нетрадиционная, народная медицина и популярные 书籍 о здоровье', '民间、传统医学和大众健康书籍'],
        ['Архив', '存档'],
        //////----------9----------
        ['Обучение иностранным языкам', '外语教学'],
        ['Объявления, предложения, помощь по разделу', '公告、建议、帮助'],
        ['Иностранные языки для взрослых', '成人外语'],
        ['Английский язык', '英语'],
        ['для взрослых', '成人'],
        ['Иностранные языки для детей', '儿童外语'],
        ['Художественная литература', '小说'],
        ['ин.языки', '外语'],
        ['小说 на английском языке', '英语小说'],
        ['Аудио书籍 на иностранных языках', '外语有声读物'],
        ['Архив', '存档'],
        ['Иностранные языки', '外语'],
        //////----------9----------
        ['Видеоуроки и обучающие интерактивные DVD', '视频课程和教育互动 DVD'],
        ['Кулинария', '烹饪'],
        ['Фитнес - Кардио-Силовые Тренировки', '健身 - 有氧运动和力量训练'],
        ['Видео- и фотосъёмка', '视频和摄影'],
        ['Игра на гитаре', '吉他弹奏'],
        ['Образование', '教育'],
        ['Боевые искусства', '武术'],
        ['Видеоуроки', '视频课程'],
        ['Компьютерные видеоуроки и обучающие интерактивные DVD', '计算机视频教程和教育互动 DVD'],
        ['Devops', '开发'],
        ['Adobe Photoshop', 'Adobe Photoshop'],
        ['2D-графика', '2D 图形'],
        ['3D-графика', '3D 图形'],
        ['Программирование', '编程'],
        ['видеоуроки', '视频课程'],
        ['Работа со звуком', '声音制作'],
        //////----------10----------
        ['Аудио书籍', '有声读物'],
        ['объявления, полезная информация', '公告、有用信息'],
        ['Радиоспектакли, история, мемуары', '广播剧、历史、回忆录'],
        ['Фантастика, фэнтези, мистика, ужасы, фанфики', '科幻、奇幻、神秘、恐怖、同人小说'],
        ['Художественная литература', '小说'],
        ['Религии', '宗教'],
        ['Прочая литература', '其他文学'],
        //////----------11----------
        ['Авто и мото', '汽车和摩托车'],
        ['Ремонт и эксплуатация транспортных средств', '汽车的维修和操作'],
        ['Оригинальные каталоги по подбору запчастей', '原装零配件目录'],
        ['Программы по диагностике и ремонту', '诊断和维修程序'],
        ['Книги по ремонту/обслуживанию/эксплуатации ТС', '有关车辆维修、保养、操作的书籍'],
        ['Фильмы и передачи по авто/мото', '汽车、摩托车电影和节目'],
        ['纪录片/познавательные фильмы', '纪录片、教育片'],
        ['Top Gear/Топ Гир', 'Top Gear'],
        //////----------12----------
        ['Музыка', '音乐'],
        ['Предложения по улучшению музыкальных разделов', '改进音乐版块的建议'],
        ['Помощь по музыкальным разделам', '音乐部分的帮助'],
        ['Классическая и современная академическая музыка', '古典和当代学术音乐'],
        ['Народная и Этническая музыка', '民间与民族音乐'],
        ['New Age, Relax, Meditative & Flamenco', '新世纪、放松、冥想和弗拉门戈音乐'],
        ["Рэп, Хип-Хоп, R'n'B", "说唱、嘻哈、R'n'B"],
        ['Reggae, Ska, Dub', '雷鬼、斯卡、配乐'],
        ['Саундтреки, караоке и мюзиклы', '原声带、卡拉 OK 和音乐剧'],
        ['Шансон, Авторская и Военная песня', '香颂、作家和军旅歌曲'],
        ['Лейбл- и сцен-паки. Неофициальные сборники и ремастеринги', '标签和场景包 非官方合辑和重制版'],
        //////----------13----------
        ['Популярная музыка', '流行音乐'],
        ['Отечественная поп-музыка', '国内流行音乐'],
        ['Зарубежная поп-музыка', '外国流行音乐'],
        ['Eurodance, Disco, Hi-NRG', '欧洲舞曲、迪斯科、Hi-NRG'],
        //////----------14----------
        ['Джазовая и Блюзовая музыка', '爵士乐和蓝调音乐'],
        ['Зарубежный джаз', '外国爵士乐'],
        ['Общение на джазовые темы', '爵士乐主题交流'],
        ['Зарубежный блюз', '外国蓝调音乐'],
        ['Общение на блюзовые темы', '蓝调主题交流'],
        ['Отечественный джаз и блюз', '国内爵士乐和蓝调音乐'],
        //////----------15----------
        ['Рок-музыка', '摇滚音乐'],
        ['Зарубежный Rock', '外国摇滚乐'],
        ['Зарубежный Metal', '外国金属乐'],
        ['Зарубежные Alternative, Punk, Independent', '国外另类、朋克、独立音乐'],
        ['Отечественный Rock, Metal', '国内摇滚、金属'],
        //////----------16----------
        ['Trance, Goa Trance, Psy-Trance, PsyChill, Ambient, Dub', 'Trance、Goa Trance、Psy-Trance、PsyChill、Ambient、Dub'],
        ['House, Techno, Hardcore, Hardstyle, Jumpstyle', 'House、Techno、Hardcore、Hardstyle、Jumpstyle'],
        ['Drum & Bass, Jungle, Breakbeat, Dubstep, IDM, Electro', 'Drum & Bass、Jungle、Breakbeat、Dubstep、IDM、Electro'],
        ['Chillout, Lounge, Downtempo, Trip-Hop', 'Chillout、Lounge、Downtempo、Trip-Hop'],
        ['Traditional Electronic, Ambient, Modern Classical, Electroacoustic, Experimental', '传统电子乐、环境乐、现代古典乐、电声乐、实验乐'],
        ['Industrial, Noise, EBM, Dark Electro, Aggrotech, Cyberpunk, Synthpop, New Wave', '工业、噪音、EBM、黑暗电子、Aggrotech、赛博朋克、合成流行、新浪潮'],
        //////----------17----------
        ['Hi-Res форматы, оцифровки', '高保真格式、数字化'],
        ['Архив', '存档'],
        ['Для общения', '交流'],
        ['Hi-Res, оцифровки', '高保真、数字化'],
        ['Hi-Res stereo и многоканальная музыка', '高保真立体声和多声道音乐'],
        ['Оцифровки с аналоговых носителей', '模拟媒体数字化'],
        ['Неофициальные конверсии цифровых форматов', '非官方数字格式转换'],
        //////----------18----------
        ['音乐льное видео', '音乐视频'],
        ['Помощь по музыкальным видео', '音乐视频帮助'],
        ['音乐льное SD видео', '标清音乐视频'],
        ['音乐льное DVD видео', '音乐 DVD 视频'],
        ['Неофициальные DVD видео', '非官方 DVD 视频'],
        ['音乐льное HD видео', '高清音乐视频'],
        ['Некондиционное музыкальное видео', '未剪辑音乐视频'],
        ['Видео, DVD видео, HD видео', '视频、DVD 视频、高清视频'],
        //////----------19----------
        ['Игры', '游戏'],
        ['游戏 для Windows', 'Windows 游戏'],
        ['搜索 и обсуждение игр для Windows', '搜索和讨论 Windows 游戏'],
        ['Горячие Новинки', '热门新发布'],
        ['Аркады', '游戏厅游戏'],
        ['Файтинги', '格斗游戏'],
        ['Экшены от первого лица', '第一人称动作游戏'],
        ['Экшены от третьего лица', '第三人称动作游戏'],
        ['Хорроры', '恐怖游戏'],
        ['Приключения и квесты', '冒险和解谜游戏'],
        ['Квесты в стиле "搜索 предметов"', '探险式任务'],
        ['Визуальные новеллы', '视觉小说'],
        ['Для самых маленьких', '幼儿游戏'],
        ['Логические игры', '逻辑游戏'],
        ['Шахматы', '棋类游戏'],
        ['Ролевые игры', '角色扮演游戏'],
        ['Симуляторы', '模拟游戏'],
        ['Стратегии в реальном времени', '即时策略游戏'],
        ['Пошаговые стратегии', '回合制战略游戏'],
        ['Антологии и сборники игр', '游戏选集和合集'],
        ['Старые игры (Экшены)', '老游戏（动作游戏）'],
        ['Старые игры (角色扮演游戏)', '老游戏（角色扮演游戏）'],
        ['Старые игры (Стратегии)', '老游戏（策略游戏）'],
        ['Старые игры (冒险和解谜游戏)', '老游戏（冒险和解谜游戏）'],
        ['Старые игры (模拟游戏)', '老游戏（模拟游戏）'],
        ['IBM-PC-несовместимые компьютеры', '与 IBM PC 兼容的计算机游戏'],
        ['Официальные патчи, моды, плагины, дополнения', '官方补丁、MOD、插件、附加组件'],
        ['Неофициальные модификации, плагины, дополнения', '非官方修改、插件、附加组件'],
        ['Русификаторы', '俄语游戏'],
        ['Прочее для Windows-игр', '其他适用于 Windows 的游戏'],
        ['Прочее для Microsoft Flight Simulator, Prepar3D, X-Plane', '适用于微软飞行模拟器、Prepar3D、X-Plane 的其他游戏'],
        ['游戏 для Apple Macintosh', 'Apple 电脑游戏'],
        ['游戏 для Linux', 'Linux 游戏'],
        ['游戏 для консолей', '游戏机游戏'],
        ['Видео для консолей', '游戏机视频'],
        ['游戏 для мобильных устройств', '移动设备游戏'],
        ['Игровое видео', '游戏视频'],
        //////----------20----------
        ['помощь', '帮助'],
        ['предложения по улучшению категории "Программы и Дизайн"', '关于改进“软件与设计”类别的建议'],
        ['Инструкции, руководства, обзоры программ', '教程、手册、节目评论'],
        ['Операционные системы от Microsoft', '微软操作系统'],
        ['Linux, Unix и другие ОС', 'Linux、Unix 和其他操作系统'],
        ['Тестовые диски для настройки аудио/видео аппаратуры', '用于设置音频/视频设备的测试光盘'],
        ['Системы для бизнеса, офиса, научной и проектной работы', '商业、办公、科学和项目工作系统'],
        ['Веб-разработка и 编程', '网络开发和编程'],
        ['Программы для работы с мультимедиа и 3D', '多媒体和 3D 软件'],
        ['Материалы для мультимедиа и дизайна', '多媒体和设计材料'],
        ['ГИС, системы навигации и карты', '地理信息系统、导航系统和地图'],
        //////----------21----------
        ['Мобильные устройства', '移动设备'],
        ['Приложения для мобильных устройств', '移动设备应用'],
        ['Видео для мобильных устройств', '移动设备视频'],
        //////----------22----------
        ['для Macintosh', '用于 Macintosh'],
        ['Аудио редакторы и конвертеры', '音频编辑器和转换器'],
        ['Офисные программы', '办公软件'],
        ['Видео', '视频'],
        ['视频 HD', '高清视频'],
        ['Фильмы HD для Apple TV', '适用于 Apple TV 的高清电影'],
        ['连续剧 HD для Apple TV', '适用于 Apple TV 的高清连续剧'],
        ['Аудио', '音频'],
        ['音频книги', '有声读物'],
        ['AAC, ALAC', 'AAC、ALAC'],
        ['音乐 lossless', '无损音乐'],
        ['ALAC', 'ALAC'],
        ['音乐 Lossy', '有损音乐'],
        ['AAC-iTunes', 'AAC-iTunes'],
        ['F.A.Q.', '常见问题'],
        //////----------23----------
        ['Разное', '杂项'],
        ['Картинки', '图片'],
        ['Публикации и учебные материалы', '出版物和教材'],
        ['тексты', '文本'],
        //////----------24----------
        ['Обсуждения, встречи, общение', '讨论、会议、社交'],
        ['交流 пользователей', '用于用户交流'],
        ['用于用户交流 других ресурсов', '用于其他资源用户之间的交流'],
        ['Флудилка', '弗卢迪卡'],
        ['Юридический', '法律咨询'],
        ['Бизнес-форум', '商业论坛'],
        ['Раздел Пиратской партии России', '俄罗斯海盗党分部'],
        ['Место сбора для релиз-групп', '发布团队的聚集地'],
        ['Место встречи изменить...', '改变......的聚集地'],
        ['Отчеты о встречах', '会议报告'],
        ['Архив', '存档'],
        ['Общий', '一般事务'],
        ////----------底部----------
        ['Статистика', '统计数据'],
        ['Зарегистрированных пользователей', '注册用户'],
        ['Раздач', '发布数量'],
        ['Живых', '可用数量'],
        ['Размер', '数据总量'],
        ['Пиров', '用户总数'],
        ['Сиды', '正在做种'],
        ['Личи', '正在下载'],
        ['Отметить 所有主题 как прочитанные', '将所有主题标记为已读'],
        ['Сбросить отметку', '重置标记'],
        ['Текущее время', '当前时间'],
        ['Условия использования', '使用条款'],
        ['Реклама на сайте', '网站广告'],
        ['Для правообладателей', '版权所有者'],
        ['Для прессы', '新闻媒体'],
        ['Для провайдеров', '网络服务供应商'],
        ['Торрентопедия', '种子百科'],
        ['Конкурсы', '竞赛'],
        ['Случайная раздача', '随机发布页面'],
        ['Администрация', '管理员'],
        ['Модераторы', '版主'],
        ['Тех. 帮助', '技术支持'],
        ['Telegram-канал', 'Telegram 频道'],
        ////----------左侧----------
        ['Правила', '规则'],
        ['Как тут качать', '如何下载'],
        ['Основные понятия', '基本概念'],
        ['Общие вопросы', '一般问题'],
        ['Что такое torrent', '什么是种子'],
        ['торрент', '种子'],
        ['Как пользоваться 搜索ом', '如何使用搜索'],
        ['Кому задать вопрос', '向谁提问'],
        ['Как создать раздачу', '如何创建分发'],
        ['Как залить картинку', '如何上传图片'],
        ['Угнали аккаунт', '帐户被劫持'],
        ['забанили', '禁用'],
        ['Как почистить кеш и куки', '如何清除缓存和 cookie'],
        ['Как перезалить 种子-файл', '如何重新上传种子文件'],
        ['Хочу лычку', '我想要徽章'],
        ['Несовместимые с трекером', '与跟踪器不兼容'],
        ['uTorrent', 'uTorrent'],
        ['Другие BitTorrent клиенты', '其他 BitTorrent 客户端'],
        ['BitTorrent клиенты', 'BitTorrent 客户端'],
        ['Клиенты под Linux', 'Linux 客户端'],
        ['Как настроить клиент на максимальную скорость', '如何配置客户端以获得最高速度'],
        ['Обработка аудио и видео', '音频和视频处理'],
        ['设置 роутеров и файерволлов', '设置路由器和防火墙'],
        ['Решение проблем с компьютерами', '解决计算机问题'],
        ['Хеш-сумма и магнет-ссылки', '哈希值和磁力链接'],
        ['常见问题 по учёту статистики', '数据统计常见问题解答'],
        ['Кино, 视频, ТВ', '电影、视频、电视'],
        ['Фильмы', '电影'],
        ['Арт-хаус и авторское кино', '艺术电影和自创电影'],
        ['Док. фильмы', '纪录片'],
        ['Юмор', '幽默剧'],
        ['Книги, Ин. языки, Уроки', '书籍、语言、课程'],
        ['Книги', '书籍'],
        ['Обучающее видео', '教育视频'],
        ['Ин. языки', '语言'],
        ['音乐, Ноты, Караоке', '音乐、乐谱、卡拉 OK'],
        ['Рок музыка', '摇滚音乐'],
        ['Классическая музыка', '古典音乐'],
        ['Джаз и Блюз', '爵士和蓝调'],
        ['Поп музыка', '流行音乐'],
        ['Фольклор', '民谣'],
        ['Электронная музыка', '电子音乐'],
        ['Саундтреки и Караоке', '原声带和卡拉 OK'],
        ['Шансон, Авторская песня', '香颂、作家之歌'],
        ['Ноты и Либретто', '乐谱和剧本'],
        ['游戏, Программы, КПК', '游戏、程序、掌上电脑'],
        ['Операционные системы', '操作系统'],
        ['Системные программы', '系统程序'],
        ['Веб-разработка', '网页开发'],
        ['Клипарты', '图形设计'],
        ['Мультимедиа и 3D контент', '多媒体和 3D 内容'],
        ['Мобильные тел. и КПК', '移动电话和掌上电脑'],
        //----------消息(https://rutracker.net/forum/privmsg.php)----------
        ['Срок хранения 消息', '消息保存时长'],
        ['дней', '天'],
        ['Удалить отмеченное', '删除标记'],
        ['Тема', '主题'],
        ['От', '来自'],
        ['Дата', '日期'],
        ['Кому', '发给'],
        ['В этой папке нет сообщений', '此文件夹中没有邮件'],
        ['Удалить все', '删除所有内容'],
        ['очистить папку', '清空文件夹'],
        ['Вы уверены, что хотите удалить эти сообщения?', '您确定要删除这些消息吗？'],
        ['Подтвердите', '确认'],
        ['来自метить', '标记'],
        ['Переключить', '切换全选'],
        ['Показаны только сообщения от', '只显示来自TA的消息'],
        ['Показаны только сообщения к', '只显示发给TA的消息'],
        ['показать все 消息', '显示所有消息'],
        ['Сообщения не найдены', '无'],
        ['В папке ', ''],
        [' находятся отправленные, но еще не прочитанные получателем сообщения', '文件夹包含已发送但收件人尚未阅读的邮件。'],
        ['. В ', '仅当收件人阅读后，它们才会出现在'],
        [' они попадают только после того, как получатель их прочтет. Сообщения, находящиеся в папке ', '中。'],
        [', можно отредактировать или удалить.', '文件夹中的邮件可以编辑或删除。'],
        //----------个人资料(https://rutracker.net/forum/profile.php)----------
        ['个人资料 пользователя', '用户资料'],
        ['Изменить профиль', '编辑个人资料'],
        ['Редактирование профиля', '编辑您的个人资料'],
        ['Регистрационная информация', '注册信息'],
        ['Аватар', '头像'],
        ['Звание', '等级'],
        ['нет', '无'],
        ['Контакты', '联系人'],
        ['Личное сообщ.', '私信'],
        ['来自править', '发送'],
        ['登录.', '已收到'],
        ['来自правл.', '已发送'],
        ['Сессии', '会话'],
        ['Выйти на всех устройствах', '在所有设备上注销'],
        ['Роль', '角色'],
        ['Пользователь', '用户'],
        ['Стаж', '资历'],
        ['года', '年'],
        ['месяцев', '月'],
        ['Зарегистрирован:', '注册日期:'],
        ['Сообщения', '留言'],
        ['сообщения', '留言'],
        ['来自веты', '回复'],
        ['来自куда', '来自'],
        ['Китай', '中国'],
        ['Выберите страну', '选择国家'],
        ['Пол', '性别'],
        ['Женский', '女'],
        ['Засекречен', '性别'],
        ['Мужской', '男'],
        ['统计数据 отключена', '统计已禁用'],
        ['как включить', '如何打开'],
        ['Дополнительно', '高级'],
        ['Разрегистрированные 发布', '未登记的发布'],
        ['ИНФОРМАЦИЯ', '信息'],
        ['Подходящих тем или сообщений не найдено', '未找到合适的主题或信息'],
        ['Вернуться на страницу 搜索а', '返回搜索页面'],
        ['У вас 无 избранных тем', '您没有喜欢的主题'],
        ['У вас 无 будущих закачек', '您没有计划的下载'],
        ['РЕГИСТРАЦИОННАЯ 信息', '注册信息'],
        ['性别я, отмеченные', '标有'],
        [', обязательны к заполнению', ' 的字段是必填项'],
        ['Имя', '用户名'],
        ['Текущий пароль', '当前密码'],
        ['Введите текущий пароль', '输入当前密码'],
        ['если хотите изменить его или e-mail', '或电子邮箱'],
        ['Новый пароль', '新密码'],
        ['Введите новый пароль', '如果要更改当前密码'],
        ['если меняете текущий', '请输入新密码'],
        ['максимум', '最多'],
        ['символов', '个字符'],
        ['Email', '电子邮箱'],
        ['Персональная информация', '个人信息'],
        ['Род занятий', '职业'],
        ['Интересы', '兴趣爱好'],
        ['Часовой пояс', '时区'],
        ['Личные настройки', '个人设置'],
        ['Подпись', '签名'],
        ['Макс. ШИРИНА×ВЫСОТА картинок', '图片最大宽度×最大高度'],
        ['Макс. вес картинок', '最大图片体积'],
        ['Макс. длина текста', '最大文字长度'],
        ['Запрещены ссылки на сторонние ресурсы сети', '禁止链接第三方网络资源'],
        ['Как отключить показ подписей', '如何禁止显示签名'],
        ['очистить', '清空'],
        ['предпросмотр', '预览'],
        ['来自ключить получение и отправку 消息', '禁用接收和发送消息'],
        ['Включить учет отданного', '启用捐赠统计'],
        ['Да', '是'],
        ['Нет', '否'],
        ['Скрывать список активных раздач', '隐藏活动捐赠列表'],
        ['Добавлять ретрекер в 种子-файлы', '为种子文件添加跟踪器'],
        ['Добавлять название темы в имя скачиваемого 种子-файла', '在下载的种子文件名中添加主题名称'],
        ['来自ключить анимацию иконок', '禁用图标动画'],
        ['Доменное имя для трекера', '跟踪器域名'],
        ['Не работает для magnet-ссылок. Оставьте поле пустым для домена по умолчанию', '不适用于磁力链接，默认域请留空'],
        ['УПРАВЛЕНИЕ АВАТАРОЙ', '头像管理'],
        ['Изображение под вашим именем в 留言х', '帖子中您用户名下的图片'],
        ['Максимальные ШИРИНА и ВЫСОТА', '最大宽度和高度'],
        ['пикселов', '像素'],
        ['Максимальный вес', '最大体积'],
        ['Подробнее об ограничениях', '了解更多限制信息'],
        ['Загрузить аватару', '上传头像'],
        ['Удалить изображение', '删除图片'],
        ['пользователя', '用户'],
        ['Изменить профиль', '更改个人资料'],
        ['Информация', '信息'],
        ['Вернуться на главную', '返回主页'],
        ['Новые ответы в начатых темах не найдены', '在已发起的主题中未发现新回复'],
        //----------搜索(https://rutracker.net/forum/search.php)----------
        ['Результатов 搜索а', '搜索结果'],
        ['搜索 по раздачам', '按发布搜索'],
        ['Перейти к разделу', '前往版区'],
        ['Все имеющиеся', '全部'],
        //['фильтр по названию раздела', '按版区名称筛选'],
        ['Упорядочить по', '排序方式'],
        ['Название темы', '主题名称'],
        ['Количество скачиваний', '下载次数'],
        ['Количество сидов', '做种数量'],
        ['Количество личей', '下载数量'],
        ['по возрастанию', '升序'],
        ['по убыванию', '降序'],
        ['Показывать только', '仅显示'],
        ['Только открытые 发布', '仅公开的发布'],
        ['Новые с посл. посещения', '自上次访问以来最新发布'],
        ['Скрыть содержимое', '隐藏内容'],
        ['Торренты за', '种子发布时间'],
        ['за все время', '过去所有'],
        ['за сегодня', '过去 1 天'],
        ['последние 3 дня', '过去 3 天'],
        ['посл. неделю', '过去 7 天'],
        ['посл. 2 недели', '过去 14 天'],
        ['последний месяц', '过去 30 天'],
        ['作者 发布', '发布作者'],
        ['Название содержит', '标题包含'],
        ['В подразделах', '在小节中'],
        ['Категории', '在版区中'],
        ['Всех разделах', '所有部分'],
        ['По форуму', '在论坛中'],
        ['Ссылки', '链接'],
        ['Простой 搜索', '简单搜索'],
        ['Ссылка на выбранные разделы', '链接到选定的部分'],
        ['Помощь по 搜索у', '搜索帮助'],
        ['Добавлен', '更新日期'],
        ['Страницы', '页数'],
        ['Редактировать', '编辑'],
        ['来自крыть непрочитанные', '打开未读'],
        ['Форум', '版区分类'],
        ['Автор', '作者'],
        ['来自в.', '回复'],
        ['Посл. сообщение', '最后回复'],
        ['Для удаления тем из списка нажмите на иконку слева от названия любого раздела', '要从列表中删除主题，请单击任意部分名称左侧的图标'],
        ['След.', '下一页'],
        ['Пред.', '上一页'],
        ['К странице...', '跳转到...'],
        ['Перейти', '前往'],
        ['Показывать', '展示'],
        ['только новые темы', '仅新主题'],
        ['только новые 留言', '仅新消息'],
        ['Подписка', '订阅'],
        ['Не найдено', '无'],
        ['Зарегистрирован', '发布日期'],
        ['Цитировать', '引用'],
        ['-Янв-', '-1月-'],
        ['-Фев-', '-2月-'],
        ['-Мар-', '-3月-'],
        ['-Апр-', '-4月-'],
        ['-Май-', '-5月-'],
        ['-Июн-', '-6月-'],
        ['-Июл-', '-7月-'],
        ['-Авг-', '-8月-'],
        ['-Сен-', '-9月-'],
        ['-Окт-', '-10月-'],
        ['-Ноя-', '-11月-'],
        ['-Дек-', '-12月-'],
        ['-Янв', '-1月'],
        ['-Фев', '-2月'],
        ['-Мар', '-3月'],
        ['-Апр', '-4月'],
        ['-Май', '-5月'],
        ['-Июн', '-6月'],
        ['-Июл', '-7月'],
        ['-Авг', '-8月'],
        ['-Сен', '-9月'],
        ['-Окт', '-10月'],
        ['-Ноя', '-11月'],
        ['-Дек', '-12月'],
        ['Ничего не было изменено', '没有任何改变'],
        ['前往 к просмотру профиля', '转到个人资料'],
        ['Управление аватарой', '头像管理'],
        ['Закачки', '下载设置'],
        ['-Дек-', '-12 月-'],
        ['по разделу', '按部分'],
        ['по подразд.', '按小节'],
        ['горячая', '热门'],
        ['Время размещения', '发布时间']
    ]);

    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            i18n.forEach((value, key) => {
                node.nodeValue = node.nodeValue.replace(new RegExp(key, 'g'), value);
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node instanceof HTMLInputElement) {
                i18n.forEach((value, key) => {
                    node.value = node.value.replace(new RegExp(key, 'g'), value);
                });
            }
            node.childNodes.forEach(replaceText);
        }
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(replaceText);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    replaceText(document.body);
})();

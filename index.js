const TelegramBot = require('node-telegram-bot-api'); 

const token = '1708113676:AAERjm0n5tAODa_9iKIZbVbvjD0gp0z9VTA'
const bot = new TelegramBot(token, {polling: true});

const welcomeRusMessage = 'Привет, я - @remindmemathew_bot, бот-напоминалка.\nЧтобы создать напоминание напиши: <b>/напомни</b> \[ваше напоминание\] <b>в</b> \[время напоминания\].\n<b>Внимание!!!</b> Используйте 24h формат времени (пр.: 19:41), иначе бот просто не поймет вас :(\nЧтобы узнать все доступные команды используйте команду <b>/помощь</b>'
const welcomeEngMessage = 'Hi, i\'m @remindmemathew_bot, a reminder bot. \nTo create a reminder write: <b>/remindme</b> \[your reminder\] <b>at</b> \[reminder time\].\n<b>Attention!!!</b> Use 24h time format (ex.: 19:41), otherwise the bot simply won\'t understand you :(\nTo find out all the available commands use the command <b>/help</b>'

let notes = []
let language = ''

const keyboard = [
  [
    {
      text: '🇬🇧 eng', 
      callback_data: 'eng' 
    }
  ],
  [
    {
      text: '🇷🇺 rus',
      callback_data: 'rus'
    }
  ]
]

bot.onText(/\/start/, (msg) => {
	const userId = msg.from.id

	async function x() {
		await bot.sendSticker(msg.chat.id, './img/AnimatedSticker.tgs')

		bot.sendMessage(userId, 'Hi, i\'m a @remindmemathew_bot. Please choose a language\nПривет, я - @remindmemathew_bot. Пожалуйста выбери язык', {
			reply_markup: {
				inline_keyboard: keyboard
			}
		})
	}
	x()
	
})


bot.on('callback_query', (query) => {
	const chatId = query.message.chat.id	
	
	if (query.data === 'eng') {
		language = 'eng'
	}

	if (query.data === 'rus') {
		language = 'rus'
	}

	if (language === 'rus') {
		bot.sendMessage(chatId, welcomeRusMessage, {parse_mode: 'HTML'})
		

		bot.onText(/\/помощь/, (msg) => {
			const userId = msg.from.id

			bot.sendMessage(userId, '<b>/start</b> - запускает бота\n<b>/напомни</b> - создаёт напоминание', {parse_mode: 'HTML'})
		})

		bot.onText(/напомни (.+) в (.+)/, (msg, match) => {
			const userId = msg.from.id
			const text = match[1]
			const time = match [2]

			notes.push({'uid': userId, 'time': time, 'text': text})

			bot.sendMessage(userId, 'Отлично! Я обязательно напомню.')	
		})

		setInterval(() => {
			for (let i = 0; i < notes.length; i++) {
				const curDate = new Date().getHours() + ':' + new Date().getMinutes()
				if (notes[i]['time'] === curDate) {
					bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: <b>' + notes[i]['text'] + '</b> сейчас.', {parse_mode: 'HTML'})
					notes.splice(i, 1)
				} 
			}
		}, 1000)
	} else if (language === 'eng') {
		bot.sendMessage(chatId, welcomeEngMessage, {parse_mode: 'HTML'})

		bot.onText(/\/help/, (msg) => {
			const userId = msg.from.id

			bot.sendMessage(userId, '<b>/start</b> - launches the bot\n<b>/remindme</b> - create a reminder', {parse_mode: 'HTML'})
		})

		bot.onText(/remindme (.+) at (.+)/, (msg, match) => {
			const userId = msg.from.id
			const text = match[1]
			const time = match [2]

			notes.push({'uid': userId, 'time': time, 'text': text})

			bot.sendMessage(userId, 'Excellent! I will defintitely remind you.')
		})

		setInterval(() => {
			for (let i = 0; i < notes.length; i++) {
				const curDate = new Date().getHours() + ':' + new Date().getMinutes()
				if (notes[i]['time'] === curDate) {
					bot.sendMessage(notes[i]['uid'], 'I remind you, that you must: <b>' + notes[i]['text'] + '</b> now.', {parse_mode: 'HTML'})
					notes.splice(i, 1)
				}
			}
		}, 1000)
	}
})
